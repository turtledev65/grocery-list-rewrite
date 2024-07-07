"use client";

import { socket } from "@/socket";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useRef } from "react";

type Props = {
  params: {
    id: string;
  };
};

const ListPage = ({ params }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const queryClient = useQueryClient();
  const {
    data: list,
    status,
    error,
  } = useQuery({
    queryKey: [params.id],
    queryFn: async () => {
      const res = await socket.emitWithAck("get-list", { id: params.id });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
  });
  const { mutate: addItem } = useMutation({
    mutationFn: async (text: string) => {
      const res = await socket.emitWithAck("add-item", {
        listId: params.id,
        text,
      });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [params.id] });
    },
  });

  const handleAddItem = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = inputRef.current?.value.trim();
    if (!text) return;

    addItem(text);
  };

  return (
    <>
      <h1 className="text-3xl font-bold">
        {status == "pending"
          ? "Loading..."
          : status == "error"
            ? "Error"
            : list.name}
      </h1>
      {status == "error" && <p>{error.message}</p>}
      <ul>{list?.items.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      <form
        ref={formRef}
        onSubmit={handleAddItem}
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
          OK
        </button>
      </form>
    </>
  );
};

export default ListPage;
