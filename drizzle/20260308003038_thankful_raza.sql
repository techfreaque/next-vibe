ALTER TABLE "cron_tasks" ADD COLUMN "thread_id" uuid;--> statement-breakpoint
ALTER TABLE "cron_tasks" ADD COLUMN "tool_message_id" uuid;--> statement-breakpoint
ALTER TABLE "cron_tasks" ADD COLUMN "call_back_mode" text;