import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react";

type NewItemContextType = {
  isNewItemActive: boolean;
  setNewItemActive: Dispatch<SetStateAction<boolean>>;
};
export const NewItemContex = createContext<NewItemContextType>(
  {} as NewItemContextType,
);

const NewItemProvider = ({ children }: PropsWithChildren) => {
  const [isNewItemActive, setNewItemActive] = useState(false);
  return (
    <NewItemContex.Provider value={{ isNewItemActive: isNewItemActive, setNewItemActive: setNewItemActive }}>
      {children}
    </NewItemContex.Provider>
  );
};

export default NewItemProvider;
