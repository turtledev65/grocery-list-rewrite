"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { AddButton, Item } from "./_components";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ListTitle from "./_components/list-title";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import cn from "classnames";

type Props = {
  params: {
    id: string;
  };
};

const ListPage = ({ params }: Props) => {
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new")?.toLowerCase() === "true";

  const { data: list } = useQuery(
    convexQuery(api.list.getList, {
      id: params.id as Id<"lists">,
    }),
  );

  const itemTextRef = useRef<HTMLInputElement>(null);
  const { mutate: addItem, isPending: isAddingItem } = useMutation({
    mutationFn: useConvexMutation(api.item.addItem),
  });

  useEffect(() => {
    if (isAddingItem) itemTextRef.current?.blur();
  }, [isAddingItem]);

  const [creating, setCreating] = useState(false);
  const handleAddItem = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const text = itemTextRef.current?.value.trim();
      if (!text) return;
      if (!list) return;

      addItem(
        { text, listId: list._id },
        { onSuccess: () => setCreating(false) },
      );
    },
    [addItem, list],
  );

  return (
    <main className="overflow-y-auto overflow-x-hidden p-4">
      <ListTitle
        title={list?.name ?? ""}
        listId={list?._id ?? ""}
        isNew={isNew}
      />
      <ul>
        <AnimatePresence>
          {list?.items?.map(item => (
            <Item
              text={item.text}
              pending={false}
              listId={item.listId}
              id={item._id}
              key={item._id}
            />
          ))}
        </AnimatePresence>
        {creating && (
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
                if (!isAddingItem) setCreating(false);
              }}
              ref={itemTextRef}
              className={cn(
                "w-full bg-gray-50 outline-none dark:bg-zinc-900",
                isAddingItem && "text-gray-500",
              )}
            />
          </motion.form>
        )}
      </ul>
      <AddButton
        onCreateItemWithImages={imageFiles => console.log(imageFiles)}
        onCreateTextItem={() => setCreating(true)}
      />
    </main>
  );
};

export default ListPage;
