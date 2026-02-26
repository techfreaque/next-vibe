ALTER TABLE "cron_tasks" ADD COLUMN "consecutive_failures" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "cron_tasks" ADD COLUMN "max_consecutive_failures" integer DEFAULT 5;