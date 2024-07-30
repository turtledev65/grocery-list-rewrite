import { defineEnt, defineEntSchema, getEntDefinitions } from "convex-ents";
import { v } from "convex/values";

const schema = defineEntSchema({
  lists: defineEnt({
    name: v.string(),
  }).edges("items", { ref: "listId" }),
  items: defineEnt({
    text: v.optional(v.string()),
  })
    .edge("list", { field: "listId" })
    .edge("image", { ref: "itemId", optional: true }),
  images: defineEnt({ name: v.string(), storageId: v.id("_storage") }).edge(
    "item",
    {
      field: "itemId",
    },
  ),
});
export default schema;

export const entDefinitions = getEntDefinitions(schema);
