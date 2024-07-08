"use client";

import { FormEvent, useCallback, useRef } from "react";
import { useAddItem, useDeleteItem, useGetList } from "./hooks";

type Props = {
  params: {
    id: string;
  };
};

const ListPage = ({ params }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { data: list, status, error } = useGetList(params.id);
  const { mutate: addItem } = useAddItem(params.id);

  const handleAddItem = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const text = inputRef.current?.value.trim();
      if (!text) return;

      formRef.current?.reset();
      addItem(text);
    },
    [params.id],
  );

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
      <ul>
        {list?.items?.map(item => (
          <Item
            text={item.text}
            sending={item.sending}
            id={item.id}
            listId={params.id}
            key={item.id}
          />
        ))}
      </ul>
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

type ItemProps = {
  text: string;
  sending?: boolean;
  id: string;
  listId: string;
};
const Item = ({ text, sending, id, listId }: ItemProps) => {
  const { mutate: deleteItem } = useDeleteItem(listId);

  const handleDeleteItem = useCallback(() => {
    deleteItem(id);
  }, [deleteItem, id]);

  return (
    <li
      className={`${sending && "text-gray-500"} flex flex-row items-center justify-between`}
    >
      <div>
        <p>{text}</p>
      </div>
      {!sending && (
        <button onClick={handleDeleteItem} className="font-bold text-red-600">
          X
        </button>
      )}
    </li>
  );
};

export default ListPage;
