ALTER TABLE "cron_tasks" DROP CONSTRAINT "cron_tasks_name_unique";--> statement-breakpoint
ALTER TABLE "cron_tasks" ADD COLUMN "route_id" text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE "cron_tasks" ADD COLUMN "display_name" text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE "cron_tasks" ALTER COLUMN "route_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "cron_tasks" ALTER COLUMN "display_name" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "cron_tasks" ADD COLUMN "task_input" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "cron_tasks" ADD COLUMN "run_once" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "cron_tasks" ADD COLUMN "output_mode" text DEFAULT 'app.api.system.unifiedInterface.tasks.outputMode.storeOnly' NOT NULL;--> statement-breakpoint
ALTER TABLE "cron_tasks" ADD COLUMN "notification_targets" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "cron_task_executions" DROP COLUMN "error_stack";--> statement-breakpoint
ALTER TABLE "cron_tasks" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "cron_tasks" DROP COLUMN "default_config";