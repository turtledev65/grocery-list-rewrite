"use client";

import { MdOutlineSettings as SettingsIcon } from "react-icons/md";
import { useCreateList, useGetAllLists } from "../_hooks";
import { useCallback, useContext, useMemo, useState } from "react";
import { SidebarContext } from "../providers";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FiEdit as CreateListIcon } from "react-icons/fi";
import { LuFilter as FilterIcon } from "react-icons/lu";
import { FaSortAmountDownAlt as SortIcon } from "react-icons/fa";
import { useRouter } from "next/navigation";
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
                  <Link
                    href={`/list/${list.id}`}
                    key={list.id}
                    onClick={deactivate}
                    className="rounded-lg px-6 py-1 text-start text-lg hover:bg-gray-200 focus:bg-purple-600 focus:text-white"
                  >
                    {list.name}
                  </Link>
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

export default Sidebar;
