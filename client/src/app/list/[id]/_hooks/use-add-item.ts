"use client";

import { useUploadThing } from "@/app/api/uploadthing/core";
import { socket } from "@/socket";
import { Item, List } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

const useAddItem = (listId: string) => {
  const queryClient = useQueryClient();
  const { startUpload } = useUploadThing("imageUploader");

  const itemIdRef = useRef("");
  const mutation = useMutation({
    mutationFn: async (args: { text?: string; imageFiles?: File[] }) => {
      const { text, imageFiles } = args;

      let images: string[] | undefined = [];
      if (imageFiles && imageFiles.length > 0)
        images = (await startUpload(imageFiles))?.map(i => i.url);

      const res = await socket.emitWithAck("add-item", {
        listId: listId,
        id: itemIdRef.current,
        text,
        images,
      });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
    onMutate: args => {
      itemIdRef.current = crypto.randomUUID();
      queryClient.setQueryData<List>([listId], old => {
        if (!old) return;
        if (old.items === undefined) return;

        const newItem = {
          listId: listId,
          id: itemIdRef.current,
          text: args.text,
          images: args.imageFiles,
          pending: true,
        } as Item;
        return {
          ...old,
          items: [...old.items, newItem],
        };
      });
    },
    onError: error => {
      console.error(error);

      queryClient.setQueryData<List>([listId], old => {
        if (!old) return;
        if (old.items === undefined) return;

        return {
          ...old,
          items: old.items.filter(item => item.id !== itemIdRef.current),
        };
      });
    },
    onSuccess: res => {
      queryClient.setQueryData<List>([listId], old => {
        if (!old) return;
        if (old.items === undefined) return;

        const newItems = [...old.items];
        const idx = newItems.findIndex(item => item.id === itemIdRef.current);
        if (idx < 0) return;
        newItems[idx] = res;

        return {
          ...old,
          items: newItems,
        };
      });
    },
  });

  return mutation;
};

export default useAddItem;
