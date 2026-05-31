ALTER TABLE "remote_connections" ADD COLUMN "is_system_provider" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "remote_connections" ADD COLUMN "ws_connected_at" timestamp;