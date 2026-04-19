ALTER TABLE "remote_connections" ADD COLUMN "sync_hashes" jsonb;--> statement-breakpoint
ALTER TABLE "remote_connections" ADD COLUMN "remote_sync_hashes" jsonb;