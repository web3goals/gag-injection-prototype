import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateCaptionAndPrompt(
  post: string,
  style: string
): Promise<{ caption: string; prompt: string }> {
  console.log("Generating caption and prompt...");

  const prompt = [
    "I want to post a comment on social media with a funny image that will attract a lot of people.",
    "Read the following post and create a caption for a comment and a prompt for DALL-E 3 to create an image.",
    `Comment must be in a ${style} style.`,
    "Don't use hashtags in the caption.",
    "Post:",
    post,
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

  const content = completion.choices[0].message.content;

  if (!content) {
    throw new Error("Failed to generate caption and prompt, content is null");
  }

  const contentJson = JSON.parse(content);
  return { caption: contentJson.caption, prompt: contentJson.prompt };
}

export async function generateImage(prompt: string): Promise<string> {
  console.log("Generating image...");

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
    response_format: "b64_json",
  });

  const base64String = response.data[0].b64_json;
  if (!base64String) {
    throw new Error("Failed to generate image, base64String is null");
  }
  return base64String;
}
