import { components } from "../../api-collection";
import { z } from "zod";


export type PageType = components["schemas"]["ItemsPages"];

export const PageZodSchema = z.object({
  sections: z.array(z.object({
    order: z.number(),
    section_type: z.string(),
    content: z.string()
  }))
})

