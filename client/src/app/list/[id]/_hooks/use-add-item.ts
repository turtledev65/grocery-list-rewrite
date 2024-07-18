"use client";

import { useUploadThing } from "@/app/api/uploadthing/core";
import { socket } from "@/socket";
import { Item, List, Image } from "@/types";
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
    onMutate: async args => {
      await queryClient.cancelQueries({ queryKey: [listId] });

      const { text } = args;
      itemIdRef.current = crypto.randomUUID();

      queryClient.setQueryData<List>([listId], old => {
        if (!old) return;

        const oldItems = old.items ?? [];
        const images = args.imageFiles?.map(
          (file, idx) =>
            ({
              url: URL.createObjectURL(file),
              id: String(idx),
              pending: true,
            }) as Image,
        );
        const newItem: Item = {
          id: itemIdRef.current,
          listId: listId,
          text,
          images: images,
          pending: true,
        };

        return { ...old, items: [...oldItems, newItem] } as List;
      });
    },
    onSuccess: res => {
      queryClient.setQueryData<List>([listId], old => {
        if (!old) return;

        const newItems = [...(old.items ?? [])];
        const idx = newItems.findIndex(i => i.id === itemIdRef.current);
        newItems[idx] = res;

        return { ...old, items: newItems };
      });
    },
    onError: () => {
      queryClient.setQueryData<List>([listId], old => {
        if (!old) return;
        return {
          ...old,
          items: old.items?.filter(item => item.id !== itemIdRef.current),
        };
      });
    },
  });

  return mutation;
};

export default useAddItem;
