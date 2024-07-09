"use client";

import { socket } from "@/socket";
import { Item, List } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useAddItem = (listId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await socket.emitWithAck("add-item", {
        listId: listId,
        text,
      });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
    onMutate: async (text: string) => {
      await queryClient.cancelQueries({ queryKey: [listId] });
      const prevList = queryClient.getQueryData<List>([listId]);
      queryClient.setQueryData<List>([listId], old => {
        if (!old) return;

        const oldItems = old.items ?? [];
        const newItem: Item = {
          id: String(old.items?.length),
          listId: listId,
          text,
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
