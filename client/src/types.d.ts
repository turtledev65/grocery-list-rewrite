import { ReactNode } from "react";
import schema from "../convex/schema";
import { Doc } from "../convex/_generated/dataModel";

export type List = Doc<"list"> & { items?: Item[] };
export type Item = Doc<"item"> & {pending?: boolean};

export type Image = {
  id: string;
  itemId: string;
  url: string;
  pending?: boolean;
};

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
