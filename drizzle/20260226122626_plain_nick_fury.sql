ALTER TABLE "cron_tasks" ADD COLUMN "history_interval" integer;--> statement-breakpoint
ALTER TABLE "cron_tasks" ADD COLUMN "last_history_logged_at" timestamp;