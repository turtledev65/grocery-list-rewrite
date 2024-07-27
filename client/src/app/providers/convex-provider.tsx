"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { PropsWithChildren } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const ConvexClientProvider = ({ children }: PropsWithChildren) => {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
};

export default ConvexClientProvider;
