import { authentication, createDirectus, createItem, rest, uploadFiles } from "@directus/sdk";
import { components } from "../api-collection";
import fs, { readFileSync } from "fs";

type PageType = components["schemas"]["ItemsPages"];
type PageSectionType = components["schemas"]["ItemsPageSections"];

const filePath = "./images.jpg";

const client = createDirectus('https://furkan-cms-migration.directus.app/').with(authentication()).with(rest());

async function createItemInDirectus() {
  const file = new Blob([readFileSync(filePath)], { type: 'image/jpeg' });
  const formData = new FormData();
  formData.append("file", file, "images.jpg");

  const uploadedImage: { id: string } = await client.request(uploadFiles(formData));
  console.log(uploadedImage);

  const item: PageType = {
    title: "FreeMK",
    screenshot: "3c00d81c-e8e6-47ab-897e-f4f59e2ebf18",
    sections: [{
      content: `
      <h1>Hej!</h1>
      <p>wazap</p>
      `,
      order: 1,
      section_type: "header"
    }]
  }

  const user = await client.login("furkan_abay@hotmail.com", "svUafWRaS6ogotqMENUKe9Pb");
  console.log(user)


  const result = await client.request(createItem("pages", item));
  console.log(result);
}

createItemInDirectus();

