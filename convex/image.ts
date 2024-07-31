import { v } from "convex/values";
import { mutation } from "./functions";

export const attachImage = mutation({
  args: {
    storageId: v.id("_storage"),
    itemId: v.id("items"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx
      .table("images")
      .insert({ storageId: args.storageId, itemId: args.itemId, name: args.name });
  },
});
