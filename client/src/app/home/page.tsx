"use client";

import { PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { useCreateList } from "../hooks/list";

const HomePage = () => {
  const router = useRouter();
  const { mutate: createList } = useCreateList();

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h1 className="mb-10 text-4xl font-bold">No list open</h1>
      <div className="flex flex-col gap-4 align-baseline">
        <Button
          onClick={() =>
            createList("Untilted", {
              onSuccess: res => {
                router.push(`/list/${res.id}?new=true`);
              },
            })
          }
        >
          Create new list
        </Button>
        <Button>Close</Button>
      </div>
    </main>
  );
};

type ButtonProps = {
  onClick?: () => void;
} & PropsWithChildren;
const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="rounded-md bg-slate-100 p-3 text-lg text-purple-600 active:opacity-80 dark:bg-zinc-800"
    >
      {children}
    </button>
  );
};

export default HomePage;
