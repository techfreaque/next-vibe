CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "cortex_nodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"path" text NOT NULL,
	"node_type" text NOT NULL,
	"content" text,
	"size" integer DEFAULT 0 NOT NULL,
	"view_type" text,
	"icon" text,
	"frontmatter" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"embedding" vector(3072),
	"content_hash" text,
	"sync_policy" text,
	"sync_id" uuid DEFAULT gen_random_uuid(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid,
	"initiator_id" uuid,
	"initiator_instance_url" text,
	"supporter_id" uuid,
	"supporter_instance_url" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "remote_connections" ALTER COLUMN "token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "remote_connections" ALTER COLUMN "lead_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "search_provider" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "dreamer_enabled" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "dreamer_favorite_id" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "dreamer_schedule" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "dreamer_prompt" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "autopilot_enabled" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "autopilot_favorite_id" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "autopilot_schedule" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "autopilot_prompt" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "mama_enabled" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "mama_schedule" jsonb;--> statement-breakpoint
ALTER TABLE "chat_settings" ADD COLUMN "mama_prompt" jsonb;--> statement-breakpoint
ALTER TABLE "cron_tasks" ADD COLUMN "wake_up_sub_agent_depth" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "facebook_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "rumble_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "odysee_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "nostr_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gab_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tribe_url" text;--> statement-breakpoint
ALTER TABLE "remote_connections" ADD COLUMN "sync_hashes" jsonb;--> statement-breakpoint
ALTER TABLE "remote_connections" ADD COLUMN "remote_sync_hashes" jsonb;--> statement-breakpoint
ALTER TABLE "cortex_nodes" ADD CONSTRAINT "cortex_nodes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_sessions" ADD CONSTRAINT "support_sessions_thread_id_chat_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."chat_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_sessions" ADD CONSTRAINT "support_sessions_initiator_id_users_id_fk" FOREIGN KEY ("initiator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_sessions" ADD CONSTRAINT "support_sessions_supporter_id_users_id_fk" FOREIGN KEY ("supporter_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cortex_nodes_user_path_idx" ON "cortex_nodes" USING btree ("user_id","path");--> statement-breakpoint
CREATE INDEX "cortex_nodes_user_id_idx" ON "cortex_nodes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cortex_nodes_frontmatter_idx" ON "cortex_nodes" USING gin ("frontmatter");--> statement-breakpoint
CREATE INDEX "cortex_nodes_content_search_idx" ON "cortex_nodes" USING gin (to_tsvector('english', COALESCE("content", '') || ' ' || "path"));--> statement-breakpoint
CREATE INDEX "support_sessions_status_idx" ON "support_sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "support_sessions_thread_id_idx" ON "support_sessions" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "support_sessions_initiator_instance_idx" ON "support_sessions" USING btree ("initiator_instance_url");--> statement-breakpoint
ALTER TABLE "chat_favorites" DROP COLUMN "default_chat_mode";--> statement-breakpoint
ALTER TABLE "chat_settings" DROP COLUMN "voice_model_selection";--> statement-breakpoint
ALTER TABLE "chat_settings" DROP COLUMN "stt_model_selection";--> statement-breakpoint
ALTER TABLE "chat_settings" DROP COLUMN "image_vision_model_selection";--> statement-breakpoint
ALTER TABLE "chat_settings" DROP COLUMN "video_vision_model_selection";--> statement-breakpoint
ALTER TABLE "chat_settings" DROP COLUMN "audio_vision_model_selection";--> statement-breakpoint
ALTER TABLE "chat_settings" DROP COLUMN "default_chat_mode";--> statement-breakpoint
ALTER TABLE "chat_settings" DROP COLUMN "image_gen_model_selection";--> statement-breakpoint
ALTER TABLE "chat_settings" DROP COLUMN "music_gen_model_selection";--> statement-breakpoint
ALTER TABLE "chat_settings" DROP COLUMN "video_gen_model_selection";--> statement-breakpoint
ALTER TABLE "chat_settings" DROP COLUMN "active_tools";--> statement-breakpoint
ALTER TABLE "chat_settings" DROP COLUMN "visible_tools";--> statement-breakpoint
ALTER TABLE "chat_settings" DROP COLUMN "compact_trigger";--> statement-breakpoint
ALTER TABLE "chat_settings" DROP COLUMN "memory_limit";--> statement-breakpoint
ALTER TABLE "custom_skills" DROP COLUMN "default_chat_mode";--> statement-breakpoint
ALTER TABLE "remote_connections" DROP COLUMN "memories_hash";--> statement-breakpoint
ALTER TABLE "remote_connections" DROP COLUMN "remote_memories_hash";