import "dotenv/config";
import { Server } from "socket.io";
import "./types";
import { ClientToServerEvents, ServerToClientEvents } from "./types";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { Item, List } from "./db/schema";
import { isUUID } from "./utils";

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: { origin: process.env.CORS_ORIGIN },
});

io.on("connection", socket => {
  console.log(`${socket.id} connected`);

  socket.on("create-list", async (args, respond) => {
    const [list] = await db
      .insert(List)
      .values({ name: args.name })
      .returning();
    if (!list) {
      respond({ error: `Failed to create list ${args.name}` });
      return;
    }

    respond(list);
  });

  socket.on("get-list", async (args, respond) => {
    if (!isUUID(args.id)) {
      respond({ error: `${args.id} is not a valid UUID` });
      return;
    }

    const list = await db.query.List.findFirst({
      where: eq(List.id, args.id),
      with: {
        items: {
          with: { images: true },
        },
      },
    });
    if (!list) {
      respond({ error: `Failed to find list with id ${args.id}` });
      return;
    }

    respond(list);
  });

  socket.on("add-item", async (args, respond) => {
    if (!isUUID(args.listId)) {
      respond({ error: `${args.listId} is not a valid UUID` });
      return;
    }

    const [item] = await db
      .insert(Item)
      .values({ listId: args.listId, text: args.text })
      .returning();
    respond(item);
  });
});

io.listen(parseInt(process.env.PORT));
console.log("Listening on port", process.env.PORT);
