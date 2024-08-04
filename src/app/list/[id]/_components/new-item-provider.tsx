import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { useAddItem } from "../_hooks";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

type NewItemContextType = {
  isFormActive: boolean;
  isAddingItem: boolean;
  newImageFile: File | undefined;
  setIsFormActive: Dispatch<SetStateAction<boolean>>;
  addTextItem: (args: { text: string }) => void;
  addImageItem: (args: { file: File }) => void;
};
export const NewItemContex = createContext({} as NewItemContextType);

type Props = { listId: string } & PropsWithChildren;
const NewItemProvider = ({ listId, children }: Props) => {
  const [isFormActive, setIsFormActive] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | undefined>();

  const { mutate: addItem, isPending: isAddingItem } = useAddItem();

  const addTextItem = useCallback(
    (args: { text: string }) => {
      window.scrollTo(0, document.body.scrollHeight);
      addItem(
        { text: args.text, listId: listId as Id<"lists"> },
        { onSuccess: () => setIsFormActive(false) },
      );
    },
    [addItem, setIsFormActive],
  );

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const addImageItem = useCallback(
    async (args: { file: File }) => {
      const postUrl = await generateUploadUrl();
      const jsonVal = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "image/*" },
        body: args.file,
      });
      const res = await jsonVal.json();

      setNewImageFile(args.file);

      window.scrollTo(0, document.body.scrollHeight);
      addItem(
        {
          listId: listId as Id<"lists">,
          image: { storageId: res.storageId, name: args.file.name },
        },
        { onSuccess: () => setNewImageFile(undefined) },
      );
    },
    [addItem, setIsFormActive],
  );

  return (
    <NewItemContex.Provider
      value={{
        isFormActive,
        isAddingItem,
        newImageFile,
        setIsFormActive,
        addTextItem,
        addImageItem,
      }}
    >
      {children}
    </NewItemContex.Provider>
  );
};

export default NewItemProvider;
