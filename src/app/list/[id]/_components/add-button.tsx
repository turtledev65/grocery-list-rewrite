"use client";

import { ChangeEvent, useCallback, useRef, useState } from "react";
import { FaPlus as PlusIcon, FaCamera as CameraIcon } from "react-icons/fa";
import cn from "classnames";

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

  const [isCamera, setIsCamera] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleTouchStart = useCallback(() => {
    const timeoutId = setTimeout(() => setIsCamera(prev => !prev), 700);
    timeoutRef.current = timeoutId;
  }, []);

  const handleTouchEnd = useCallback(() => {
    clearTimeout(timeoutRef.current);
    if (isCamera) fileInputRef.current?.click();
    else onCreateTextItem();
  }, [isCamera, onCreateTextItem]);

  return (
    <div
      className={cn(
        "absolute bottom-4 right-4 h-16 w-16 cursor-pointer rounded-full border-4 border-purple-600 p-3 text-3xl transition-all active:opacity-80",
        isCamera ? "bg-purple-600 text-white" : "text-purple-600",
      )}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {isCamera ? (
        <>
          <input
            type="file"
            id="images"
            accept="image/*"
            hidden
            onChange={handleAttachImages}
            ref={fileInputRef}
          />
          <label htmlFor="images" className="cursor-pointer">
            <CameraIcon />
          </label>
        </>
      ) : (
        <button onClick={onCreateTextItem} className="outline-none">
          <PlusIcon />
        </button>
      )}
    </div>
  );
};

export default AddButton;
