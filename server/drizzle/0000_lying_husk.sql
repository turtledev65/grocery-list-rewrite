CREATE TABLE IF NOT EXISTS "image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"itemId" uuid NOT NULL,
	"url" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listId" uuid NOT NULL,
	"text" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL
);
