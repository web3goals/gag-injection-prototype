import { getLatestCasts, publishReplyCast } from "./lib/farcaster";
import { generateCaptionAndPrompt, generateImage } from "./lib/llm";
import { uploadBase64String } from "./lib/pinata";

async function main() {
  console.log("Starting...");

  // Get latest cast
  const username = "kiv1n";
  const limit = 10;
  const casts = await getLatestCasts(username, limit);
  const latestCast = casts[0];

  // Generate a caption and a prompt for image generation
  const { caption, prompt } = await generateCaptionAndPrompt(latestCast.text);

  // Generate an image
  const imageBase64String = await generateImage(prompt);

  // Upload image to IPFS
  const imageUrl = await uploadBase64String(imageBase64String);

  // Publish a reply cast
  const link = "https://gag-injection.vercel.app/42";
  const text = `${caption}\n\n${link}`;
  await publishReplyCast(latestCast.hash, text, imageUrl);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
