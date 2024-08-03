import { ChangeEvent, useId } from "react";
import { motion } from "framer-motion";
import cn from "classnames";

type Props = {
  value: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Switch = ({ value, onChange }: Props) => {
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
          "flex min-h-7 min-w-11 cursor-pointer items-center rounded-full p-[2px] transition-colors",
          value ? "justify-end bg-accent" : "bg-gray-500",
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

export default Switch;
