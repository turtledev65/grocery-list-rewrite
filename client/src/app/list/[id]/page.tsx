"use client";

import { FormEvent, useCallback, useRef, useState } from "react";
import { AddButton, Item } from "./_components";
import { useAddItem, useGetList } from "./_hooks";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ListTitle from "./_components/list-title";

type Props = {
  params: {
    id: string;
  };
};

const ListPage = ({ params }: Props) => {
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new")?.toLowerCase() === "true";

  const { data: list, status, error } = useGetList(params.id);

  const itemTextRef = useRef<HTMLInputElement>(null);
  const { mutate: addItem } = useAddItem(params.id);

  const [creating, setCreating] = useState(false);
  const handleAddItem = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setCreating(false);

      const text = itemTextRef.current?.value.trim();
      if (!text) return;

      addItem({ text });
    },
    [addItem],
  );

  if (status === "error")
    return (
      <>
        <h1 className="text-4xl font-bold text-red-500">Error</h1>
        <p className="text-red-500">{error.message}</p>
      </>
    );

  if (status === "pending") return <p className="text-lg">Loading...</p>;

  return (
    <main className="overflow-y-auto overflow-x-hidden p-4">
      <ListTitle title={list!.name} listId={list!.id} isNew={isNew} />
      <ul>
        <AnimatePresence>
          {list?.items?.map(item => (
            <Item
              text={item.text}
              images={item.images}
              pending={item.pending}
              id={item.id}
              listId={item.listId}
              key={item.id}
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
        onCreateItemWithImages={imageFiles => addItem({ imageFiles })}
        onCreateTextItem={() => setCreating(true)}
      />
    </main>
  );
};

export default ListPage;
