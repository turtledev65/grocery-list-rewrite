import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const addItem = mutation({
  args: { listId: v.id("list"), text: v.string() },
  handler: async (ctx, args) => {
    const list = await ctx.db.get(args.listId);
    if (!list) throw new ConvexError(`Could not find list ${args.listId}`);

    const res = await ctx.db.insert("item", {
      listId: args.listId,
      text: args.text,
    });
    return res;
  },
});

export const deleteItem = mutation({
  args: { id: v.id("item") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const editItem = mutation({
  args: { id: v.id("item"), newText: v.string() },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);

    if (!item) throw new ConvexError(`Failed to find item ${args.id}`);
    const text = args.newText.trim();
    if (text.length === 0) throw new ConvexError("New text cannot be empty");
    if (item.text === text)
      throw new ConvexError(`Nothing has changed in ${text}`);

    await ctx.db.patch(args.id, { text: args.newText });
  },
});
