"use client";

import { useRenameList } from "@/app/_hooks";
import { FormEvent, useCallback, useEffect, useRef } from "react";

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

  const { mutate: renameList } = useRenameList(listId);
  const handleRenameList = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const newTitle = inputRef.current?.value.trim();
      if (!newTitle || newTitle === title) return;

      inputRef.current?.blur();
      renameList(newTitle);
    },
    [renameList, title],
  );

  useEffect(() => {
    if (isNew) inputRef?.current?.select();
  }, []);

  return (
    <form onSubmit={handleRenameList} ref={formRef}>
      <input
        type="text"
        defaultValue={title}
        ref={inputRef}
        onBlur={() => formRef.current?.reset()}
        autoFocus={isNew}
        className="w-full bg-gray-50 text-4xl font-bold outline-none selection:bg-purple-200"
      />
    </form>
  );
};

export default ListTitle;
