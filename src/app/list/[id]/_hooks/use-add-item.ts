import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../../../convex/_generated/api";

const useAddItem = (listId: string) => {
  return useMutation({
    mutationFn: useConvexMutation(api.item.addItem),
  });
};

export default useAddItem;
