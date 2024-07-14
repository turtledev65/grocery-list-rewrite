"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAddItem } from "../_hooks";

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
      if (!text && !imageFiles.length) return;

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

export default ItemForm;
