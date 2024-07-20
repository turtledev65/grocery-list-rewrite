"use client";

// React Query Provider
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext } from "react";
import { PanelSection } from "@/types";

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

// Panel
type PanelContextType = {
  active: boolean;
  title?: string;
  data: PanelSection | PanelSection[];
  activate: () => void;
  deactivate: () => void;
  setTitle: Dispatch<SetStateAction<string | undefined>>;
  setData: Dispatch<SetStateAction<PanelSection | PanelSection[]>>;
};
export const PanelContext = createContext<PanelContextType>(
  {} as PanelContextType,
);
const PanelProvider = ({ children }: PropsWithChildren) => {
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState<string | undefined>();
  const [data, setData] = useState<PanelSection | PanelSection[]>([]);

  const activate = useCallback(() => {
    setActive(true);
  }, []);
  const deactivate = useCallback(() => {
    setActive(false);
  }, []);

  return (
    <PanelContext.Provider
      value={{ active, title, data, activate, deactivate, setTitle, setData }}
    >
      {children}
    </PanelContext.Provider>
  );
};

const Providers = ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <PanelProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </PanelProvider>
    </QueryClientProvider>
  );
};
export default Providers;
