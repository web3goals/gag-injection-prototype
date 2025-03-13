import { parseEther } from "viem";
import { createToken, listToken } from "./lib/contracts";
import { getLatestCasts, publishReplyCast } from "./lib/farcaster";
import { generateCaptionAndPrompt, generateImage } from "./lib/llm";
import { uploadBase64String, uploadJson } from "./lib/pinata";

async function main() {
  console.log("Starting...");

  // Get latest cast
  const username = "kiv1n";
  const limit = 10;
  const casts = await getLatestCasts(username, limit);
  const latestCast = casts[0];

  // Generate a caption and a prompt for image generation
  const styles = ["kind and sweet", "provocative and sarcastic"];
  const style = styles[0];
  const { caption, prompt } = await generateCaptionAndPrompt(
    latestCast.text,
    style
  );

  // Generate an image
  const { base64String: imageBase64String } = await generateImage(prompt);

  // Upload image to IPFS
  const { ipfsUrl: imageIpfsUrl, httpUrl: imageHttpUrl } =
    await uploadBase64String(imageBase64String);

  // Upload a token metadata to IPFS
  const { ipfsUrl: metadataIpfsUrl } = await uploadJson({
    name: caption,
    image: imageIpfsUrl,
  });

  // Create a token
  const tokenAddress = "0x946D3AE183c6BD5a8310b188091109E87c10EEe4";
  const tokenId = await createToken(tokenAddress, metadataIpfsUrl);

  // List the token in the marketplace
  const marketplaceAddress = "0xfe0aed5cbee89869ff505e10a5ebb75e9fc819d7";
  const beneficiary = "0x4306D7a79265D2cb85Db0c5a55ea5F4f6F73C4B1";
  const listingId = await listToken(
    marketplaceAddress,
    beneficiary,
    tokenAddress,
    tokenId,
    parseEther("0.001")
  );

  // // Publish a reply cast
  const link = `https://gag-injection.vercel.app/tokens/${tokenAddress}/${tokenId}`;
  const text = `${caption}\n\n${link}`;
  await publishReplyCast(latestCast.hash, text, imageHttpUrl);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
