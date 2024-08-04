"use client";

import { createContext, PropsWithChildren, useCallback, useState } from "react";

type SidebarContextType = {
  active: boolean;
  toggle: () => void;
  activate: () => void;
  deactivate: () => void;
};
export const SidebarContext = createContext<SidebarContextType>(
  {} as SidebarContextType,
);
const SidebarProvider = ({ children }: PropsWithChildren) => {
  const [active, setActive] = useState(false);

  const toggle = useCallback(() => {
    setActive(old => !old);
  }, []);
  const activate = useCallback(() => {
    setActive(true);
  }, []);
  const deactivate = useCallback(() => {
    setActive(false);
  }, []);

  return (
    <SidebarContext.Provider value={{ active, toggle, activate, deactivate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
