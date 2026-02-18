DROP TABLE "cron_task_schedules" CASCADE;--> statement-breakpoint
DROP TABLE "task_runner_state" CASCADE;--> statement-breakpoint
ALTER TABLE "chat_messages" DROP COLUMN "author_name";--> statement-breakpoint
ALTER TABLE "chat_messages" DROP COLUMN "author_avatar";--> statement-breakpoint
ALTER TABLE "chat_messages" DROP COLUMN "author_color";--> statement-breakpoint
ALTER TABLE "chat_messages" DROP COLUMN "edited";--> statement-breakpoint
ALTER TABLE "chat_messages" DROP COLUMN "original_id";--> statement-breakpoint
ALTER TABLE "chat_messages" DROP COLUMN "tokens";