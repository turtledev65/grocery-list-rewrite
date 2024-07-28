import { generateReactHelpers } from "@uploadthing/react/hooks";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const myFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url, name: file.name };
  }),
} satisfies FileRouter;

export type MyFileRouter = typeof myFileRouter;

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<MyFileRouter>();
