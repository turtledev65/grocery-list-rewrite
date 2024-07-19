"use client";

import { usePathname } from "next/navigation";
import { useContext, useMemo } from "react";
import { BiSidebar as SidebarIcon } from "react-icons/bi";
import { SlOptionsVertical as OptionsIcon } from "react-icons/sl";
import { useGetList } from "../list/[id]/_hooks";
import { SidebarContext } from "../providers";
import { usePanel } from "./panel";

const Navbar = () => {
  const pathname = usePathname();
  const isEditingList = useMemo(() => pathname.includes("list"), [pathname]);

  const listId = useMemo(() => {
    const idx = pathname.search("list/");
    if (idx < 0) return "";
    return pathname.substring(idx + "list/".length);
  }, [pathname]);
  const { data: list } = useGetList(listId);

  const { activate } = useContext(SidebarContext);
  const activateOptionsPanel = usePanel({
    title: "Options",
    data: [
      { label: "Close", action: () => {} },
      { label: "Delete", action: () => {} },
    ],
  });

  return (
    <nav className="sticky top-0 z-10 flex w-full items-center justify-between bg-gray-50 p-2">
      <button
        onClick={activate}
        className="transition-opacity hover:opacity-70"
      >
        <SidebarIcon className="text-2xl text-purple-600" />
      </button>
      {isEditingList && <h1 className="text-lg">{list?.name}</h1>}
      <button className="transition-opacity hover:opacity-70" onClick={activateOptionsPanel}>
        <OptionsIcon className="text-purple-600" />
      </button>
    </nav>
  );
};

export default Navbar;
