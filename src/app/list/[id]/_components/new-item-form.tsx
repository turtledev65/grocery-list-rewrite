import { FormEvent, useCallback, useContext, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { NewItemContex } from "./new-item-provider";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { motion } from "framer-motion";
import cn from "classnames";

const NewItemForm = ({ listId }: { listId: string }) => {
  const { isNewItemActive , setNewItemActive  } = useContext(NewItemContex);

  const itemTextRef = useRef<HTMLInputElement>(null);

  const { mutate: addItem, isPending: isAddingItem } = useMutation({
    mutationFn: useConvexMutation(api.item.addItem),
  });
  const handleAddItem = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const text = itemTextRef.current?.value.trim();
      if (!text) return;

      addItem(
        { text, listId: listId as Id<"lists"> },
        { onSuccess: () => setNewItemActive(false) },
      );
    },
    [addItem, listId],
  );

  useEffect(() => {
    if (isAddingItem) itemTextRef.current?.blur();
  }, [isAddingItem]);

  return (
    isNewItemActive && (
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
            if (!isAddingItem) setNewItemActive(false);
          }}
          ref={itemTextRef}
          className={cn(
            "w-full bg-gray-50 outline-none dark:bg-zinc-900",
            isAddingItem && "text-gray-500",
          )}
        />
      </motion.form>
    )
  );
};

export default NewItemForm;
