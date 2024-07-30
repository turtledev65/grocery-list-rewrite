import { mutation } from "./functions";

export const generateUploadUrl = mutation(async ctx => {
  return await ctx.storage.generateUploadUrl();
});
