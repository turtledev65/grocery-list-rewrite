"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export default function useLocalStorage<T>(
  key: string,
  defaultValue?: T,
): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
  const isMounted = useRef(false);
  const [state, setState] = useState<T | undefined>(defaultValue);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) setState(JSON.parse(item));
    } catch (err) {
      console.error(err);
    }
    return () => {
      isMounted.current = false;
    };
  }, [key]);

  useEffect(() => {
    if (isMounted.current) {
      if (state === undefined) {
        localStorage.removeItem(key);
        return;
      }

      let res: string | undefined = undefined;
      try {
        res = JSON.stringify(state);
      } catch (err) {
        console.error(err);
      }

      if (typeof res === "string") localStorage.setItem(key, res);
    } else {
      isMounted.current = true;
    }
  }, [state, key]);

  return [state, setState];
}
