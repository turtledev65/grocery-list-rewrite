"use client";

import { AddButton, Item } from "./_components";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import ListTitle from "./_components/list-title";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import NewItemForm from "./_components/new-item-form";
import NewItemProvider from "./_components/new-item-provider";

type Props = {
  params: {
    id: string;
  };
};

const ListPage = ({ params }: Props) => {
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new")?.toLowerCase() === "true";

  const { data: list } = useQuery(
    convexQuery(api.list.getList, {
      id: params.id as Id<"lists">,
    }),
  );

  return (
    <main className="overflow-y-auto overflow-x-hidden p-4">
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
              listId={item.listId}
              id={item._id}
              key={item._id}
            />
          ))}
        </AnimatePresence>
      </ul>

      <NewItemProvider>
        <NewItemForm listId={list?._id ?? ""} />
        <AddButton listId={list?._id ?? ""} />
      </NewItemProvider>
    </main>
  );
};

export default ListPage;
