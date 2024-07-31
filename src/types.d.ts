import { ReactNode } from "react";
import schema from "../convex/schema";
import { Ent, EntWriter } from "../convex/types";
import { Doc } from "../convex/_generated/dataModel";

export type List = Doc<"lists"> & { items?: Item[] };
export type Item = Doc<"items"> & {image?: Image};
export type Image = Doc<"images">;

export type PanelItem = {
  label: string;
  icon?: ReactNode;
  critical?: boolean;
  className?: string;
  action: () => void;
};
export type PanelSection = PanelItem[];

type Settings = {
  askToConfirm: boolean;
};
