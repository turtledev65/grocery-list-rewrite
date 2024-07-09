"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAddItem, useDeleteItem, useEditItem, useGetList } from "./hooks";
import { Item as ItemProps, Image as ImageProps } from "@/types";

type Props = {
  params: {
    id: string;
  };
};

const ListPage = ({ params }: Props) => {
  const { data: list, status, error } = useGetList(params.id);

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
            images={item.images}
            key={item.id}
          />
        ))}
      </ul>
      <ItemForm listId={params.id} />
    </>
  );
};

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
    <li className={`${pending && "text-gray-500"} flex flex-col`}>
      <div className="flex flex-row items-center justify-between">
        <div onClick={() => setEditing(!pending && true)} className="w-full">
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
              stroke-width="4"
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

const ItemForm = ({ listId }: { listId: string }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const images = useMemo(
    () => imageFiles.map(file => URL.createObjectURL(file)),
    [imageFiles],
  );

  const { mutate: addItem } = useAddItem(listId);

  const handleAddItem = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const text = inputRef.current?.value.trim();
      if (!text) return;

      formRef.current?.reset();
      addItem({ text, imageFiles });
      setImageFiles([]);
    },
    [addItem, imageFiles],
  );

  const handleUploadFiles = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setImageFiles(prev => {
      const out = [...prev];
      for (let i = 0; i < files.length; i++) out.push(files[i]);
      return out;
    });
  }, []);

  return (
    <form
      ref={formRef}
      onSubmit={handleAddItem}
      className="absolute bottom-0 left-0 w-full p-2"
    >
      <div className="flex flex-row">
        {images.map(img => (
          <div className="group relative max-w-sm p-4" key={img}>
            <img src={img} />
            <button className="absolute right-0 top-0 h-8 w-8 rounded-full bg-white font-bold text-red-500 opacity-0 outline-0 transition-opacity group-hover:opacity-100">
              X
            </button>
          </div>
        ))}
      </div>
      <div className="flex w-full flex-row gap-2">
        <input
          ref={inputRef}
          type="text"
          className="w-full rounded-2xl border-2 border-gray-700 bg-gray-100 px-2 py-1 text-xl"
        />
        <div className="flex flex-row items-center rounded-3xl border-2 border-gray-700 bg-gray-100 px-2">
          <input
            type="file"
            id="images"
            accept="image/*"
            onChange={handleUploadFiles}
            hidden
          />
          <label
            htmlFor="images"
            className="cursor-pointer font-bold text-blue-400"
          >
            Images
          </label>
        </div>
        <button
          type="submit"
          className="rounded-3xl border-2 border-gray-700 bg-gray-100 px-2"
        >
          OK
        </button>
      </div>
    </form>
  );
};

export default ListPage;
