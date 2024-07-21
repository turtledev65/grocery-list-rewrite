"use client";

import { useContext } from "react";
import { BiSidebar as SidebarIcon } from "react-icons/bi";
import { SlOptionsVertical as OptionsIcon } from "react-icons/sl";
import { MdClose as CloseIcon } from "react-icons/md";
import { FaRegTrashAlt as DeleteIcon } from "react-icons/fa";
import { useRouter } from "next/navigation";
import usePanel from "../hooks/ui/usePanel";
import useCurrentList from "../hooks/list/use-current-list";
import { SidebarContext } from "../providers/sidebar-provider";
import { useDeleteList } from "../hooks/list";

const Navbar = () => {
  const router = useRouter();

  const currentList = useCurrentList();
  const { mutate: deleteList } = useDeleteList();

  const { activate } = useContext(SidebarContext);
  const activateOptionsPanel = usePanel(() => {
    if (!currentList)
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

    return {
      title: "Options",
      data: [
        {
          label: "Close",
          icon: <CloseIcon className="text-xl" />,
          action: () => router.push("/home"),
        },
        {
          label: "Delete",
          icon: <DeleteIcon className="text-xl" />,
          action: () => {
            deleteList(currentList.id);
            router.push("/home");
          },
          critical: true,
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
      {currentList && <h1 className="text-lg">{currentList.name}</h1>}
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
