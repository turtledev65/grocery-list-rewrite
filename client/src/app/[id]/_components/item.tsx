"use client";

import { FormEvent, useCallback, useRef, useState } from "react";
import { useDeleteItem, useEditItem } from "../_hooks";

import { Item as ItemProps, Image as ImageProps } from "@/types";

const Item = ({ id, listId, text, pending, images }: ItemProps) => {
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
      <div className="flex flex-col">
        <div className="flex flex-row items-center">
          {text && (
            <div
              onClick={() => setEditing(!pending && true)}
              className="w-full"
            >
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
          )}
        </div>
        <div className="flex flex-row gap-2">
          {images?.map(img => (
            <Image
              id={img.id}
              itemId={img.itemId}
              url={img.url}
              pending={img.pending}
              key={img.id}
            />
          ))}
        </div>
      </div>
      {!pending && !editing && (
        <button onClick={handleDeleteItem} className="font-bold text-red-600">
          X
        </button>
      )}
    </li>
  );
};

const Image = ({ url, pending }: ImageProps) => {
  return (
    <div className="relative">
      <img src={url} className={`${pending && "grayscale filter"} max-w-sm`} />
      {pending && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg
            className="h-8 w-8 animate-spin text-blue-500"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
};

export default Item;
