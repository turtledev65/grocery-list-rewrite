"use client";

import { socket } from "@/socket";
import { List } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useEditItem = (listId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: { newText: string; id: string }) => {
      const res = await socket.emitWithAck("edit-item", {
        text: args.newText,
        id: args.id,
      });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
    onMutate: args => {
      const list = queryClient.getQueryData<List>([listId]);
      const prevText = list?.items?.find(item => item.id === args.id)?.text;

      queryClient.setQueryData<List>([listId], old => {
        if (!old) return;
        if (old.items === undefined) return;

        const idx = old.items.findIndex(item => item.id === args.id);
        if (idx === undefined || idx < 0) return;

        const newItems = [...old.items];
        const item = newItems[idx];
        newItems[idx] = { ...item, text: args.newText, pending: true };

        return { ...old, items: newItems };
      });

      return {  prevText };
    },
    onError: (error, args, context) => {
      console.error(error);
      queryClient.setQueryData<List>([listId], old => {
        if (!context || !context.prevText) return;
        if (!old) return;
        if (old.items === undefined) return;

        const idx = old.items?.findIndex(item => item.id === args.id);
        if (idx === undefined || idx < 0) return;

        const newItems = [...old.items];
        const item = newItems[idx];
        newItems[idx] = { ...item, text: context.prevText, pending: false };

        return { ...old, items: newItems };
      });
    },
    onSuccess: (res, args, context) => {
      queryClient.setQueryData<List>([listId], old => {
        if (!context) return;
        if (!old) return;
        if (old.items === undefined) return;

        const idx = old.items.findIndex(item => item.id === args.id);
        if (idx === undefined || idx < 0) return;

        const newItems = [...old.items];
        const item = newItems[idx];
        newItems[idx] = { ...item, text: res.text, pending: false };

        return { ...old, items: newItems };
      });
    },
  });

  return mutation;
};

export default useEditItem;
