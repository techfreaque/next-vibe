ALTER TABLE "custom_characters" ALTER COLUMN "voice" SET DEFAULT 'app.api.agent.textToSpeech.voices.FEMALE';--> statement-breakpoint
ALTER TABLE "custom_characters" ALTER COLUMN "voice" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "custom_characters" ALTER COLUMN "suggested_prompts" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "custom_characters" ADD COLUMN "model_selection" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "custom_characters" ADD COLUMN "ownership_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN "model_selection" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN "position" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN "color" text;--> statement-breakpoint
ALTER TABLE "custom_characters" DROP COLUMN "preferred_model";--> statement-breakpoint
ALTER TABLE "custom_characters" DROP COLUMN "requirements";--> statement-breakpoint
ALTER TABLE "custom_characters" DROP COLUMN "preferences";--> statement-breakpoint
ALTER TABLE "custom_characters" DROP COLUMN "ownership";--> statement-breakpoint
ALTER TABLE "custom_characters" DROP COLUMN "display";--> statement-breakpoint
ALTER TABLE "chat_favorites" DROP COLUMN "model_settings";--> statement-breakpoint
ALTER TABLE "chat_favorites" DROP COLUMN "ui_settings";