"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function useLocalStorage<T>(
  key: string,
  defaultValue?: T,
): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
  const [state, setState] = useState<T | undefined>();

  useEffect(() => {
    let val: T | undefined;

    const jsonVal = localStorage.getItem(key);
    if (jsonVal !== null) val = JSON.parse(jsonVal);
    else val = defaultValue;

    setState(val);
  }, []);

  useEffect(() => {
    if (state === undefined) return localStorage.removeItem(key);

    let res: string;
    try {
      res = JSON.stringify(state);
    } catch (err) {
      res = "";
    }
    localStorage.setItem(key, res);
  }, [state]);

  return [state, setState];
}
