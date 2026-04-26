ALTER TABLE "chat_settings" ADD COLUMN "dreamer_enabled" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "dreamer_favorite_id" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "dreamer_schedule" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "autopilot_enabled" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "autopilot_favorite_id" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "autopilot_schedule" jsonb;