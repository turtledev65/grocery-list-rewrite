"use client";

import { socket } from "@/socket";
import { List } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useRef } from "react";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter();

  const queryClient = useQueryClient();
  const { data: allLists, isLoading } = useQuery({
    queryKey: ["all-lists"],
    queryFn: async () => {
      const res = await socket.emitWithAck("get-all-lists");
      if ("error" in res) throw new Error(res.error);
      return res;
    },
  });
  const { mutate: createList } = useMutation({
    mutationFn: async (name: string) => {
      const res = await socket.emitWithAck("create-list", { name });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
    onSuccess: data => {
      queryClient.setQueryData([data.id], data);
      router.push(data.id);
    },
  });
  const { mutate: deleteList } = useMutation({
    mutationFn: async (id: string) => {
      const res = await socket.emitWithAck("delete-list", { id });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
    onMutate: async listId => {
      await queryClient.cancelQueries({ queryKey: ["all-lists"] });
      const prev = queryClient.getQueryData<List[]>(["all-lists"]);
      queryClient.setQueryData<List[]>(["all-lists"], old => {
        if (!old) return;
        return old.filter(list => list.id !== listId);
      });
      return { prev };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData<List[]>(["all-lists"], context?.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["all-lists"] });
    },
  });

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
