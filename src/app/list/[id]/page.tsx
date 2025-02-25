"use client";

import {
  AddButton,
  Item,
  ListTitle,
  NewImage,
  NewItemForm,
  NewItemProvider,
} from "./_components";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import LoadingSpinner from "@/components/loading-spinner";

type Props = {
  params: {
    id: string;
  };
};

const ListPage = ({ params }: Props) => {
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new")?.toLowerCase() === "true";

  const {
    data: list,
    status,
    error,
  } = useQuery(
    convexQuery(api.list.getList, {
      id: params.id as Id<"lists">,
    }),
  );

  if (status === "pending")
    return (
      <div className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
        <LoadingSpinner />
      </div>
    );

  if (status === "error")
    return (
      <div className="p-4">
        <h1 className="mb-8 text-4xl font-bold">An Errror occured</h1>
        <p className="text-left text-red-600">{error.message}</p>
        <div className="absolute bottom-0 left-0 flex w-full items-center justify-center py-8">
          <Link
            href="/home"
            className="select-none rounded-md bg-accent px-6 py-2 text-lg text-gray-50 active:opacity-80"
          >
            Go Home
          </Link>
        </div>
      </div>
    );

  return (
    <div>
      <ListTitle
        title={list?.name ?? ""}
        listId={list?._id ?? ""}
        isNew={isNew}
      />
      <ul>
        <AnimatePresence>
          {list?.items?.map(item => (
            <Item
              text={item.text}
              image={item.image}
              listId={item.listId}
              id={item._id}
              key={item._id}
            />
          ))}
        </AnimatePresence>
      </ul>

      <NewItemProvider listId={list?._id}>
        <NewItemForm />
        <NewImage />
        <AddButton />
      </NewItemProvider>
    </div>
  );
};

export default ListPage;
