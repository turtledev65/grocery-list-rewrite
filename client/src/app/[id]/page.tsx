"use client";

import { FormEvent, useCallback, useRef, useState } from "react";
import { useAddItem, useDeleteItem, useEditItem, useGetList } from "./hooks";
import { Item as ItemProps } from "@/types";

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
    [addItem],
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
            pending={item.pending}
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

const Item = ({ id, listId, text, pending }: ItemProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);

  const { mutate: deleteItem } = useDeleteItem(listId);
  const { mutate: editItem } = useEditItem(listId);

  const handleEditItem = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const newText = inputRef.current?.value.trim();
      if (!newText || newText === text) return;

      setEditing(false);
      editItem({ newText, id });
    },
    [editItem, id, text],
  );
  const handleDeleteItem = useCallback(() => {
    deleteItem(id);
  }, [deleteItem, id]);

  return (
    <li
      className={`${pending && "text-gray-500"} flex flex-row items-center justify-between`}
    >
      <div onClick={() => setEditing(true)} className="w-full">
        {editing ? (
          <form ref={formRef} onSubmit={handleEditItem}>
            <input
              defaultValue={text}
              autoFocus
              ref={inputRef}
              onBlur={() => setEditing(false)}
              className="w-full"
            />
          </form>
        ) : (
          <p>{text}</p>
        )}
      </div>
      {!pending && !editing && (
        <button onClick={handleDeleteItem} className="font-bold text-red-600">
          X
        </button>
      )}
    </li>
  );
};

export default ListPage;
