/**
 * Task System Seeds
 * Upserts all cron task definitions into the database on startup.
 * Task runners (dev-only infrastructure) are excluded.
 * Runs for both dev and prod so the UI always shows all tasks.
 */

/* eslint-disable i18next/no-literal-string */

import { eq, notInArray, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import type { NewCronTask } from "./cron/db";
import { cronTasks } from "./cron/db";
import { CronTaskPriority } from "./enum";

/**
 * Find the admin user id to assign as owner of seeded system tasks.
 * Returns null if no admin user exists yet (seeds run before user seeds in some envs).
 */
async function findAdminUserId(logger: EndpointLogger): Promise<string | null> {
  try {
    const [adminRole] = await db
      .select({ userId: userRoles.userId })
      .from(userRoles)
      .where(eq(userRoles.role, UserPermissionRole.ADMIN))
      .limit(1);

    if (adminRole) {
      logger.debug(`Found admin user for seeded tasks: ${adminRole.userId}`);
      return adminRole.userId;
    }

    logger.debug("No admin user found yet, seeding tasks without userId");
    return null;
  } catch (error) {
    logger.debug("Could not find admin user, seeding tasks without userId");
    return null;
  }
}

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

  // Find admin user to assign as owner of system tasks
  const adminUserId = await findAdminUserId(logger);

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
    userId: adminUserId,
  }));

  // Upsert: on name conflict only update non-user-configurable metadata.
  // Do NOT overwrite enabled/schedule/priority/timeout — those are user-overridable
  // via the UI and must survive restarts.
  await db
    .insert(cronTasks)
    .values(taskRows)
    .onConflictDoUpdate({
      target: cronTasks.name,
      set: {
        description: sql`excluded.description`,
        category: sql`excluded.category`,
        updatedAt: new Date(),
      },
    });

  logger.debug(
    `Successfully upserted ${taskRows.length} cron task definitions`,
  );

  // Remove stale tasks (renamed or deleted from the registry)
  const activeNames = taskRows.map((t) => t.name);
  const deleted = await db
    .delete(cronTasks)
    .where(notInArray(cronTasks.name, activeNames))
    .returning({ name: cronTasks.name });

  if (deleted.length > 0) {
    logger.debug(
      `Removed ${deleted.length} stale cron task(s): ${deleted.map((t) => t.name).join(", ")}`,
    );
  }
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
