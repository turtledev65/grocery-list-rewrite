"use client";

import { useContext } from "react";
import { BiSidebar as SidebarIcon } from "react-icons/bi";
import { SlOptionsVertical as OptionsIcon } from "react-icons/sl";
import { MdClose as CloseIcon } from "react-icons/md";
import { FaRegTrashAlt as DeleteIcon } from "react-icons/fa";
import { useRouter } from "next/navigation";
import usePanel from "../hooks/ui/usePanel";
import { SidebarContext } from "../providers/sidebar-provider";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useCurrentList } from "../hooks/list";

const Navbar = () => {
  const router = useRouter();

  const currentList = useCurrentList();
  const deleteList = useMutation(api.list.deleteList);

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
            deleteList({ id: currentList._id });
            router.push("/home");
          },
          critical: true,
        },
      ],
    };
  });

  return (
    <nav className="sticky top-0 z-10 flex w-full items-center justify-between bg-gray-50 p-4 text-purple-600 dark:bg-zinc-900">
      <button
        onClick={activate}
        className="text-2xl transition-opacity hover:opacity-70"
      >
        <SidebarIcon />
      </button>
      {currentList && (
        <h1 className="text-xl text-black dark:text-white">
          {currentList.name}
        </h1>
      )}
      <button
        className="text-2xl transition-opacity hover:opacity-70"
        onClick={activateOptionsPanel}
      >
        <OptionsIcon />
      </button>
    </nav>
  );
};

export default Navbar;
