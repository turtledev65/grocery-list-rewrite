export type List = {
  id: string;
  name: string;
  items?: Item[];
};

export type Item = {
  id: string;
  listId: string;
  text: string;
  images?: Image[];
};

export type Image = {
  id: string;
  itemId: string;
  url: string;
};
