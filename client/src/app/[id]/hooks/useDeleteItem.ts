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
    onMutate: async itemId => {
      await queryClient.cancelQueries({ queryKey: [listId] });
      const prevList = queryClient.getQueryData<List>([listId]);
      queryClient.setQueryData<List>([listId], old => {
        if (!old) return;
        return { ...old, items: old.items?.filter(item => item.id !== itemId) };
      });
      return { prevList };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData<List>([listId], context?.prevList);
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: [listId]});
    },
  });

  return mutation;
};

export default useDeleteItem;
