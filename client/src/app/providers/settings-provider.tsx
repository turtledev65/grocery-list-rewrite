"use client";

import { Settings } from "@/types";
import { createContext, PropsWithChildren, useEffect } from "react";
import useLocalStorage from "../hooks/util/useLocalStorage";

type SettingsIndexSignature = {
  [key: string]: boolean | undefined;
};
type SettingsContextType = {
  settings?: Settings & SettingsIndexSignature;
  updateSettings: (args: Partial<Settings>) => void;
};
export const SettingsContext = createContext<SettingsContextType>(
  {} as SettingsContextType,
);

const DEFAULT_SETTINGS: Readonly<Settings> = {
  askToConfirm: true,
};

const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [settings, setSettings] = useLocalStorage<
    Settings & SettingsIndexSignature
  >("settings", DEFAULT_SETTINGS);

  const updateSettings = (args: Partial<Settings>) => {
    setSettings(prev => {
      const out = prev ? { ...prev } : { ...DEFAULT_SETTINGS };
      for (const [key, val] of Object.entries(args)) out[key] = val;
      return out;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
