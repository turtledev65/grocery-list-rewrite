"use client";

import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../../convex/_generated/api";

const useCreateList = () => {
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.list.createList),
  });

  return mutation;
};

export default useCreateList;
