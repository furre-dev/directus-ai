import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { PageZodSchema } from "./Types";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getBlocksFromImage(screenshot: Uint8Array<ArrayBufferLike>) {


  const image = Buffer.from(screenshot).toString('base64');

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [
      {
        role: "system", content: ``
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are an assistant who will look at photo and carefully extract data, in the format of the Zod schema.
            Please provide the section_type, and please read the content from the section and write it out int "content" as HTML markup.
            The order should be ascending, starting from 1.
            Please try to insert placeholder data on links and unseenable stuff, image src placeholder should be "https://placehold.co/500x500", you can adjust the pixels if needed!.
            Example: {order: 1, section_type: hero_section, content: "<h1>Welcome to our page</h1><p>This is our website</p><button>Start for free now!</button>"}
            `
          },
          {
            type: "image_url", image_url: {
              url: `data:image/jpeg;base64,${image}`
            }
          }]
      },
    ],
    response_format: zodResponseFormat(PageZodSchema, "Page")
  });

  return completion.choices[0].message.parsed
}