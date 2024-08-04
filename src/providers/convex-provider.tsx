"use client";

import { ConvexQueryClient } from "@convex-dev/react-query";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { PropsWithChildren } from "react";

let browserQueryClient: QueryClient | undefined = undefined;

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = getQueryClient();
convexQueryClient.connect(queryClient);

const ConvexClientProvider = ({ children }: PropsWithChildren) => {
  return (
    <ConvexProvider client={convex}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConvexProvider>
  );
};
export default ConvexClientProvider;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  });
}
function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
