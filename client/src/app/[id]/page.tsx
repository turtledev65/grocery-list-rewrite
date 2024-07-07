"use client";

import { FormEvent, useRef } from "react";
import { useAddItem, useGetList } from "./hooks";

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

  const handleAddItem = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = inputRef.current?.value.trim();
    if (!text) return;

    formRef.current?.reset();
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
      <ul>
        {list?.items?.map(item => (
          <li key={item.id} className={`${item.sending && "text-gray-500"}`}>
            {item.text}
          </li>
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

export default ListPage;
