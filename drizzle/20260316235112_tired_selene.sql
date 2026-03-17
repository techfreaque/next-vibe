-- Add short_id column (nullable first so backfill can run)
ALTER TABLE "cron_tasks" ADD COLUMN "short_id" text;--> statement-breakpoint

-- Backfill existing rows:
--   system tasks (user_id IS NULL)  → use existing id (already a short slug)
--   user tasks   (user_id NOT NULL) → use existing id (UUID, guaranteed unique; new tasks get nanoid)
UPDATE "cron_tasks" SET "short_id" = "id";--> statement-breakpoint

-- Now enforce NOT NULL
ALTER TABLE "cron_tasks" ALTER COLUMN "short_id" SET NOT NULL;--> statement-breakpoint

-- Unique index for system tasks (user_id IS NULL): short_id must be globally unique among system tasks
CREATE UNIQUE INDEX "cron_tasks_system_short_id_unique" ON "cron_tasks" ("short_id") WHERE "user_id" IS NULL;--> statement-breakpoint

-- Unique index for user tasks (user_id NOT NULL): short_id must be unique per user
CREATE UNIQUE INDEX "cron_tasks_user_short_id_unique" ON "cron_tasks" ("user_id", "short_id") WHERE "user_id" IS NOT NULL;
