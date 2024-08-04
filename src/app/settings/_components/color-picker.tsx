"use client";

import { ChangeEvent } from "react";
import { GrPowerReset as ResetIcon } from "react-icons/gr";

type Props = {
  defaultValue: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
};

const ColorPicker = ({ defaultValue, value, onChange, onReset }: Props) => {
  return (
    <div className="flex gap-2 items-center">
      {defaultValue !== value && (
        <ResetIcon onClick={onReset} className="cursor-pointer text-3xl text-gray-500" />
      )}
      <input type="color" id="color" hidden value={value} onChange={onChange} />
      <label
        htmlFor="color"
        className="min-h-8 min-w-8 cursor-pointer rounded-full"
        style={{ backgroundColor: value }}
      />
    </div>
  );
};

export default ColorPicker;
