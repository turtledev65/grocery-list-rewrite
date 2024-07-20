"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import { PanelContext } from "../providers";
import { PanelItem, PanelSection } from "@/types";

function isPanelSection(
  val: PanelSection | PanelSection[],
): val is PanelSection {
  if ("label" in val[0]) return true;
  return false;
}

export const usePanel = (args: {
  title?: string;
  data: PanelSection | PanelSection[];
}) => {
  const { activate, setTitle, setData } = useContext(PanelContext);
  return () => {
    setTitle(args.title);
    setData(args.data);
    activate();
  };
};

export const Panel = () => {
  const { active, title, data, deactivate } = useContext(PanelContext);
  const DRAG_THRESHOLD = 50;

  return (
    <AnimatePresence>
      {active && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: "75%" }}
            exit={{ opacity: 0 }}
            onClick={deactivate}
            className="absolute inset-0 z-40 cursor-pointer bg-black"
          />
          <motion.div
            drag="y"
            dragConstraints={{ bottom: 0, top: 0 }}
            dragElastic={{ bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y < 0) return;
              if (info.offset.y >= DRAG_THRESHOLD) deactivate();
            }}
            initial={{ bottom: "-100%" }}
            animate={{ bottom: 0, transition: { delay: 0.1 } }}
            exit={{ bottom: "-100%" }}
            className="absolute bottom-0 z-50 w-full rounded-t-xl bg-gray-50 p-2"
          >
            <div className="mx-auto h-1 w-16 rounded-lg bg-gray-400" />
            {title && (
              <h1 className="border-b-2 border-b-gray-400 py-2 text-xl">
                {title}
              </h1>
            )}
            {isPanelSection(data) ? (
              <div className="flex flex-col py-2">
                {data.map(item => (
                  <button
                    onClick={item.action}
                    key={item.label}
                    className="rounded-md p-2 text-left hover:bg-gray-200"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : (
              data.map((section, idx) => (
                <section
                  key={idx}
                  className={`flex flex-col border-b-gray-400 py-2 ${idx !== data.length - 1 && "border-b-2"}`}
                >
                  {section.map(item => (
                    <button
                      onClick={() => {
                        item.action();
                        deactivate();
                      }}
                      key={item.label}
                      className="rounded-md p-2 text-left hover:bg-gray-200"
                    >
                      {item.label}
                    </button>
                  ))}
                </section>
              ))
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
