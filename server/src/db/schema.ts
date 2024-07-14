import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const List = pgTable("list", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  creationDate: timestamp("creationDate").notNull().defaultNow(),
});

export const ListRelations = relations(List, ({ many }) => ({
  items: many(Item),
}));

export const Item = pgTable("item", {
  id: uuid("id").primaryKey().defaultRandom(),
  listId: uuid("listId").notNull(),
  text: varchar("text").notNull(),
  creationDate: timestamp("creationDate").notNull().defaultNow(),
});

export const ItemRelations = relations(Item, ({ one, many }) => ({
  list: one(List, {
    fields: [Item.listId],
    references: [List.id],
  }),
  images: many(Image),
}));

export const Image = pgTable("image", {
  id: uuid("id").primaryKey().defaultRandom(),
  itemId: uuid("itemId").notNull(),
  url: varchar("url").notNull(),
});

export const ImageRelations = relations(Image, ({ one }) => ({
  item: one(Item, {
    fields: [Image.itemId],
    references: [Item.id],
  }),
}));
