"use client";

import { socket } from "@/socket";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent, useRef } from "react";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter();

  const queryClient = useQueryClient();
  const { data: allLists } = useQuery({
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

  const handleCreateList = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = inputRef.current?.value.trim();
    if (!name) return;

    createList(name);
  };

  return (
    <>
      <ul>{allLists?.map(list => <li key={list.id}>{list.name}</li>)}</ul>
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
