ALTER TABLE "cron_task_executions" DROP CONSTRAINT IF EXISTS "cron_task_executions_task_id_cron_tasks_id_fk";--> statement-breakpoint
DROP INDEX IF EXISTS "cron_tasks_route_id_system_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "cron_tasks_route_id_system_unique";--> statement-breakpoint
ALTER TABLE "cron_tasks" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "cron_tasks" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "cron_task_executions" ALTER COLUMN "task_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "cron_task_executions" ADD CONSTRAINT "cron_task_executions_task_id_cron_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "cron_tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
