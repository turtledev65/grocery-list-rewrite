"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { List } from "@/types";

const useCurrentList = () => {
  const pathname = usePathname();
  const listId = useMemo(() => {
    const idx = pathname.search("list/");
    if (idx < 0) return "";
    return pathname.substring(idx + "list/".length);
  }, [pathname]);

  const { data: list } = useQuery(
    convexQuery(api.list.getList, { id: listId as Id<"lists"> }),
  );
  return list as List;
};

export default useCurrentList;
