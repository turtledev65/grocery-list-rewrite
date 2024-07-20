"use client"

import { socket } from "@/socket";
import { useQuery } from "@tanstack/react-query";

const useGetAllLists = () => {
  const query = useQuery({
    queryKey: ["all-lists"],
    queryFn: async () => {
      const res = await socket.emitWithAck("get-all-lists");
      if ("error" in res) throw new Error(res.error);
      return res;
    },
  });

  return query;
};

export default useGetAllLists;
