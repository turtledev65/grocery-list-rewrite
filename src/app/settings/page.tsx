"use client";

import { useContext, useMemo } from "react";
import {
  DEFAULT_SETTINGS,
  SettingsContext,
} from "../providers/settings-provider";
import { Colorscheme } from "@/types";
import { Input, Section, Slider, Switch } from "./_components";

const SettingsPage = () => {
  const { settings, updateSettings } = useContext(SettingsContext);
  const safeSettings = useMemo(() => {
    if (!settings) return { ...DEFAULT_SETTINGS };
    return settings;
  }, [settings]);

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
            onSubmit={text => updateSettings({ defaultListTitle: text })}
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

export default SettingsPage;
