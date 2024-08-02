import { ChangeEvent } from "react";

type Props = {
  val: number;
  min: number;
  max: number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Slider = ({ val, min, max, onChange }: Props) => {
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

export default Slider;
