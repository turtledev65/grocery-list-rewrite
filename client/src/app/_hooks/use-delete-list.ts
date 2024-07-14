"use client"

import { socket } from "@/socket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { List } from "@/types";

const useDeleteList = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await socket.emitWithAck("delete-list", { id });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
    onMutate: async listId => {
      await queryClient.cancelQueries({ queryKey: ["all-lists"] });
      const prev = queryClient.getQueryData<List[]>(["all-lists"]);
      queryClient.setQueryData<List[]>(["all-lists"], old => {
        if (!old) return;
        return old.filter(list => list.id !== listId);
      });
      return { prev };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData<List[]>(["all-lists"], context?.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["all-lists"] });
    },
  });

  return mutation;
};

export default useDeleteList;
