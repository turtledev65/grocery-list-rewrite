"use client"

import { ChangeEvent, useCallback } from "react";

type Props = {
  onCreateTextItem: () => void;
  onCreateItemWithImages: (files: File[]) => void;
};
const AddButton = ({ onCreateTextItem, onCreateItemWithImages }: Props) => {
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

export default AddButton;
