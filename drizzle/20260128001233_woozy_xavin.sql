CREATE TABLE "chat_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"selected_model" jsonb,
	"selected_character" jsonb,
	"active_favorite_id" jsonb,
	"tts_autoplay" jsonb,
	"tts_voice" jsonb,
	"view_mode" jsonb,
	"enabled_tools" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chat_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "custom_characters" ALTER COLUMN "system_prompt" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "custom_characters" ALTER COLUMN "voice" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "custom_characters" ALTER COLUMN "voice" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_favorites" ALTER COLUMN "model_selection" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD CONSTRAINT "chat_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_characters" DROP COLUMN "avatar";--> statement-breakpoint
ALTER TABLE "custom_characters" DROP COLUMN "source";--> statement-breakpoint
ALTER TABLE "custom_characters" DROP COLUMN "task";--> statement-breakpoint
ALTER TABLE "custom_characters" DROP COLUMN "suggested_prompts";--> statement-breakpoint
ALTER TABLE "custom_characters" DROP COLUMN "is_public";--> statement-breakpoint
ALTER TABLE "chat_favorites" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "leads" DROP COLUMN "consultation_booked_at";--> statement-breakpoint
ALTER TABLE "cron_tasks" DROP COLUMN "dependencies";--> statement-breakpoint
ALTER TABLE "cron_tasks" DROP COLUMN "monitoring";--> statement-breakpoint
ALTER TABLE "cron_tasks" DROP COLUMN "documentation";