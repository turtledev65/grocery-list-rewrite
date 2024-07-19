"use client";

// React Query Provider
import { PropsWithChildren, useCallback, useState } from "react";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: 0,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

// Sidebar Provider
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

const Providers = ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>{children}</SidebarProvider>
      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition="top-right"
        position="right"
      />
    </QueryClientProvider>
  );
};
export default Providers;
