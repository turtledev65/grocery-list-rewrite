"use client";

import { usePathname } from "next/navigation";
import { useContext, useMemo } from "react";
import { BiSidebar as SidebarIcon } from "react-icons/bi";
import { SlOptionsVertical as OptionsIcon } from "react-icons/sl";
import { useGetList } from "../list/[id]/_hooks";
import { SidebarContext } from "../providers";
import { MdClose as CloseIcon } from "react-icons/md";
import { FaRegTrashAlt as DeleteIcon } from "react-icons/fa";
import { useRouter } from "next/navigation";
import usePanel from "../hooks/ui/usePanel";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isEditingList = useMemo(() => pathname.includes("list"), [pathname]);

  const listId = useMemo(() => {
    const idx = pathname.search("list/");
    if (idx < 0) return "";
    return pathname.substring(idx + "list/".length);
  }, [pathname]);
  const { data: list } = useGetList(listId);

  const { activate } = useContext(SidebarContext);
  const activateOptionsPanel = usePanel(() => {
    if (isEditingList)
      return {
        title: "Options",
        data: [
          {
            label: "Close",
            icon: <CloseIcon className="text-xl" />,
            action: () => router.push("/"),
          },
          {
            label: "Delete",
            icon: <DeleteIcon className="text-xl" />,
            action: () => {},
            critical: true,
          },
        ],
      };

    return {
      title: "Options",
      data: [
        {
          label: "Close",
          icon: <CloseIcon className="text-xl" />,
          action: () => {},
        },
      ],
    };
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
      <button
        className="transition-opacity hover:opacity-70"
        onClick={activateOptionsPanel}
      >
        <OptionsIcon className="text-purple-600" />
      </button>
    </nav>
  );
};

export default Navbar;
