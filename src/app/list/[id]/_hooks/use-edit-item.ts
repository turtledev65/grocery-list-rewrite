"use client"

import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Ent } from "../../../../../convex/types";

const useEditItem = (listId: string) => {
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.item.editItem).withOptimisticUpdate(
      (localStore, args) => {
        const currList = localStore.getQuery(api.list.getList, {
          id: listId as Id<"lists">,
        });
        if (!currList) return;

        const newItems = [...currList.items];
        const itemIdx = newItems.findIndex(i => i._id === args.id);
        if (itemIdx < 0) return;
        newItems[itemIdx] = {
          ...newItems[itemIdx],
          text: args.newText,
        } as Ent<"items">;

        localStore.setQuery(
          api.list.getList,
          { id: listId as Id<"lists"> },
          { ...currList, items: newItems },
        );
      },
    ),
  });

  return mutation;
};

export default useEditItem;
