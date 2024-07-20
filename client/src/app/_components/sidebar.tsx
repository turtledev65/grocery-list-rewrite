"use client";

import { MdOutlineSettings as SettingsIcon } from "react-icons/md";
import { useCreateList, useDeleteList, useGetAllLists } from "../_hooks";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { SidebarContext } from "../providers";
import { AnimatePresence, motion } from "framer-motion";
import { FiEdit as CreateListIcon } from "react-icons/fi";
import { LuFilter as FilterIcon } from "react-icons/lu";
import {
  FaSortAmountDownAlt as SortIcon,
  FaRegTrashAlt as DeleteIcon,
} from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { usePanel } from "./panel";

type SortOrder = "asc" | "desc";
type SortType = "name" | "creationDate";
type SortState = { type?: SortType; order: SortOrder };

const Sidebar = () => {
  const { active, deactivate } = useContext(SidebarContext);

  const { data: allLists } = useGetAllLists();
  const { mutate: createList } = useCreateList();

  const router = useRouter();
  const handleCreateList = useCallback(() => {
    createList("Untilted", {
      onSuccess: res => {
        router.push(`/list/${res.id}?new=true`);
        deactivate();
      },
    });
  }, [createList, router]);

  const [sortState, setSortState] = useState<SortState>({ order: "asc" });
  const sortedAllLists = useMemo(() => {
    if (!allLists?.length) return;

    const out = [...allLists];
    if (sortState.type === "name")
      out.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortState.type === "creationDate")
      out.sort((a, b) => {
        const date1 = new Date(a.creationDate).valueOf();
        const date2 = new Date(b.creationDate).valueOf();
        return date1 - date2;
      });
    if (sortState.order === "desc") out.reverse();

    return out;
  }, [allLists, sortState]);

  const activateSortPanel = usePanel({
    title: "Sort by",
    data: [
      [
        {
          label: "List name (A to Z)",
          action: () => setSortState({ type: "name", order: "asc" }),
        },
        {
          label: "List name (Z to A)",
          action: () => setSortState({ type: "name", order: "desc" }),
        },
      ],
      [
        {
          label: "Creation Date (new to old)",
          action: () => setSortState({ type: "creationDate", order: "asc" }),
        },
        {
          label: "Creation Date (old to new)",
          action: () => setSortState({ type: "creationDate", order: "desc" }),
        },
      ],
    ],
  });

  return (
    <AnimatePresence>
      {active && (
        <>
          <motion.div
            key="bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: "75%" }}
            exit={{ opacity: 0 }}
            onClick={deactivate}
            className="fixed inset-0 z-20 cursor-pointer bg-black"
          />
          <motion.aside
            key="sidebar"
            initial={{ left: "-75vw" }}
            animate={{ left: 0, transition: { delay: 0.1 } }}
            exit={{ left: "-75vw" }}
            className={`fixed bottom-0 top-0 z-30 flex w-[75vw] flex-col justify-between rounded-r-xl bg-gray-50 p-4`}
          >
            <div>
              <div className="flex items-center justify-between py-4">
                <h1 className="text-nowrap text-2xl font-bold">All Lists</h1>
                <button className="grid place-items-center transition-opacity hover:opacity-70">
                  <SettingsIcon className="text-2xl text-purple-600" />
                </button>
              </div>
              <div className="flex flex-col">
                {sortedAllLists?.map(list => (
                  <ListButton id={list.id} name={list.name} key={list.id} />
                ))}
              </div>
            </div>
            <div className="flex justify-around p-4 text-2xl text-purple-600">
              <button
                className="transition-opacity hover:opacity-70"
                onClick={handleCreateList}
              >
                <CreateListIcon />
              </button>
              <button
                className="transition-opacity hover:opacity-70"
                onClick={activateSortPanel}
              >
                <SortIcon />
              </button>
              <button className="transition-opacity hover:opacity-70">
                <FilterIcon />
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

const ListButton = ({ id, name }: { id: string; name: string }) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const router = useRouter();
  const { deactivate } = useContext(SidebarContext);
  const [isSelected, setSelected] = useState(false);

  const pathname = usePathname();
  const listId = useMemo(() => {
    const idx = pathname.search("list/");
    if (idx < 0) return "";
    return pathname.substring(idx + "list/".length);
  }, [pathname]);

  const { mutate: deleteList } = useDeleteList();
  const activatePanel = usePanel({
    title: name,
    data: [
      {
        label: "Delete",
        icon: <DeleteIcon className="text-xl" />,
        action: () => {
          deleteList(id);
          if (listId === id) router.push("/");
        },
        critical: true,
      },
    ],
  });

  return (
    <button
      onClick={() => {
        if (isSelected) return;
        router.push(`/list/${id}`);
        deactivate();
      }}
      onMouseDown={() => {
        const timeoutId = setTimeout(() => {
          setSelected(true);
          activatePanel();
        }, 1200);
        timeoutRef.current = timeoutId;
      }}
      onMouseUp={() => {
        clearTimeout(timeoutRef.current);
        setSelected(false);
      }}
      onBlur={() => setSelected(false)}
      className={`select-none rounded-lg px-6 py-1 text-start text-lg transition-colors hover:bg-gray-200 ${isSelected && "bg-purple-600 text-white"}`}
    >
      {name}
    </button>
  );
};

export default Sidebar;
