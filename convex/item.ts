import { ConvexError, v } from "convex/values";
import { mutation, query } from "./functions";

export const getItem = query({
  args: { id: v.id("items") },
  handler: async (ctx, args) => {
    return await ctx.table("items").getX(args.id);
  },
});

export const addItem = mutation({
  args: {
    listId: v.id("lists"),
    text: v.optional(v.string()),
    image: v.optional(
      v.object({ storageId: v.id("_storage"), name: v.string() }),
    ),
  },
  handler: async (ctx, args) => {
    const list = await ctx.table("lists").get(args.listId);
    if (!list) throw new ConvexError(`Could not find list ${args.listId}`);
    if (!args.text && !args.image)
      throw new ConvexError("Item must contain something");

    const item = await ctx
      .table("items")
      .insert({
        listId: args.listId,
        text: args.text,
      })
      .get();
    if (args.image)
      await ctx.table("images").insert({
        storageId: args.image.storageId,
        name: args.image.name,
        itemId: item._id,
      });

    return item;
  },
});

export const deleteItem = mutation({
  args: { id: v.id("items") },
  handler: async (ctx, args) => {
    await ctx.table("items").getX(args.id).delete();
  },
});

export const editItem = mutation({
  args: { id: v.id("items"), newText: v.string() },
  handler: async (ctx, args) => {
    const item = await ctx.table("items").get(args.id);

    if (!item) throw new ConvexError(`Failed to find item ${args.id}`);
    const text = args.newText.trim();
    if (text.length === 0) throw new ConvexError("New text cannot be empty");
    if (item.text === text)
      throw new ConvexError(`Nothing has changed in ${text}`);

    await ctx.table("items").getX(args.id).patch({ text: args.newText });
  },
});
