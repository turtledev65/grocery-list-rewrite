"use client";

import { socket } from "@/socket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const useCreateList = () => {
  const router = useRouter();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await socket.emitWithAck("create-list", { name });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
    onSuccess: data => {
      queryClient.setQueryData([data.id], data);
      router.push(data.id);
    },
  });

  return mutation;
};

export default useCreateList;
