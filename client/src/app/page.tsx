"use client";

import { socket } from "@/socket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent, useRef } from "react";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter();

  const queryClient = useQueryClient();
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
    <main className="flex min-h-screen flex-col items-center justify-center gap-2">
      <form ref={formRef} onSubmit={handleCreateList}>
        <input
          ref={inputRef}
          type="text"
          className="rounded-2xl border-2 border-gray-700 bg-gray-100 px-2 py-1 text-xl"
        />
        <button
          type="submit"
          className="rounded-3xl border-2 border-gray-700 bg-gray-100 px-2"
        >
          Create List
        </button>
      </form>
    </main>
  );
}
