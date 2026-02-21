/**
 * Task System Seeds
 * Upserts all cron task definitions into the database on startup.
 * Task runners (dev-only infrastructure) are excluded.
 * Runs for both dev and prod so the UI always shows all tasks.
 */

/* eslint-disable i18next/no-literal-string */

import { isNull, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { NewCronTask } from "./cron/db";
import { cronTasks } from "./cron/db";
import { CronTaskPriority } from "./enum";

/**
 * Upsert all cron tasks from the task registry into the DB.
 * System tasks (userId IS NULL) use the partial unique index on routeId.
 * Task runners are excluded (dev-only infrastructure tasks).
 */
async function upsertTaskDefinitions(logger: EndpointLogger): Promise<void> {
  const { taskRegistry } =
    await import("@/app/api/[locale]/system/generated/tasks-index");

  // Only cron tasks go into cronTasks DB table
  // task-runners are dev-only and not persisted
  const { cronTasks: cronTaskDefs } = taskRegistry;

  if (cronTaskDefs.length === 0) {
    logger.debug("No cron tasks to seed");
    return;
  }

  logger.debug(
    `Upserting ${cronTaskDefs.length} cron task definitions into DB`,
  );

  const taskRows: NewCronTask[] = cronTaskDefs.map((task) => ({
    // System tasks: routeId stores the task name as unique identifier
    routeId: task.name,
    displayName: task.name,
    description: task.description,
    category: String(task.category),
    schedule: task.schedule,
    enabled: task.enabled,
    priority: task.priority ?? CronTaskPriority.MEDIUM,
    timeout: task.timeout ?? 300000,
    // taskInput is a flat merge of all inputs the task executes with.
    // splitTaskArgs() splits by schema at execution time.
    taskInput: task.taskInput ?? {},
    runOnce: task.runOnce ?? false,
    // System tasks have no user owner (null userId)
    userId: null,
  }));

  // Upsert using the partial unique index on routeId WHERE userId IS NULL.
  // Do NOT overwrite enabled/schedule/priority/timeout/taskInput — those are user-overridable.
  // Preserve displayName if DB already has one (may be a translated string vs code's translation key).
  for (const row of taskRows) {
    await db
      .insert(cronTasks)
      .values(row)
      .onConflictDoUpdate({
        target: [cronTasks.routeId],
        targetWhere: isNull(cronTasks.userId),
        set: {
          displayName: sql`COALESCE(NULLIF(${cronTasks.displayName}, ''), excluded.display_name)`,
          description: sql`excluded.description`,
          category: sql`excluded.category`,
          updatedAt: new Date(),
        },
      });
  }

  logger.debug(
    `Successfully upserted ${taskRows.length} cron task definitions`,
  );
}

export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding task definitions (dev)...");
  await upsertTaskDefinitions(logger);
}

export async function prod(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding task definitions (prod)...");
  await upsertTaskDefinitions(logger);
}

export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding task definitions (test)...");
  await upsertTaskDefinitions(logger);
}

// Run early so tasks are in DB before other seeds that may depend on them
export const priority = 1;
