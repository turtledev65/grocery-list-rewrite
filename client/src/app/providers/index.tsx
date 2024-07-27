"use client";

import { PropsWithChildren } from "react";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import PanelProvider from "./panel-provider";
import SidebarProvider from "./sidebar-provider";
import LastOpeendListProvider from "./last-opened-list-provider";
import SettingsProvider from "./settings-provider";
import ConvexClientProvider from "./convex-provider";

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

const Providers = ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient();

  return (
    <ConvexClientProvider>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <PanelProvider>
            <SidebarProvider>
              <LastOpeendListProvider>{children}</LastOpeendListProvider>
            </SidebarProvider>
          </PanelProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </ConvexClientProvider>
  );
};
export default Providers;
