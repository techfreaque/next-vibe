CREATE TABLE "ssh_connection_mounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"connection_id" uuid NOT NULL,
	"name" text NOT NULL,
	"path" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "support_sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "support_sessions" CASCADE;--> statement-breakpoint
ALTER TABLE "remote_connections" ALTER COLUMN "transport_mode" SET DEFAULT 'reverse-ws';--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "cortex_nodes" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "remote_connections" ADD COLUMN "is_reverse_entry" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "remote_connections" ADD COLUMN "is_inference_provider" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "remote_connections" ADD COLUMN "sent_capabilities_version" text;--> statement-breakpoint
ALTER TABLE "remote_connections" ADD COLUMN "sync_cursors" jsonb;--> statement-breakpoint
ALTER TABLE "remote_connections" ADD COLUMN "push_cursors" jsonb;--> statement-breakpoint
ALTER TABLE "ssh_connection_mounts" ADD CONSTRAINT "ssh_connection_mounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ssh_connection_mounts" ADD CONSTRAINT "ssh_connection_mounts_connection_id_ssh_connections_id_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."ssh_connections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "remote_connections" DROP COLUMN "allow_task_queue";--> statement-breakpoint
ALTER TABLE "remote_connections" DROP COLUMN "connection_direction";--> statement-breakpoint
ALTER TABLE "remote_connections" DROP COLUMN "is_directly_accessible";--> statement-breakpoint
ALTER TABLE "remote_connections" DROP COLUMN "is_default";--> statement-breakpoint
ALTER TABLE "remote_connections" DROP COLUMN "is_system_provider";--> statement-breakpoint
ALTER TABLE "remote_connections" DROP COLUMN "sync_hashes";--> statement-breakpoint
ALTER TABLE "remote_connections" DROP COLUMN "remote_sync_hashes";--> statement-breakpoint
ALTER TABLE "remote_connections" DROP COLUMN "task_cursor";