import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllLists = query({
  handler: async ctx => {
    return await ctx.db.query("list").collect();
  },
});

export const getList = query({
  args: { id: v.id("list") },
  handler: async (ctx, args) => {
    const res = await ctx.db.get(args.id);
    if (!res) return null;

    const items = await ctx.db
      .query("item")
      .filter(q => q.eq(q.field("listId"), args.id))
      .collect();
    return { ...res, items };
  },
});

export const createList = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("list", { name: args.name });
  },
});

export const deleteList = mutation({
  args: { id: v.id("list") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const renameList = mutation({
  args: { id: v.id("list"), newName: v.string() },
  handler: async (ctx, args) => {
    const newName = args.newName.trim();
    if (newName.length === 0) throw new ConvexError("New name cannot be empty");

    const list = await ctx.db.get(args.id);
    if (!list) throw new ConvexError(`Could not find list ${args.id}`);
    if (list.name === newName)
      throw new ConvexError("The new name has to change");

    await ctx.db.patch(args.id, { name: newName });
  },
});
