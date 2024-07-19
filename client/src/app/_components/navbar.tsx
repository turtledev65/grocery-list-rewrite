"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BiSidebar as SidebarIcon } from "react-icons/bi";
import { SlOptionsVertical as OptionsIcon } from "react-icons/sl";
import { useGetList } from "../list/[id]/_hooks";

const Navbar = () => {
  const pathname = usePathname();
  const isEditingList = useMemo(() => pathname.includes("list"), [pathname]);

  const listId = useMemo(() => {
    const idx = pathname.search("list/");
    if (idx < 0) return "";
    return pathname.substring(idx + "list/".length);
  }, [pathname]);
  const { data: list } = useGetList(listId);

  return (
    <nav className="flex w-full items-center justify-between p-2">
      <button>
        <SidebarIcon className="text-2xl text-purple-600" />
      </button>
      {isEditingList && <h1 className="text-lg">{list?.name}</h1>}
      <button>
        <OptionsIcon className="text-purple-600" />
      </button>
    </nav>
  );
};

export default Navbar;
