"use client";

import { MdOutlineSettings } from "react-icons/md";
import { useGetAllLists } from "../_hooks";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { SidebarContext } from "../providers";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const Sidebar = () => {
  const router = useRouter();
  const { data: allLists } = useGetAllLists();
  const { active, deactivate } = useContext(SidebarContext);

  return (
    <AnimatePresence>
      {active && (
        <>
          <motion.div
            className="fixed inset-0 z-40 cursor-pointer bg-black"
            key="bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: "75%" }}
            exit={{ opacity: 0 }}
            onClick={deactivate}
          />
          <motion.aside
            className={`fixed bottom-0 top-0 z-50 w-[75vw] rounded-r-xl bg-gray-50 p-4`}
            key="sidebar"
            initial={{ left: "-75vw" }}
            animate={{ left: 0 }}
            exit={{ left: "-75vw" }}
          >
            <div className="flex items-center justify-between py-4">
              <h1 className="text-nowrap text-2xl font-bold">All Lists</h1>
              <button className="grid place-items-center">
                <MdOutlineSettings className="text-2xl text-purple-600" />
              </button>
            </div>
            <div className="flex flex-col">
              {allLists?.map(list => (
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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
