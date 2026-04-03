ALTER TABLE "chat_favorites" ADD COLUMN "custom_variant_name" text;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN "image_vision_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN "video_vision_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN "audio_vision_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "image_vision_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "video_vision_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "audio_vision_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "image_vision_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "video_vision_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "audio_vision_model_selection" jsonb;--> statement-breakpoint
ALTER TABLE "chat_favorites" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "chat_favorites" DROP COLUMN "vision_bridge_model_selection";--> statement-breakpoint
ALTER TABLE "chat_settings" DROP COLUMN "vision_bridge_model_selection";--> statement-breakpoint
ALTER TABLE "custom_skills" DROP COLUMN "vision_bridge_model_selection";