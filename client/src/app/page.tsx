"use client";

import { List } from "@/types";
import Link from "next/link";
import { FormEvent, useCallback, useRef } from "react";
import { useCreateList, useDeleteList, useGetAllLists } from "./_hooks";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { data: allLists, isLoading } = useGetAllLists();
  const { mutate: createList } = useCreateList();
  const { mutate: deleteList } = useDeleteList();

  const handleCreateList = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const name = inputRef.current?.value.trim();
      if (!name) return;

      createList(name);
    },
    [createList],
  );

  const handleDeleteList = useCallback(
    async (list: List) => {
      deleteList(list.id);
    },
    [deleteList],
  );

  return (
    <>
      <h1 className="space-y-4 text-3xl font-bold">All Lists</h1>
      {isLoading && <p>Loading...</p>}
      <ul>
        {allLists?.map(list => (
          <li
            key={list.id}
            className="flex flex-row items-center justify-between"
          >
            <Link href={list.id}>{list.name}</Link>
            <button
              className="font-bold text-red-500"
              onClick={() => handleDeleteList(list)}
            >
              X
            </button>
          </li>
        ))}
      </ul>
      <form
        ref={formRef}
        onSubmit={handleCreateList}
        className="absolute bottom-0 left-0 flex w-full flex-row gap-2 p-2"
      >
        <input
          ref={inputRef}
          type="text"
          className="w-full rounded-2xl border-2 border-gray-700 bg-gray-100 px-2 py-1 text-xl"
        />
        <button
          type="submit"
          className="rounded-3xl border-2 border-gray-700 bg-gray-100 px-2"
        >
          Create List
        </button>
      </form>
    </>
  );
}
