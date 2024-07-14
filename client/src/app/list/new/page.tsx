"use client";

import { useCreateList } from "@/app/_hooks";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef } from "react";

const NewListPage = () => {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef?.current?.select();
  }, []);

  const { mutate: createList } = useCreateList();

  const handleCreateList = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const listName = inputRef?.current?.value.trim();
    if (!listName) return;

    createList(listName, {
      onSuccess: res => router.push(`${res.id}`),
    });
  }, []);

  return (
    <main className="p-4">
      <form onSubmit={handleCreateList}>
        <input
          type="text"
          defaultValue="Untilded"
          autoFocus
          ref={inputRef}
          className="w-full text-4xl font-bold outline-none selection:bg-purple-200"
        />
      </form>
      <button className="fixed bottom-4 right-9 h-12 w-12 rounded-full bg-purple-600 text-4xl text-white">
        +
      </button>
    </main>
  );
};

export default NewListPage;
