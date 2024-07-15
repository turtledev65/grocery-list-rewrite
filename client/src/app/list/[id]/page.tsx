"use client";

import { ChangeEvent, FormEvent, useCallback, useRef, useState } from "react";
import { Item } from "./_components";
import { useAddItem, useGetList } from "./_hooks";

type Props = {
  params: {
    id: string;
  };
};

const ListPage = ({ params }: Props) => {
  const { data: list } = useGetList(params.id);

  const textInputRef = useRef<HTMLInputElement>(null);
  const { mutate: addItem } = useAddItem(params.id);

  const [creating, setCreating] = useState(false);
  const handleAddItem = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setCreating(false);

      const text = textInputRef.current?.value.trim();
      if (!text) return;

      addItem({ text });
    },
    [addItem],
  );

  return (
    <main className="p-4">
      <h1 className="text-4xl font-bold">{list?.name}</h1>
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
              ref={textInputRef}
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
