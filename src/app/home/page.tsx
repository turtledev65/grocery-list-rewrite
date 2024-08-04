"use client";

import { PropsWithChildren, useContext } from "react";
import { useRouter } from "next/navigation";
import { SettingsContext } from "@/providers/settings-provider";
import { useCreateList } from "@/hooks/list";

const HomePage = () => {
  const router = useRouter();

  const { settings } = useContext(SettingsContext);
  const { mutate: createList } = useCreateList();

  return (
    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
      <h1 className="mb-10 text-nowrap text-center text-4xl font-bold">
        No list open
      </h1>
      <div className="flex flex-col gap-4 align-baseline">
        <Button
          onClick={() =>
            createList(
              { name: settings.defaultListTitle },
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
        <Button onClick={() => router.push("/settings")}>Settings</Button>
        <Button onClick={() => router.push("/about")}>About</Button>
      </div>
    </div>
  );
};

type ButtonProps = {
  onClick?: () => void;
} & PropsWithChildren;
const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="rounded-md bg-slate-100 p-3 text-lg text-accent active:opacity-80 dark:bg-zinc-800"
    >
      {children}
    </button>
  );
};

export default HomePage;
