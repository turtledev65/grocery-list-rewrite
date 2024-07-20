"use client";

import { useRouter } from "next/navigation";
import { useCreateList } from "../hooks/list";

const HomePage = () => {
  const router = useRouter();
  const { mutate: createList } = useCreateList();

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">No list open</h1>
      <div className="flex flex-col gap-2 align-baseline">
        <button
          onClick={() =>
            createList("Untilted", {
              onSuccess: res => {
                router.push(`/list/${res.id}?new=true`);
              },
            })
          }
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
};

export default HomePage;
