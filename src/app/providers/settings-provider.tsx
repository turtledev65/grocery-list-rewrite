"use client";

import { Settings } from "@/types";
import { createContext, PropsWithChildren, useMemo } from "react";
import useLocalStorage from "../hooks/util/use-local-storage";

type SettingsIndexSignature = {
  [key: string]: unknown;
};
type SettingsContextType = {
  settings: Settings & SettingsIndexSignature;
  updateSettings: (args: Partial<Settings>) => void;
};
export const SettingsContext = createContext<SettingsContextType>(
  {} as SettingsContextType,
);

export const DEFAULT_SETTINGS: Readonly<Settings> = {
  askToConfirm: true,
  splitItems: false,
  defaultListTitle: "Untilted",
  colorscheme: "auto",
  accentColor: "#9333ea",
  fontSize: 16,
};

const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [settings, setSettings] = useLocalStorage<
    Settings & SettingsIndexSignature
  >("settings", DEFAULT_SETTINGS);

  const safeSettings = useMemo(() => {
    if (!settings) return { ...DEFAULT_SETTINGS };
    return settings;
  }, [settings]);

  const updateSettings = (args: Partial<Settings>) => {
    setSettings(prev => {
      const out = prev ? { ...prev } : { ...DEFAULT_SETTINGS };
      for (const [key, val] of Object.entries(args)) out[key] = val;
      return out;
    });
  };

  return (
    <SettingsContext.Provider
      value={{ settings: safeSettings, updateSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
