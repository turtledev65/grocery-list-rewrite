"use client";

import { ChangeEvent, useCallback, useContext, useRef, useState } from "react";
import { FaPlus as PlusIcon, FaCamera as CameraIcon } from "react-icons/fa";
import cn from "classnames";
import { NewItemContex } from "./new-item-provider";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useAddItem } from "../_hooks";
import { Id } from "../../../../../convex/_generated/dataModel";

const SWITCH_TIMEOUT = 600;

const AddButton = ({ listId }: { listId: string }) => {
  const { setNewItemActive } = useContext(NewItemContex);
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
    else setNewItemActive(true);
  }, [isCamera, setNewItemActive]);

  return (
    <div
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={cn(
        "absolute bottom-4 right-4 h-16 w-16 rounded-full border-accent text-3xl transition-colors active:opacity-80",
        isCamera ? "bg-accent text-white" : "text-accent",
      )}
    >
      {isCamera ? <CameraButton listId={listId} /> : <TextButton />}
    </div>
  );
};

const TextButton = () => {
  const { setNewItemActive } = useContext(NewItemContex);

  return (
    <button
      onClick={() => setNewItemActive(true)}
      className="grid place-items-center rounded-full border-4 border-inherit p-3"
    >
      <PlusIcon />
    </button>
  );
};

const CameraButton = ({ listId }: { listId: string }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { mutate: addItem } = useAddItem();

  const handleAttachImages = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files;
      if (!fileList || fileList.length === 0) return;
      const file = fileList[0];

      const postUrl = await generateUploadUrl();
      const jsonVal = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "image/*" },
        body: file,
      });
      const res = await jsonVal.json();

      addItem({
        listId: listId as Id<"lists">,
        image: {
          storageId: res.storageId,
          name: file.name,
        },
      });
    },
    [listId, generateUploadUrl, addItem],
  );

  return (
    <>
      <input
        type="file"
        id="images"
        accept="image/*"
        hidden
        onChange={handleAttachImages}
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
