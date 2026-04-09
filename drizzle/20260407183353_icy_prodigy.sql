CREATE TABLE "lead_magnet_captures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"config_id" uuid NOT NULL,
	"skill_id" uuid,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"status" text DEFAULT 'enums.captureStatus.success' NOT NULL,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_magnet_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"credentials" jsonb NOT NULL,
	"list_id" text,
	"headline" text,
	"button_text" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lead_magnet_configs_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "long_content" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "website_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "twitter_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "youtube_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "instagram_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tiktok_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "github_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "discord_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "creator_accent_color" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "creator_header_image_url" text;--> statement-breakpoint
ALTER TABLE "lead_magnet_captures" ADD CONSTRAINT "lead_magnet_captures_config_id_lead_magnet_configs_id_fk" FOREIGN KEY ("config_id") REFERENCES "public"."lead_magnet_configs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_magnet_captures" ADD CONSTRAINT "lead_magnet_captures_skill_id_custom_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."custom_skills"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_magnet_configs" ADD CONSTRAINT "lead_magnet_configs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lead_magnet_captures_config_idx" ON "lead_magnet_captures" USING btree ("config_id");--> statement-breakpoint
CREATE INDEX "lead_magnet_captures_skill_idx" ON "lead_magnet_captures" USING btree ("skill_id");--> statement-breakpoint
CREATE INDEX "lead_magnet_captures_created_idx" ON "lead_magnet_captures" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "lead_magnet_configs_user_idx" ON "lead_magnet_configs" USING btree ("user_id");