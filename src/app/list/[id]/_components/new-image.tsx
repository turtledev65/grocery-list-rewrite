"use client";

import { useContext, useMemo } from "react";
import { NewItemContex } from "./new-item-provider";

const NewImage = () => {
  const { newImageFile } = useContext(NewItemContex);
  const url = useMemo(() => {
    if (newImageFile) return URL.createObjectURL(newImageFile);
  }, [newImageFile]);

  return (
    url && (
      <img
        src={url}
        alt={newImageFile?.name}
        className="w-full max-w-md cursor-pointer px-2 py-1 grayscale"
      />
    )
  );
};

export default NewImage;
