"use client";

import { socket } from "@/socket";
import { useQuery } from "@tanstack/react-query";

const useGetList = (id: string) => {
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
