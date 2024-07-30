import { ConvexError, v } from "convex/values";
import { mutation, query } from "./functions";

export const getAllLists = query({
  handler: async ctx => {
    return await ctx.table("lists");
  },
});

export const getList = query({
  args: { id: v.id("lists") },
  handler: async (ctx, args) => {
    const list = await ctx.table("lists").get(args.id);
    if (!list) return;

    const items = await list.edge("items");

    return { ...list, items };
  },
});

export const createList = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.table("lists").insert({ name: args.name });
  },
});

export const deleteList = mutation({
  args: { id: v.id("lists") },
  handler: async (ctx, args) => {
    await ctx.table("lists").getX(args.id).delete();
  },
});

export const renameList = mutation({
  args: { id: v.id("lists"), newName: v.string() },
  handler: async (ctx, args) => {
    const newName = args.newName.trim();
    if (newName.length === 0) throw new ConvexError("New name cannot be empty");

    const list = await ctx.table("lists").get(args.id);
    if (!list) throw new ConvexError(`Could not find list ${args.id}`);
    if (list.name === newName)
      throw new ConvexError("The new name has to change");

    await ctx.table("lists").getX(args.id).patch({ name: newName });
  },
});
