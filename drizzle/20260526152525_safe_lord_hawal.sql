ALTER TABLE "remote_connections" ADD COLUMN "transport_mode" text DEFAULT 'cloud-only' NOT NULL;--> statement-breakpoint
ALTER TABLE "remote_connections" ADD COLUMN "allow_task_queue" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "remote_connections" ADD COLUMN "connection_direction" text DEFAULT 'bidirectional' NOT NULL;--> statement-breakpoint
ALTER TABLE "remote_connections" ADD COLUMN "thread_mirror_mode" text DEFAULT 'cloud' NOT NULL;--> statement-breakpoint
ALTER TABLE "remote_connections" ADD COLUMN "sync_scope" jsonb;