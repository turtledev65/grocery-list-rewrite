"use client";

import { io, Socket } from "socket.io-client";
import { Item, List } from "./types";

type ErrorReponse = { error: string };
type RespondFunction<T> = T extends undefined
  ? (val?: ErrorReponse) => void
  : (val: T | ErrorReponse) => void;
type EventWithAwk<T, R = undefined> = T extends undefined
  ? (respond: RespondFunction<R>) => void
  : (args: T, respond: RespondFunction<R>) => void;

export interface ServerToClientEvents {}
export interface ClientToServerEvents {
  "get-all-lists": EventWithAwk<undefined, List[]>;
  "create-list": EventWithAwk<{ name: string }, List>;
  "delete-list": EventWithAwk<{ id: string }>;
  "join-list": EventWithAwk<{ id: string }>;
  "get-list": EventWithAwk<{ id: string }, List>;
  "add-item": EventWithAwk<
    { listId: string; text: string; images?: string[] },
    Item
  >;
  "delete-item": EventWithAwk<{ id: string }, Item>;
  "edit-item": EventWithAwk<{ id: string; text: string }, Item>;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:4000",
);
