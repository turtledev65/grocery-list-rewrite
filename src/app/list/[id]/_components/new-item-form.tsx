"use client";

import { FormEvent, useCallback, useContext, useEffect, useRef } from "react";
import { NewItemContex } from "./new-item-provider";
import { motion } from "framer-motion";
import cn from "classnames";

const NewItemForm = () => {
  const { isFormActive, isAddingItem, setIsFormActive } =
    useContext(NewItemContex);

  const itemTextRef = useRef<HTMLInputElement>(null);

  const { addTextItem } = useContext(NewItemContex);
  const handleAddItem = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const text = itemTextRef.current?.value.trim();
      if (!text) return;

      window.scrollTo(0, document.body.scrollHeight);
      addTextItem({ text });
    },
    [addTextItem],
  );

  useEffect(() => {
    if (isAddingItem) itemTextRef.current?.blur();
  }, [isAddingItem]);

  return (
    isFormActive && (
      <motion.form
        initial={{ scale: 0 }}
        animate={{
          scale: "100%",
          transition: { type: "spring", bounce: 0.35 },
        }}
        onSubmit={handleAddItem}
      >
        <input
          autoFocus
          onBlur={() => {
            if (!isAddingItem) setIsFormActive(false);
          }}
          ref={itemTextRef}
          className={cn(
            "w-full bg-gray-50 px-2 py-1 outline-none dark:bg-zinc-900",
            isAddingItem && "text-gray-500",
          )}
        />
      </motion.form>
    )
  );
};

export default NewItemForm;
