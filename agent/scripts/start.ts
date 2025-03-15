import dotenv from "dotenv";
dotenv.config();

import { ObjectId } from "mongodb";
import { chainConfig } from "./config/chain";
import { siteConfig } from "./config/site";
import { stylesConfig } from "./config/styles";
import { createToken, listToken } from "./lib/contracts";
import { getLatestCast, publishReplyCast } from "./lib/farcaster";
import { generateCaptionAndPrompt, generateImage } from "./lib/llm";
import { uploadBase64String, uploadJson } from "./lib/pinata";
import { Agent } from "./mongodb/models/agent";
import {
  findEnabledAgents,
  updateAgent,
} from "./mongodb/services/agent-service";

async function processAgent(agent: Agent) {
  try {
    console.log(`Processing agent '${agent._id}'...`);

    // Checking the agent
    if (agent.disabled) {
      console.log(`Agent '${agent._id}' processing stopped:`, "Agent disabled");
      return;
    }

    // Get latest cast
    const latestCast = await getLatestCast(agent.account);

    // Check if the last cast has been processed by the agent
    if (agent.posts.find((post) => post.parentHash === latestCast.hash)) {
      console.log(
        `Agent '${agent._id}' processing stopped:`,
        "Latest cast already processed"
      );
      return;
    }

    // Generate a caption and a prompt for image generation
    const { caption, prompt } = await generateCaptionAndPrompt(
      latestCast.text,
      stylesConfig[agent.style]
    );

    // Generate an image
    const { base64String: imageBase64String } = await generateImage(prompt);

    // Upload the image to IPFS
    const { ipfsUrl: imageIpfsUrl, httpUrl: imageHttpUrl } =
      await uploadBase64String(imageBase64String);

    // Upload a token metadata to IPFS
    const metadata = {
      name: caption,
      image: imageIpfsUrl,
    };
    const { ipfsUrl: metadataIpfsUrl } = await uploadJson(metadata);

    // Create a token
    const tokenId = await createToken(agent.tokenAddress, metadataIpfsUrl);

    // List the token in the marketplace
    await listToken(
      agent.creatorAddress,
      agent.tokenAddress,
      tokenId,
      chainConfig.marketplaceListTokenPrice
    );

    // Publish a reply cast
    const link = `${siteConfig.url}/tokens/${agent.tokenAddress}/${tokenId}`;
    const text = `${caption}\n\n${link}`;
    const publishCastResponse = await publishReplyCast(
      latestCast.hash,
      text,
      imageHttpUrl
    );
    const publishedCastHash = publishCastResponse.cast.hash;

    // Save a cash hash in the database
    await updateAgent({
      id: agent._id as ObjectId,
      newPosts: [
        {
          token: tokenId.toString(),
          hash: publishedCastHash,
          parentHash: latestCast.hash,
          createdDate: new Date(),
        },
        ...agent.posts,
      ],
    });

    console.log(`Agent '${agent._id}' processed`);
  } catch (error) {
    console.error(`Failed to process agent '${agent._id}':`, error);
  }
}

async function processAgents() {
  console.log("Processing agents...");
  const agents = await findEnabledAgents();
  for (const agent of agents) {
    await processAgent(agent);
  }
}

async function main() {
  console.log("Starting...");

  const minute = 60 * 1000;
  const interval = 60 * minute;

  setInterval(async () => {
    processAgents();
  }, interval);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
