"use client";

import { io, Socket } from "socket.io-client";
import { Item, List } from "./types";

type ErrorReponse = { error: string };
type RespondFunction<T> = T extends undefined
  ? (val?: ErrorReponse) => void
  : (val: T | ErrorReponse) => void;
type EventWithAwk<T extends Record<string, unknown>, R = undefined> = (
  args: T,
  respond: RespondFunction<R>,
) => void;

interface ServerToClientEvents {}
interface ClientToServerEvents {
  "create-list": EventWithAwk<{ name: string }, List>;
  "delete-list": EventWithAwk<{ id: string }>;
  "join-list": EventWithAwk<{ id: string }>;
  "get-list": EventWithAwk<{ id: string }, List>;
  "add-item": EventWithAwk<{ listId: string; text: string }, Item>;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:4000",
);
