import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

async function generateImage() {
  console.log("Generating image...");

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt =
    'A tired, disheveled writer sitting at a desk surrounded by an enormous mountain of crumpled papers. Their eyes are wide in panic, coffee cups stacked dangerously high beside them. A cat (or dog) is sitting on the keyboard, adding gibberish to the document. In the background, a ghostly version of the writer looms over them, whispering, "Now... rewrite it." The scene is chaotic but hilarious, capturing the exhaustion and absurdity of the writing process.';

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });

  console.log(response.data[0].url);
}

async function main() {
  console.log("Starting...");

  await generateImage();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
