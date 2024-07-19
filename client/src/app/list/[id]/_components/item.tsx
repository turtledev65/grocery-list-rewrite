"use client";

import { Item as ItemProps, Image as ImageProps } from "@/types";
import {
  FormEvent,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react";
import { useDeleteItem, useEditItem } from "../_hooks";
import { motion } from "framer-motion";

const Item = ({ id, listId, text, pending, images }: ItemProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);

  const { mutate: deleteItem } = useDeleteItem(listId);
  const { mutate: editItem } = useEditItem(listId);

  const handleEditItem = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const newText = inputRef.current?.value.trim();
      if (!newText || newText === text) return;

      inputRef?.current?.blur();
      editItem({ newText, id });
    },
    [editItem, text, id],
  );

  const handleDeleteItem = useCallback(() => {
    deleteItem(id);
  }, [deleteItem, id]);

  return (
    <motion.li layout transition={{ type: "spring" }}>
      <SwipeableContainer
        draggable={!editing && !pending}
        onSwipe={handleDeleteItem}
      >
        <form ref={formRef} onSubmit={handleEditItem}>
          <input
            defaultValue={text}
            ref={inputRef}
            onFocus={() => setEditing(true)}
            onBlur={() => {
              setEditing(false);
              formRef?.current?.reset();
            }}
            className={`${pending ? "text-gray-500" : "text-black"} w-full bg-gray-50`}
          />
        </form>
      </SwipeableContainer>
    </motion.li>
  );
};

type SwipeableContainerProps = {
  draggable: boolean;
  onSwipe: () => void;
} & PropsWithChildren;
const SwipeableContainer = ({
  draggable,
  onSwipe,
  children,
}: SwipeableContainerProps) => {
  const DRAG_THRESHOLD = 100;

  return (
    <div className="relative">
      <motion.div
        className="absolute inset-[0.6px] -z-10 flex flex-row justify-end bg-red-500 font-bold text-white"
        exit={{
          translateX: "-100%",
          transition: { delay: 0.15, duration: 0.1 },
        }}
      >
        X
      </motion.div>
      <motion.div
        drag={draggable && "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.3 }}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) >= DRAG_THRESHOLD) onSwipe();
        }}
        exit={{ translateX: "-100%", transition: { duration: 0.2 } }}
        className="bg-gray-50"
      >
        {children}
      </motion.div>
    </div>
  );
};

const Image = ({ url, pending }: ImageProps) => {
  return (
    <div className="w-full">
      <img src={url} className={`${pending && "grayscale filter"} max-w-sm`} />
      {pending && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg
            className="h-8 w-8 animate-spin text-blue-500"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
};

export default Item;
