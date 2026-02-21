ALTER TABLE "chat_settings" ADD COLUMN "active_tools" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "visible_tools" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" DROP COLUMN "enabled_tools";