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
import type {
  TaskSyncSettingsGetOutput,
  TaskSyncSettingsPatchResponseOutput,
} from "./definition";
import { TASK_SYNC_ALIAS } from "../pull/constants";

export class TaskSyncSettingsRepository {
  private static readonly TASK_SYNC_PULL_ID = "task-sync-pull";
  static async getTaskSyncSettings(
    logger: EndpointLogger,
  ): Promise<ResponseType<TaskSyncSettingsGetOutput>> {
    const row = await db
      .select({ id: cronTasks.id })
      .from(cronTasks)
      .where(eq(cronTasks.id, TaskSyncSettingsRepository.TASK_SYNC_PULL_ID))
      .limit(1);

    const syncEnabled = row.length > 0;
    logger.debug("Got task sync settings", { syncEnabled });
    return success({ syncEnabled });
  }

  static async updateTaskSyncSettings(
    syncEnabled: boolean,
    logger: EndpointLogger,
  ): Promise<ResponseType<TaskSyncSettingsPatchResponseOutput>> {
    if (syncEnabled) {
      await db
        .insert(cronTasks)
        .values({
          id: TaskSyncSettingsRepository.TASK_SYNC_PULL_ID,
          shortId: TaskSyncSettingsRepository.TASK_SYNC_PULL_ID,
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
      await db
        .delete(cronTasks)
        .where(eq(cronTasks.id, TaskSyncSettingsRepository.TASK_SYNC_PULL_ID));
      logger.info("Task sync disabled — row deleted");
    }

    return success({ updated: true });
  }
}
