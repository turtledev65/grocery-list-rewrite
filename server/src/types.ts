import { type InferSelectModel } from "drizzle-orm";
import * as schema from "./db/schema";

export type List = InferSelectModel<typeof schema.List> & { items?: Item[] };
export type Item = InferSelectModel<typeof schema.Item> & { images?: Image[] };
export type Image = InferSelectModel<typeof schema.Image>;

// Socket Events
export type ErrorReponse = { error: string };
export type RespondFunction<T> = T extends undefined
  ? (val?: ErrorReponse) => void
  : (val: T | ErrorReponse) => void;
export type EventWithAwk<T extends Record<string, unknown>, R = undefined> = (
  args: T,
  respond: RespondFunction<R>,
) => void;

export interface ServerToClientEvents {}
export interface ClientToServerEvents {
  "create-list": EventWithAwk<{ name: string }, List>;
  "delete-list": EventWithAwk<{ id: string }>;
  "join-list": EventWithAwk<{ id: string }>;
  "get-list": EventWithAwk<{ id: string }, List>;
  "add-item": EventWithAwk<{ listId: string; text: string }, Item>;
  "delete-item": EventWithAwk<{ id: string }, Item>;
}
