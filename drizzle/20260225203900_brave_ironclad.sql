ALTER TABLE "cron_task_executions" ADD COLUMN IF NOT EXISTS "server_timezone" text;--> statement-breakpoint
ALTER TABLE "cron_task_executions" ADD COLUMN IF NOT EXISTS "executed_by_instance" text;