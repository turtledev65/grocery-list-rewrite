"use client";

import { useRouter } from "next/navigation";
import { useCreateList } from "./_hooks";
import { useCallback } from "react";

export default function Home() {
  const router = useRouter();
  const { mutate: createList } = useCreateList();

  const handleCreateList = useCallback(() => {
    createList("Untilted", {
      onSuccess: res => {
        router.push(`list/${res.id}?new=true`);
      },
    });
  }, [createList, router]);

  return (
    <main className="flex  flex-col h-full items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">No list open</h1>
      <div className="flex flex-col gap-2 align-baseline">
        <button
          onClick={handleCreateList}
          className="rounded-md bg-slate-100 p-3 text-lg text-purple-600 hover:text-purple-400"
        >
          Create new list
        </button>
        <button className="rounded-md bg-slate-100 p-3 text-lg text-purple-600 hover:text-purple-400">
          Close
        </button>
      </div>
    </main>
  );
}
