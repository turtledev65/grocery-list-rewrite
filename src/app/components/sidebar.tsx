"use client";

import { MdOutlineSettings as SettingsIcon } from "react-icons/md";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiEdit as CreateListIcon } from "react-icons/fi";
import { LuFilter as FilterIcon } from "react-icons/lu";
import {
  FaSortAmountDown as SortDescIcon,
  FaSortAmountUp as SortAscIcon,
  FaRegTrashAlt as DeleteIcon,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import usePanel from "../hooks/ui/usePanel";
import { SidebarContext } from "../providers/sidebar-provider";
import cn from "classnames";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useCurrentList } from "../hooks/list";

type SortOrder = "asc" | "desc";
type SortType = "name" | "creationDate";
type SortState = { type?: SortType; order: SortOrder };

const Sidebar = () => {
  const { active, deactivate } = useContext(SidebarContext);

  const allLists = useQuery(api.list.getAllLists);
  const createList = useMutation(api.list.createList);

  const router = useRouter();
  const handleCreateList = useCallback(() => {
    createList({ name: "Untilted" }).then(id => {
      router.push(`/list/${id}?new=true`);
      deactivate();
    });
  }, [router, deactivate]);

  const [sortState, setSortState] = useState<SortState>({ order: "asc" });
  const sortedAllLists = useMemo(() => {
    if (!allLists?.length) return;

    const out = [...allLists];
    if (sortState.type === "name")
      out.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortState.type === "creationDate")
      out.sort((a, b) => {
        const date1 = new Date(a._creationTime).valueOf();
        const date2 = new Date(b._creationTime).valueOf();
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
            className="fixed bottom-0 top-0 z-30 flex w-[75vw] flex-col justify-between rounded-r-xl bg-gray-50 p-4 dark:bg-zinc-800"
          >
            <div>
              <div className="flex items-center justify-between py-4">
                <div className="flex flex-col">
                  <h1 className="text-nowrap text-2xl font-bold">
                    All Lists
                    {allLists && (
                      <span className="ml-2 text-sm text-gray-400">
                        ({allLists?.length})
                      </span>
                    )}
                  </h1>
                </div>
                <button className="grid place-items-center transition-opacity hover:opacity-70">
                  <SettingsIcon className="text-3xl text-purple-600" />
                </button>
              </div>
              <div className="flex flex-col">
                {sortedAllLists?.map(list => (
                  <ListButton id={list._id} name={list.name} key={list._id} />
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
                {sortState.order === "desc" ? (
                  <SortDescIcon />
                ) : (
                  <SortAscIcon />
                )}
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

  const currentList = useCurrentList();

  const deleteList = useMutation(api.list.deleteList);
  const activatePanel = usePanel({
    title: name,
    data: [
      {
        label: "Delete",
        icon: <DeleteIcon className="text-xl" />,
        action: () => {
          deleteList({ id: id as Id<"lists"> });
          if (currentList?._id === id) router.push("/home");
        },
        critical: true,
      },
    ],
  });

  const handleTouchStart = () => {
    const timeoutId = setTimeout(() => {
      setSelected(true);
      activatePanel();
    }, 1200);
    timeoutRef.current = timeoutId;
  };

  const handleTouchEnd = () => {
    clearTimeout(timeoutRef.current);
  };

  return (
    <button
      onClick={() => {
        if (isSelected) return;
        router.push(`/list/${id}`);
        deactivate();
      }}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onBlur={() => setSelected(false)}
      className={cn(
        "select-none rounded-lg px-6 py-1 text-start text-lg transition-colors",
        {
          "bg-purple-600 text-white": isSelected,
          "active:bg-gray-200 dark:active:bg-zinc-700": !isSelected,
        },
      )}
    >
      {name}
    </button>
  );
};

export default Sidebar;
