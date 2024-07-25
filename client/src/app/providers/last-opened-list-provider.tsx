"use client";

import { List } from "@/types";
import { createContext, PropsWithChildren, useEffect } from "react";
import useLocalStorage from "../hooks/util/useLocalStorage";
import useCurrentList from "../hooks/list/use-current-list";
import { usePathname } from "next/navigation";

type LastOpenedListContextType = {
  lastOpenedList?: List;
};
export const LastOpenedListContext = createContext<LastOpenedListContextType>(
  {},
);

const LastOpeendListProvider = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  const [lastOpenedList, setLastOpenedList] =
    useLocalStorage<List>("last-opened-list");
  const currentList = useCurrentList();

  useEffect(() => {
    if (pathname === "/") return;
    setLastOpenedList(currentList);
  }, [pathname, setLastOpenedList, currentList]);

  return (
    <LastOpenedListContext.Provider value={{ lastOpenedList }}>
      {children}
    </LastOpenedListContext.Provider>
  );
};

export default LastOpeendListProvider;
