ALTER TABLE "cron_task_executions" ADD COLUMN "server_timezone" text;--> statement-breakpoint
ALTER TABLE "cron_task_executions" ADD COLUMN "executed_by_instance" text;