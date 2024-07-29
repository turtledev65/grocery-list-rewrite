import { defineEnt, defineEntSchema, getEntDefinitions } from "convex-ents";
import { v } from "convex/values";

const schema = defineEntSchema({
  lists: defineEnt({
    name: v.string(),
  }).edges("items", { ref: "listId" }),
  items: defineEnt({
    text: v.string(),
  }).edge("list", { field: "listId" }),
});
export default schema;

export const entDefinitions = getEntDefinitions(schema);
