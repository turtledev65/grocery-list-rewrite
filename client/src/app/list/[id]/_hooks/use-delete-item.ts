"use client"

import { socket } from "@/socket";
import { List } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteItem = (listId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await socket.emitWithAck("delete-item", { id });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
    onMutate: itemId => {
      const list = queryClient.getQueryData<List>([listId]);
      if (list?.items === undefined) return;

      const idx = list.items.findIndex(item => item.id === itemId);
      if (idx === undefined || idx < 0) return;
      const item = list?.items[idx];

      queryClient.setQueryData<List>([listId], old => {
        if (!old || old.items === undefined) return;
        return { ...old, items: old.items.filter(item => item.id !== itemId) };
      });

      return { idx, item };
    },
    onError: (error, _args, context) => {
      console.error(error);
      queryClient.setQueryData<List>([listId], old => {
        if (!old || old.items === undefined) return;
        if (!context) return;

        const newItems = [...old.items];
        newItems.splice(context.idx, 0, context.item);
        return { ...old, items: newItems };
      });
    },
  });

  return mutation;
};

export default useDeleteItem;
