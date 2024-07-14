"use client";

import { useUploadThing } from "@/app/api/uploadthing/core";
import { socket } from "@/socket";
import { Item, List, Image } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useAddItem = (listId: string) => {
  const queryClient = useQueryClient();
  const { startUpload } = useUploadThing("imageUploader");

  const mutation = useMutation({
    mutationFn: async (args: { text?: string; imageFiles?: File[] }) => {
      const { text, imageFiles } = args;

      let images: string[] | undefined = [];
      if (imageFiles && imageFiles.length > 0)
        images = (await startUpload(imageFiles))?.map(i => i.url);

      const res = await socket.emitWithAck("add-item", {
        listId: listId,
        text,
        images,
      });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
    onMutate: async args => {
      await queryClient.cancelQueries({ queryKey: [listId] });

      const { text } = args;
      const prevList = queryClient.getQueryData<List>([listId]);
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
          id: String(old.items?.length),
          listId: listId,
          text,
          images,
          pending: true,
        };

        return { ...old, items: [...oldItems, newItem] } as List;
      });
      return { prevList };
    },
    onError: (_data, _variables, context) => {
      queryClient.setQueryData([listId], context?.prevList);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [listId] });
    },
  });

  return mutation;
};

export default useAddItem;
