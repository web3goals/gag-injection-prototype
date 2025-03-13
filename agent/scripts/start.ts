import dotenv from "dotenv";
dotenv.config();

import { ObjectId } from "mongodb";
import { chainConfig } from "./config/chain";
import { siteConfig } from "./config/site";
import { warpcastConfig } from "./config/warpast";
import { createToken, listToken } from "./lib/contracts";
import { getLatestCasts, publishReplyCast } from "./lib/farcaster";
import { generateCaptionAndPrompt, generateImage } from "./lib/llm";
import { uploadBase64String, uploadJson } from "./lib/pinata";
import { findAgent, updateAgent } from "./mongodb/services/agent-service";

async function main() {
  console.log("Starting...");

  // Load agent from the database
  const agentId = "67d2dcb15b45f92cbb34afcd";
  const agent = await findAgent(new ObjectId(agentId));
  if (!agent) {
    throw new Error("Agent undefined");
  }
  if (agent.disabled) {
    throw new Error("Agent disabled");
  }

  // Get latest cast
  const limit = 10;
  const latestCasts = await getLatestCasts(agent.account, limit);
  const latestCast = latestCasts[0];

  // Generate a caption and a prompt for image generation
  const style =
    agent.style === "KIND_SWEET"
      ? "kind and sweet"
      : "provocative and sarcastic";
  const { caption, prompt } = await generateCaptionAndPrompt(
    latestCast.text,
    style
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
  const castHash = publishCastResponse.cast.hash;

  // Save a cash hash in the database
  await updateAgent({
    id: agent._id as ObjectId,
    newPosts: [
      {
        url: `https://warpcast.com/${warpcastConfig.username}/${castHash}`,
        createdDate: new Date(),
      },
      ...agent.posts,
    ],
  });

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
