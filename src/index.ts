import { authentication, createDirectus, createItem, rest, staticToken, uploadFiles } from "@directus/sdk";
import { getPageContent } from "./utils/getPageContent";
import { PageType } from "./utils/Types";
import { getBlocksFromImage } from "./utils/getBlocksFromImage";
import dotenv from "dotenv";

dotenv.config();

const client = createDirectus('https://furkan-cms-migration.directus.app/').with(staticToken(process.env.DIRECTUS_API_AUTH_TOKEN!)).with(rest());
const url = "https://www.sbab.se/1/privat/lana/privatlan/privatlan_-_sa_funkar_det.html"

async function createItemInDirectus() {
  console.log("taking screenshot")
  const { screenshot, title } = await getPageContent(url)

  console.log("extracting content from screenshot, this can take a while please wait...")
  const blocks = await getBlocksFromImage(screenshot);

  if (!blocks) {
    return null;
  }

  const file = new Blob([screenshot], { type: 'image/jpeg' });
  const formData = new FormData();
  formData.append("file", file, "screenshot.jpg");

  const uploadedImage = await client.request(uploadFiles(formData)) as { id: string };

  const item: PageType = {
    title: title,
    screenshot: uploadedImage.id,
    sections: blocks.sections
  };

  const result = await client.request(createItem("pages", item));
  console.log(result);

  return Promise.resolve()
}

createItemInDirectus();

