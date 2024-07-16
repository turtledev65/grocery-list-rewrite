"use client";

import { socket } from "@/socket";
import { List } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useRenameList = (listId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await socket.emitWithAck("rename-list", { name, id: listId });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
    onMutate: async name => {
      await queryClient.cancelQueries({ queryKey: [listId] });
      const prevList = queryClient.getQueryData<List>([listId]);
      queryClient.setQueryData<List>([listId], old => {
        if (!old) return;
        return { ...old, name };
      });
      return { prevList };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData<List>([listId], context?.prevList);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["all-lists"] });
    },
  });

  return mutation;
};

export default useRenameList;
