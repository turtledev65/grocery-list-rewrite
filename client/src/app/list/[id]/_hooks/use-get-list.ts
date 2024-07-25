"use client";

import { socket } from "@/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const useGetList = (id: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on("list-updated", listId =>
      queryClient.invalidateQueries({ queryKey: [listId] }),
    );

    return () => {
      socket.off("list-updated");
    };
  }, [queryClient]);

  const query = useQuery({
    queryKey: [id],
    queryFn: async () => {
      const res = await socket.emitWithAck("get-list", { id });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
  });

  return query;
};

export default useGetList;
