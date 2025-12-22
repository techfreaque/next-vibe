ALTER TABLE "custom_personas" ALTER COLUMN "source" SET DEFAULT 'app.api.agent.chat.characters.enums.source.my';--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "status" SET DEFAULT 'status.new';--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN "custom_icon" text;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD COLUMN "voice" text;--> statement-breakpoint
ALTER TABLE "custom_personas" ADD COLUMN "avatar" text;--> statement-breakpoint
ALTER TABLE "custom_personas" ADD COLUMN "task" text NOT NULL;--> statement-breakpoint
ALTER TABLE "custom_personas" ADD COLUMN "voice" text;--> statement-breakpoint
ALTER TABLE "custom_personas" ADD COLUMN "requirements" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "custom_personas" ADD COLUMN "preferences" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "custom_personas" ADD COLUMN "ownership" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "custom_personas" ADD COLUMN "display" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "custom_personas" DROP COLUMN "metadata";