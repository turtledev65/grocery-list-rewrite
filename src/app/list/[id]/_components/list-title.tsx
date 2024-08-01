"use client";

import { useMutation } from "@tanstack/react-query";
import { FormEvent, useCallback, useEffect, useRef } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useConvexMutation } from "@convex-dev/react-query";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
  listId: string;
  isNew: boolean;
};
const ListTitle = ({ title, listId, isNew }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const { mutate: renameList } = useMutation({
    mutationFn: useConvexMutation(api.list.renameList).withOptimisticUpdate(
      (localStore, args) => {
        const { newName, id } = args;
        const currVal = localStore.getQuery(api.list.getList, { id });
        if (!currVal) return;

        localStore.setQuery(
          api.list.getList,
          { id },
          { ...currVal, name: newName },
        );
      },
    ),
  });
  const handleRenameList = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const newName = inputRef.current?.value.trim();
      if (!newName || newName === title) return;

      inputRef.current?.blur();
      renameList(
        { id: listId as Id<"lists">, newName },
        { onSuccess: () => router.push(`/list/${listId}`) },
      );
    },
    [title, renameList, listId, router],
  );

  useEffect(() => {
    if (!inputRef.current) return;
    if (isNew) inputRef.current.select();
  }, [isNew]);

  return (
    <form onSubmit={handleRenameList} ref={formRef}>
      <input
        type="text"
        defaultValue={title}
        autoFocus={isNew}
        ref={inputRef}
        onBlur={() => formRef.current?.reset()}
        className="w-full bg-gray-50 px-2 pb-4 text-4xl font-bold outline-none dark:bg-zinc-900"
      />
    </form>
  );
};

export default ListTitle;
