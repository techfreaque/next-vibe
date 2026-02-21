-- Clean up duplicate/empty route_id rows left from the DEFAULT '' migration
-- Keep the most recently updated row for each duplicate group
DELETE FROM "cron_tasks"
WHERE "user_id" IS NULL
  AND "id" NOT IN (
    SELECT DISTINCT ON ("route_id") "id"
    FROM "cron_tasks"
    WHERE "user_id" IS NULL
    ORDER BY "route_id", "updated_at" DESC
  );--> statement-breakpoint
CREATE UNIQUE INDEX "cron_tasks_route_id_system_idx" ON "cron_tasks" USING btree ("route_id") WHERE "cron_tasks"."user_id" is null;
