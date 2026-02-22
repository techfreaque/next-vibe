ALTER TABLE "custom_characters" ADD COLUMN "compact_trigger" integer;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN "compact_trigger" integer;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "compact_trigger" jsonb;