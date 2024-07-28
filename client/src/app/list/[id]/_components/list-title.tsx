"use client";

import { useMutation } from "convex/react";
import { FormEvent, useCallback, useEffect, useRef } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const ListTitle = ({
  title,
  listId,
  isNew,
}: {
  title: string;
  listId: string;
  isNew: boolean;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const renameList = useMutation(api.list.renameList);
  const handleRenameList = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const newName = inputRef.current?.value.trim();
      if (!newName || newName === title) return;

      inputRef.current?.blur();
      renameList({ id: listId as Id<"list">, newName });
    },
    [renameList, title],
  );

  useEffect(() => {
    if (isNew) inputRef?.current?.select();
  }, [isNew]);

  return (
    <form onSubmit={handleRenameList} ref={formRef}>
      <input
        type="text"
        defaultValue={title}
        ref={inputRef}
        onBlur={() => formRef.current?.reset()}
        autoFocus={isNew}
        className="w-full bg-gray-50 text-4xl font-bold outline-none dark:bg-zinc-900"
      />
    </form>
  );
};

export default ListTitle;
