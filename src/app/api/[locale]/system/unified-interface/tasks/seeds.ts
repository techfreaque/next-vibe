/**
 * Task System Seeds
 * Upserts all cron task definitions into the database on startup.
 * Task runners (dev-only infrastructure) are excluded.
 * Runs for both dev and prod so the UI always shows all tasks.
 */

/* eslint-disable i18next/no-literal-string */

import { sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { NewCronTask } from "./cron/db";
import { cronTasks } from "./cron/db";
import { CronTaskPriority } from "./enum";

/**
 * Upsert all cron tasks from the task registry into the DB.
 * Uses ON CONFLICT (name) DO UPDATE to keep definitions current.
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
    name: task.name,
    description: task.description,
    category: String(task.category),
    schedule: task.schedule,
    enabled: task.enabled,
    // priority is already the correct DB enum string value from CronTaskPriority
    priority: task.priority ?? CronTaskPriority.MEDIUM,
    timeout: task.timeout ?? 300000,
    defaultConfig: {},
  }));

  // Upsert: insert or update on name conflict to keep definitions in sync
  await db
    .insert(cronTasks)
    .values(taskRows)
    .onConflictDoUpdate({
      target: cronTasks.name,
      set: {
        description: sql`excluded.description`,
        category: sql`excluded.category`,
        schedule: sql`excluded.schedule`,
        enabled: sql`excluded.enabled`,
        priority: sql`excluded.priority`,
        timeout: sql`excluded.timeout`,
        updatedAt: new Date(),
      },
    });

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
