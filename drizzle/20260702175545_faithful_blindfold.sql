ALTER TABLE "remote_connections" ADD COLUMN "last_transport_used" text;--> statement-breakpoint
ALTER TABLE "remote_connections" ADD COLUMN "last_transport_used_at" timestamp;