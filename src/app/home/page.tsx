"use client";

import { PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

const HomePage = () => {
  const router = useRouter();
  const { mutate: createList } = useMutation({
    mutationFn: useConvexMutation(api.list.createList),
  });

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h1 className="mb-10 text-4xl font-bold">No list open</h1>
      <div className="flex flex-col gap-4 align-baseline">
        <Button
          onClick={() =>
            createList(
              { name: "Untilted" },
              {
                onSuccess: id => {
                  router.push(`/list/${id}?new=true`);
                },
              },
            )
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
