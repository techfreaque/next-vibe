ALTER TABLE "cron_tasks" ADD COLUMN IF NOT EXISTS "history_interval" integer;--> statement-breakpoint
ALTER TABLE "cron_tasks" ADD COLUMN IF NOT EXISTS "last_history_logged_at" timestamp;