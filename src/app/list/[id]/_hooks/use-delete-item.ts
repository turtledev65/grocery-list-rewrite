"use client"

import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const useDeleteItem = (listId: string) => {
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.item.deleteItem).withOptimisticUpdate(
      (localStore, args) => {
        const currVal = localStore.getQuery(api.list.getList, {
          id: listId as Id<"lists">,
        });
        if (!currVal) return;

        const newItems = currVal.items.filter(i => i._id !== args.id);
        localStore.setQuery(
          api.list.getList,
          { id: listId as Id<"lists"> },
          { ...currVal, items: newItems },
        );
      },
    ),
  });

  return mutation;
};

export default useDeleteItem;
