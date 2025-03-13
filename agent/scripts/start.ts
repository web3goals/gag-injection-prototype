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
  const { ipfsUrl: metadataIpfsUrl, httpUrl: metadataHttpUrl } =
    await uploadJson({
      name: caption,
      image: imageIpfsUrl,
    });

  // Create a token
  // TODO: Implement

  // Publish a reply cast
  const contract = "0x0";
  const token = 42;
  const link = `https://gag-injection.vercel.app/tokens/${contract}/${token}`;
  const text = `${caption}\n\n${link}`;
  await publishReplyCast(latestCast.hash, text, imageHttpUrl);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
