CREATE TABLE "custom_characters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"avatar" text,
	"system_prompt" text NOT NULL,
	"category" text NOT NULL,
	"source" text DEFAULT 'app.api.agent.chat.characters.enums.source.my' NOT NULL,
	"task" text NOT NULL,
	"preferred_model" text,
	"voice" text,
	"suggested_prompts" jsonb DEFAULT '[]'::jsonb,
	"requirements" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ownership" jsonb NOT NULL,
	"display" jsonb NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_favorites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"character_id" text NOT NULL,
	"name" text,
	"custom_icon" text,
	"voice" text,
	"model_settings" jsonb NOT NULL,
	"ui_settings" jsonb NOT NULL,
	"use_count" integer DEFAULT 0 NOT NULL,
	"last_used_at" timestamp,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "custom_personas" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "custom_personas" CASCADE;--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "status" SET DEFAULT 'status.new';--> statement-breakpoint
ALTER TABLE "custom_characters" ADD CONSTRAINT "custom_characters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_favorites" ADD CONSTRAINT "chat_favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;