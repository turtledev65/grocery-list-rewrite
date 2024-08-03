"use client";

import { Settings } from "@/types";
import { createContext, PropsWithChildren, useEffect, useMemo } from "react";
import useLocalStorage from "../hooks/util/use-local-storage";
import hexToRgb from "@/utils/hexToRgb";

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

  useEffect(() => {
    const accentColor = hexToRgb(safeSettings.accentColor);
    if (accentColor)
      document.documentElement.style.setProperty(
        "--color-accent",
        `${accentColor.r} ${accentColor.g} ${accentColor.b}`,
      );
  }, [safeSettings.accentColor]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--base-font-size",
      `${safeSettings.fontSize}px`,
    );
  }, [safeSettings.fontSize]);

  useEffect(() => {
    switch (safeSettings.colorscheme) {
      case "light":
        document.documentElement.classList.remove("dark");
        break;
      case "dark":
        document.documentElement.classList.add("dark");
        break;
      case "auto":
      default:
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        if (prefersDark) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
        break;
    }
  }, [safeSettings.colorscheme]);

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
