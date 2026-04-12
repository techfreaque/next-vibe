ALTER TABLE "users" ADD COLUMN "creator_slug" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_creator_slug_unique" UNIQUE("creator_slug");