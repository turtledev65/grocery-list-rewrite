"use client";

import { PanelContext } from "@/app/providers";
import { PanelSection } from "@/types";
import { useContext } from "react";

type UsePanelData = PanelSection | PanelSection[];
type UsePanelArgs = {
  title?: string;
  data: UsePanelData;
};

const usePanel = (args: UsePanelArgs | (() => UsePanelArgs)) => {
  let res: UsePanelArgs;
  if (typeof args === "function") res = args();
  else res = args;

  const { title, data } = res;

  const { activate, setTitle, setData } = useContext(PanelContext);
  return () => {
    setTitle(title);
    setData(data);
    activate();
  };
};

export default usePanel;
