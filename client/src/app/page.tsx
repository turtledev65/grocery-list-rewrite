"use client";

import { socket } from "@/socket";
import { useRef } from "react";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2">
      <input
        ref={inputRef}
        type="text"
        className="rounded-2xl border-2 border-gray-700 bg-gray-100 px-2 py-1 text-xl"
      />
      <button
        onClick={async () => {
          const val = inputRef.current?.value;
          const res = await socket.emitWithAck("create-list", { name: val });
          console.log(res);
        }}
        type="submit"
        className="rounded-3xl border-2 border-gray-700 bg-gray-100 px-2"
      >
        Create List
      </button>
      <button
        onClick={async () => {
          const val = inputRef.current?.value;
          const res = await socket.emitWithAck("get-list", { id: val });
          console.log(res);
        }}
        type="submit"
        className="rounded-3xl border-2 border-gray-700 bg-gray-100 px-2"
      >
        Get List
      </button>
    </main>
  );
}
