"use client";

import { useContext } from "react";
import {
  DEFAULT_SETTINGS,
  SettingsContext,
} from "@/providers/settings-provider";
import { Colorscheme } from "@/types";
import { Input, Section, Slider, Switch } from "./_components";
import ColorPicker from "./_components/color-picker";

const SettingsPage = () => {
  const { settings, updateSettings } = useContext(SettingsContext);

  return (
    <div className="px-4">
      <Section title="Behaivior">
        <div className="flex items-center justify-between gap-1">
          <div className="w-full">
            <h3 className="text-lg">Confirm to delete</h3>
            <p className="text-gray-700 dark:text-zinc-200">
              Ask before deleting a list
            </p>
          </div>
          <Switch
            value={settings.askToConfirm}
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
            value={settings.splitItems}
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
            defaultValue={settings.defaultListTitle}
            onSubmit={text => updateSettings({ defaultListTitle: text })}
          />
        </div>
      </Section>
      <Section title="Appearance">
        <div className="flex flex-col items-center gap-1">
          <div className="w-full">
            <h3 className="text-lg">Base color scheme</h3>
            <p className="text-gray-700 dark:text-zinc-200">
              The app&apos;s color scheme
            </p>
          </div>
          <select
            value={settings.colorscheme}
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
          <ColorPicker
            defaultValue={DEFAULT_SETTINGS.accentColor}
            value={settings.accentColor}
            onChange={e => updateSettings({ accentColor: e.target.value })}
            onReset={() => updateSettings({accentColor: DEFAULT_SETTINGS.accentColor})}
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
            val={settings.fontSize}
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
