ALTER TABLE "chat_settings" ADD COLUMN "search_provider" jsonb;--> statement-breakpoint
ALTER TABLE "vfs_nodes" ADD COLUMN "sync_policy" text;--> statement-breakpoint
ALTER TABLE "vfs_nodes" ADD COLUMN "sync_id" uuid DEFAULT gen_random_uuid();