import { ReactNode } from "react";

export type List = {
  id: string;
  name: string;
  items?: Item[];
};

export type Item = {
  id: string;
  listId: string;
  text?: string;
  images?: Image[];
  pending?: boolean;
};

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
