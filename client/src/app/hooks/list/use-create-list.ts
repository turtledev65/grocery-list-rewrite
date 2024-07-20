"use client";

import { socket } from "@/socket";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateList = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await socket.emitWithAck("create-list", { name });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
    onSuccess: data => {
      queryClient.setQueryData([data.id], data);
      queryClient.invalidateQueries({ queryKey: ["all-lists"] });
    },
  });

  return mutation;
};

export default useCreateList;
