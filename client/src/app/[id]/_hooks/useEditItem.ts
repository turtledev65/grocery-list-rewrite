import { socket } from "@/socket";
import { List } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { list } from "postcss";

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
    onMutate: async args => {
      await queryClient.cancelQueries({ queryKey: [listId] });
      const prevList = queryClient.getQueryData<List>([listId]);
      queryClient.setQueryData<List>([listId], old => {
        if (!old) return;

        const newItems = [...old.items!];
        const idx = newItems.findIndex(i => i.id === args.id);
        if (idx < 0) return;
        newItems[idx] = { ...newItems[idx], text: args.newText, pending: true };

        return { ...old, items: newItems };
      });
      return { prevList };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData<List>([listId], context?.prevList);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [listId] });
    },
  });

  return mutation;
};

export default useEditItem;
