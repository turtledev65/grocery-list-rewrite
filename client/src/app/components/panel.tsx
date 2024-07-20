"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import { PanelContext } from "../providers";
import { PanelItem, PanelSection } from "@/types";
import usePanel from "../hooks/ui/usePanel";

function isPanelSection(
  val: PanelSection | PanelSection[],
): val is PanelSection {
  if ("label" in val[0]) return true;
  return false;
}

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
                  <PanelButton
                    icon={item.icon}
                    label={item.label}
                    action={item.action}
                    critical={item.critical}
                    className={item.className}
                    key={item.label}
                  />
                ))}
              </div>
            ) : (
              data.map((section, idx) => (
                <section
                  key={idx}
                  className={`flex flex-col border-b-gray-400 py-2 ${idx !== data.length - 1 && "border-b-2"}`}
                >
                  {section.map(item => (
                    <PanelButton
                      icon={item.icon}
                      label={item.label}
                      action={item.action}
                      critical={item.critical}
                      className={item.className}
                      key={item.label}
                    />
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

const PanelButton = ({
  icon,
  label,
  action,
  critical,
  className,
}: PanelItem) => {
  const { deactivate } = useContext(PanelContext);

  const activateConfirmationPanel = usePanel({
    title: label,
    data: [
      [
        {
          label: "Confirm and don't ask again",
          className: "text-red-500",
          action: action,
        },
        { label: "Confirm", className: "text-red-500", action: action },
      ],
      [{ label: "Close", className: "text-purple-600", action: deactivate }],
    ],
  });

  return (
    <button
      onClick={() => {
        deactivate();
        if (critical) activateConfirmationPanel();
        else action();
      }}
      className={`flex items-center gap-2 rounded-md p-2 ${critical && "text-red-500"} text-left hover:bg-gray-200 ${className}`}
    >
      {icon}
      {label}
    </button>
  );
};
