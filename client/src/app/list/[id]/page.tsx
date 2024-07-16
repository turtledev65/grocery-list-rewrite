"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Item } from "./_components";
import { useAddItem, useGetList } from "./_hooks";
import useRenameList from "@/app/_hooks/useRenameList";
import { useSearchParams } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

const ListPage = ({ params }: Props) => {
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new")?.toLowerCase() === "true";

  const { data: list, status, error } = useGetList(params.id);

  const itemTextRef = useRef<HTMLInputElement>(null);
  const { mutate: addItem } = useAddItem(params.id);

  const [creating, setCreating] = useState(false);
  const handleAddItem = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setCreating(false);

      const text = itemTextRef.current?.value.trim();
      if (!text) return;

      addItem({ text });
    },
    [addItem],
  );

  if (status === "error")
    return (
      <>
        <h1 className="text-4xl font-bold text-red-500">Error</h1>
        <p className="text-red-500">{error.message}</p>
      </>
    );

  if (status === "pending") return <p className="text-lg">Loading...</p>;

  return (
    <main className="p-4">
      <ListTitle title={list!.name} listId={list!.id} isNew={isNew} />
      <ul>
        {list?.items?.map(item => (
          <Item
            text={item.text}
            images={item.images}
            pending={item.pending}
            id={item.id}
            listId={item.listId}
            key={item.id}
          />
        ))}
        {creating && (
          <form onSubmit={handleAddItem}>
            <input
              autoFocus
              onBlur={() => setCreating(false)}
              ref={itemTextRef}
              className="outline-none"
            />
          </form>
        )}
      </ul>
      <AddButton
        onCreateItemWithImages={imageFiles => addItem({ imageFiles })}
        onCreateTextItem={() => setCreating(true)}
      />
    </main>
  );
};

const ListTitle = ({
  title,
  listId,
  isNew,
}: {
  title: string;
  listId: string;
  isNew: boolean;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: renameList } = useRenameList(listId);
  const handleRenameList = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const newTitle = inputRef.current?.value.trim();
      if (!newTitle || newTitle === title) return;

      inputRef.current?.blur();
      renameList(newTitle);
    },
    [renameList, title],
  );

  useEffect(() => {
    if (isNew) inputRef?.current?.select();
  }, []);

  return (
    <form onSubmit={handleRenameList} ref={formRef}>
      <input
        type="text"
        defaultValue={title}
        ref={inputRef}
        onBlur={() => formRef.current?.reset()}
        autoFocus={isNew}
        className="w-full text-4xl font-bold outline-none selection:bg-purple-200"
      />
    </form>
  );
};

const AddButton = ({
  onCreateTextItem,
  onCreateItemWithImages,
}: {
  onCreateTextItem: () => void;
  onCreateItemWithImages: (files: File[]) => void;
}) => {
  const handleAttachImages = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files;
      if (!fileList) return;

      const files: File[] = [];
      for (let i = 0; i < fileList.length; i++) files.push(fileList[i]);
      console.log(files);

      onCreateItemWithImages(files);
    },
    [onCreateItemWithImages],
  );

  return (
    <div className="group fixed bottom-5 right-9 flex select-none flex-col gap-2 rounded-3xl text-4xl text-white transition-colors hover:bg-purple-900">
      <div className="grid h-0 w-12 place-items-center rounded-full bg-purple-600 outline-none transition-all group-hover:h-12">
        <input
          type="file"
          id="images"
          accept="image/*"
          hidden
          onChange={handleAttachImages}
        />
        <label htmlFor="images" className="invisible group-hover:visible">
          C
        </label>
      </div>

      <button
        onClick={onCreateTextItem}
        className="h-12 w-12 rounded-full bg-purple-600 outline-none"
      >
        +
      </button>
    </div>
  );
};

export default ListPage;
