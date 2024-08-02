import { FormEvent, useCallback, useRef } from "react";

type Props = {
  defaultValue?: string;
  onSubmit?: (text: string) => void;
};

const Input = ({ defaultValue, onSubmit }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const text = inputRef.current?.value.trim();
      if (!text || !onSubmit) return;

      inputRef.current?.blur();
      onSubmit(text);
    },
    [onSubmit],
  );

  return (
    <form onSubmit={handleSubmit} className="w-full py-2">
      <input
        type="text"
        defaultValue={defaultValue}
        ref={inputRef}
        className="w-full rounded-md border-4 border-transparent bg-gray-200 px-2 py-1 outline-none transition-colors hover:border-gray-400 dark:bg-zinc-700"
      />
    </form>
  );
};

export default Input;
