ALTER TABLE "chat_favorites" ADD COLUMN "memory_limit" integer;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN "denied_tools" jsonb;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN "prompt_append" text;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "memory_limit" integer;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "memory_limit" integer;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "denied_tools" jsonb;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "skill_type" text;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "status" text;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "companion_prompt" text;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "published_at" timestamp;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "change_note" text;