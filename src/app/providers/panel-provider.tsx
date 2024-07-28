"use client"

import { PanelSection } from "@/types";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useState,
} from "react";

type PanelContextType = {
  active: boolean;
  title?: string;
  data: PanelSection | PanelSection[];
  activate: () => void;
  deactivate: () => void;
  setTitle: Dispatch<SetStateAction<string | undefined>>;
  setData: Dispatch<SetStateAction<PanelSection | PanelSection[]>>;
};

export const PanelContext = createContext<PanelContextType>(
  {} as PanelContextType,
);

const PanelProvider = ({ children }: PropsWithChildren) => {
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState<string | undefined>();
  const [data, setData] = useState<PanelSection | PanelSection[]>([]);

  const activate = useCallback(() => {
    setActive(true);
  }, []);
  const deactivate = useCallback(() => {
    setActive(false);
  }, []);

  return (
    <PanelContext.Provider
      value={{ active, title, data, activate, deactivate, setTitle, setData }}
    >
      {children}
    </PanelContext.Provider>
  );
};

export default PanelProvider
