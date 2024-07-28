"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { LastOpenedListContext } from "./providers/last-opened-list-provider";

export default function Home() {
  const router = useRouter();
  const { lastOpenedList } = useContext(LastOpenedListContext);

  useEffect(() => {
    if (lastOpenedList) router.push(`/list/${lastOpenedList._id}`);
    else router.push("/home");
  }, [router, lastOpenedList]);
}
