import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

async function generateCaptionAndPrompt() {
  console.log("Generating caption and prompt...");

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const tweet =
    'I finally got the "first shitty draft" of my book on paper. 114,000 words at the moment. Took way longer than expected. It will probably take another 3x effort to rewrite it. But at least I can get some help with that. So far, it\'s been a massive self brain dump exercise.😂';
  const prompt = [
    "I want to post a comment on Twitter with a funny picture that will attract a lot of people.",
    "Read the following tweet and create a funny caption and prompt for DALL-E 3:",
    tweet,
  ].join("\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "response_schema",
        schema: {
          type: "object",
          properties: {
            caption: {
              description: "The caption",
              type: "string",
            },
            prompt: {
              description: "The prompt for DALL-E 3",
              type: "string",
            },
          },
          additionalProperties: false,
        },
      },
    },
    store: true,
  });

  console.log(completion.choices[0].message);
}

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
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
