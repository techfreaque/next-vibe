ALTER TABLE "custom_characters" ADD COLUMN "active_tools" jsonb;--> statement-breakpoint
ALTER TABLE "custom_characters" ADD COLUMN "visible_tools" jsonb;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN "active_tools" jsonb;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN "visible_tools" jsonb;