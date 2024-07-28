"use client";

import { FormEvent, useCallback, useRef, useState } from "react";
import { AddButton, Item } from "./_components";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ListTitle from "./_components/list-title";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
  params: {
    id: string;
  };
};

const ListPage = ({ params }: Props) => {
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new")?.toLowerCase() === "true";

  const list = useQuery(api.list.getList, { id: params.id as Id<"list"> });

  const itemTextRef = useRef<HTMLInputElement>(null);
  const addItem = useMutation(api.item.addItem);

  const [creating, setCreating] = useState(false);
  const handleAddItem = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setCreating(false);

      const text = itemTextRef.current?.value.trim();
      if (!text) return;
      if (!list) return;

      addItem({ text, listId: list._id }).then(res => console.log(res));
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
              onBlur={() => setCreating(false)}
              ref={itemTextRef}
              className="w-full bg-gray-50 outline-none dark:bg-zinc-900"
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
