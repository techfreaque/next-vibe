/**
 * Task Sync Settings Repository
 * Enable  → insert the task-sync-pull cron task row.
 * Disable → delete it.
 * GET     → row exists = enabled, missing = disabled.
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { CRON_SCHEDULES, TASK_TIMEOUTS } from "../../constants";
import { cronTasks } from "../../cron/db";
import { CronTaskPriority, TaskCategory } from "../../enum";
import type { TaskSyncSettingsGetOutput } from "./definition";
import { TASK_SYNC_ALIAS } from "../pull/constants";

const TASK_SYNC_PULL_ID = "task-sync-pull";

export async function getTaskSyncSettings(
  logger: EndpointLogger,
): Promise<ResponseType<TaskSyncSettingsGetOutput>> {
  const row = await db
    .select({ id: cronTasks.id })
    .from(cronTasks)
    .where(eq(cronTasks.id, TASK_SYNC_PULL_ID))
    .limit(1);

  const syncEnabled = row.length > 0;
  logger.debug("Got task sync settings", { syncEnabled });
  return success({ syncEnabled });
}

export async function updateTaskSyncSettings(
  syncEnabled: boolean,
  logger: EndpointLogger,
): Promise<ResponseType<{ updated: boolean }>> {
  if (syncEnabled) {
    await db
      .insert(cronTasks)
      .values({
        id: TASK_SYNC_PULL_ID,
        shortId: TASK_SYNC_PULL_ID,
        routeId: TASK_SYNC_ALIAS,
        displayName: "taskSync.name",
        description: "taskSync.description",
        category: TaskCategory.SYSTEM,
        schedule: CRON_SCHEDULES.EVERY_MINUTE,
        enabled: true,
        hidden: true,
        priority: CronTaskPriority.HIGH,
        timeout: TASK_TIMEOUTS.MEDIUM,
        taskInput: {},
        runOnce: false,
        userId: null,
      })
      .onConflictDoUpdate({
        target: [cronTasks.id],
        set: { enabled: true, updatedAt: new Date() },
      });
    logger.info("Task sync enabled — row inserted");
  } else {
    await db.delete(cronTasks).where(eq(cronTasks.id, TASK_SYNC_PULL_ID));
    logger.info("Task sync disabled — row deleted");
  }

  return success({ updated: true });
}
