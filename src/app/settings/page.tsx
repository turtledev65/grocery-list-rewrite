"use client";

import {
  ChangeEvent,
  PropsWithChildren,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  DEFAULT_SETTINGS,
  SettingsContext,
} from "../providers/settings-provider";
import { motion } from "framer-motion";
import cn from "classnames";
import { Colorscheme } from "@/types";

const SettingsPage = () => {
  const { settings, updateSettings } = useContext(SettingsContext);
  const safeSettings = useMemo(() => {
    if (!settings) return { ...DEFAULT_SETTINGS };
    return settings;
  }, [settings]);
  const [val, setVal] = useState(false);
  const [_, startTransition] = useTransition();

  return (
    <div className="h-full px-4">
      <Section title="Behaivior">
        <div className="flex items-center justify-between gap-1">
          <div className="w-full">
            <h3 className="text-lg">Confirm to delete</h3>
            <p className="text-gray-700 dark:text-zinc-200">
              Ask before deleting a list
            </p>
          </div>
          <Switch
            value={safeSettings.askToConfirm}
            onChange={e => updateSettings({ askToConfirm: e.target.checked })}
          />
        </div>
        <div className="flex items-center justify-between gap-1">
          <div className="w-full">
            <h3 className="text-lg">Split text items</h3>
            <p className="text-gray-700 dark:text-zinc-200">
              Creates multiple items by splitting on `,`
            </p>
          </div>
          <Switch
            value={safeSettings.splitItems}
            onChange={e => updateSettings({ splitItems: e.target.checked })}
          />
        </div>
        <div className="flex flex-col items-center justify-between gap-1">
          <div className="w-full">
            <h3 className="text-lg">Default List Title</h3>
            <p className="text-gray-700 dark:text-zinc-200">
              The list title that will be automatically set when a new list is
              created
            </p>
          </div>
          <Input
            defaultValue={safeSettings.defaultListTitle}
            onSubmit={text =>
              startTransition(() => updateSettings({ defaultListTitle: text }))
            }
          />
        </div>
      </Section>
      <Section title="Appearance">
        <div className="flex flex-col items-center gap-1">
          <div className="w-full">
            <h3 className="text-lg">Base color scheme</h3>
            <p className="text-gray-700 dark:text-zinc-200">
              The app's color scheme
            </p>
          </div>
          <select
            value={safeSettings.colorscheme}
            onChange={e =>
              updateSettings({ colorscheme: e.target.value as Colorscheme })
            }
            className="my-2 w-full rounded-md border-4 border-transparent bg-gray-200 px-2 py-1 outline-none transition-colors hover:border-gray-400 dark:bg-zinc-700"
          >
            <option value="auto">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className="flex items-center justify-between gap-1">
          <div className="w-full">
            <h3 className="text-lg">Accent Color</h3>
            <p className="text-gray-700 dark:text-zinc-200">
              The accent color use throughout the app
            </p>
          </div>
          <input
            type="color"
            id="color"
            hidden
            onChange={e => updateSettings({ accentColor: e.target.value })}
          />
          <label
            htmlFor="color"
            className="min-h-8 min-w-8 rounded-full"
            style={{ backgroundColor: safeSettings.accentColor }}
          />
        </div>
        <div className="flex flex-col items-center justify-between gap-2">
          <div className="w-full">
            <h3 className="text-lg">Font Size</h3>
            <p className="text-gray-700 dark:text-zinc-200">
              Base font size in pixels that affects the whole app
            </p>
          </div>
          <Slider
            val={safeSettings.fontSize}
            min={10}
            max={30}
            onChange={e =>
              updateSettings({ fontSize: parseInt(e.target.value) })
            }
          />
        </div>
      </Section>
    </div>
  );
};

type InputProps = {
  defaultValue?: string;
  onSubmit?: (text: string) => void;
};
const Input = ({ defaultValue, onSubmit }: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        const text = inputRef.current?.value.trim();
        if (!text || !onSubmit) return;

        inputRef.current?.blur();
        onSubmit(text);
      }}
      className="w-full py-2"
    >
      <input
        type="text"
        defaultValue={defaultValue}
        ref={inputRef}
        className="w-full rounded-md border-4 border-transparent bg-gray-200 px-2 py-1 outline-none transition-colors hover:border-gray-400"
      />
    </form>
  );
};

type SliderProps = {
  val: number;
  min: number;
  max: number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};
const Slider = ({ val, min, max, onChange }: SliderProps) => {
  return (
    <div className="group relative w-full px-6 py-4">
      <input
        type="range"
        value={val}
        min={min}
        max={max}
        onChange={onChange}
        className="slider w-full"
      />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 transform rounded-md bg-gray-200 px-4 py-2 opacity-0 transition-opacity after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:transform after:border-[10px] after:border-solid after:border-transparent after:border-t-gray-200 after:content-[''] group-hover:opacity-100 dark:bg-zinc-800 after:dark:border-t-zinc-800">
        {val}
      </span>
    </div>
  );
};

type SectionProps = { title: string } & PropsWithChildren;
const Section = ({ title, children }: SectionProps) => {
  return (
    <section className="*:border-b-2 *:border-gray-300 *:py-2 last:*:border-transparent *:dark:border-slate-600">
      <h2 className="mt-4 text-3xl font-bold">{title}</h2>
      {children}
    </section>
  );
};

type SwitchProps = {
  value: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};
const Switch = ({ value, onChange }: SwitchProps) => {
  const id = useId();

  return (
    <>
      <input
        type="checkbox"
        hidden
        checked={value}
        onChange={onChange}
        id={id}
      />
      <label
        htmlFor={id}
        className={cn(
          "flex min-h-7 min-w-11 items-center rounded-full p-[2px] transition-colors",
          value ? "justify-end bg-purple-600" : "bg-gray-500",
        )}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 700, damping: 40 }}
          className="h-6 w-6 rounded-full bg-gray-50"
        />
      </label>
    </>
  );
};

export default SettingsPage;
