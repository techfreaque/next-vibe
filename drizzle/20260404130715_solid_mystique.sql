ALTER TABLE "chat_favorites" ADD COLUMN "video_gen_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "video_gen_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "chat_favorites" DROP COLUMN "video_gen_model_id";--> statement-breakpoint
ALTER TABLE "chat_settings" DROP COLUMN "video_gen_model_id";