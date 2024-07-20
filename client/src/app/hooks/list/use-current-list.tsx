"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useGetList } from "@/app/list/[id]/_hooks";

const useCurrentList = () => {
  const pathname = usePathname();
  const listId = useMemo(() => {
    const idx = pathname.search("list/");
    if (idx < 0) return "";
    return pathname.substring(idx + "list/".length);
  }, [pathname]);

  const { data: list } = useGetList(listId);
  return list;
};

export default useCurrentList;
