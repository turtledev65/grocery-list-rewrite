"use client";

import { ChangeEvent, useCallback, useContext, useRef, useState } from "react";
import { FaPlus as PlusIcon, FaCamera as CameraIcon } from "react-icons/fa";
import cn from "classnames";
import { NewItemContex } from "./new-item-provider";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useAddItem } from "../_hooks";
import { Id } from "../../../../../convex/_generated/dataModel";

const AddButton = ({ listId }: { listId: string }) => {
  const { setNewItemActive } = useContext(NewItemContex);
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
    else setNewItemActive(true);
  }, [isCamera]);

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
        text: "image",
        listId: listId as Id<"lists">,
        image: {
          storageId: res.storageId,
          name: file.name,
        },
      });
    },
    [listId],
  );

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
        <button onClick={() => setNewItemActive(true)} className="outline-none">
          <PlusIcon />
        </button>
      )}
    </div>
  );
};

export default AddButton;
