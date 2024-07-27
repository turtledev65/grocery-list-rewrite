import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  list: defineTable({
    name: v.string(),
  }),

  item: defineTable({
    listId: v.id("list"),
    text: v.string(),
  }),
});
