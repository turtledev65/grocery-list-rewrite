"use client";

import { ChangeEvent, useCallback, useContext, useRef, useState } from "react";
import { FaPlus as PlusIcon, FaCamera as CameraIcon } from "react-icons/fa";
import { NewItemContex } from "./new-item-provider";
import cn from "classnames";

const SWITCH_TIMEOUT = 600;

const AddButton = () => {
  const { setIsFormActive } = useContext(NewItemContex);
  const [isCamera, setIsCamera] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleTouchStart = useCallback(() => {
    const timeoutId = setTimeout(
      () => setIsCamera(prev => !prev),
      SWITCH_TIMEOUT,
    );
    timeoutRef.current = timeoutId;
  }, []);

  const handleTouchEnd = useCallback(() => {
    clearTimeout(timeoutRef.current);
    if (isCamera) fileInputRef.current?.click();
    else setIsFormActive(true);
  }, [isCamera, setIsFormActive]);

  return (
    <div
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={cn(
        "fixed bottom-4 right-4 h-16 w-16 rounded-full border-accent text-3xl transition-colors active:opacity-80",
        isCamera ? "bg-accent text-white" : "text-accent",
      )}
    >
      {isCamera ? <CameraButton /> : <TextButton />}
    </div>
  );
};

const TextButton = () => {
  const { setIsFormActive } = useContext(NewItemContex);

  return (
    <button
      onClick={() => setIsFormActive(true)}
      className="grid place-items-center rounded-full border-4 border-inherit p-3"
    >
      <PlusIcon />
    </button>
  );
};

const CameraButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addImageItem } = useContext(NewItemContex);

  const handleAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length == 0) return;
    const file = fileList[0];

    addImageItem({ file });
  };

  return (
    <>
      <input
        type="file"
        id="images"
        accept="image/*"
        hidden
        onChange={handleAddImage}
        ref={fileInputRef}
      />
      <label
        htmlFor="images"
        className="absolute grid h-full w-full cursor-pointer place-items-center rounded-full bg-inherit p-3"
      >
        <CameraIcon />
      </label>
    </>
  );
};

export default AddButton;
