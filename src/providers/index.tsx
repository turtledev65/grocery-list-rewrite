"use client";

import { PropsWithChildren } from "react";
import PanelProvider from "./panel-provider";
import SidebarProvider from "./sidebar-provider";
import LastOpeendListProvider from "./last-opened-list-provider";
import SettingsProvider from "./settings-provider";
import ConvexClientProvider from "./convex-provider";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ConvexClientProvider>
      <SettingsProvider>
        <PanelProvider>
          <SidebarProvider>
            <LastOpeendListProvider>{children}</LastOpeendListProvider>
          </SidebarProvider>
        </PanelProvider>
      </SettingsProvider>
    </ConvexClientProvider>
  );
};
export default Providers;
