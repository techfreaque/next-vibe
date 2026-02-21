/**
 * Task Sync Repository
 * Handles remote sync of cron tasks between Thea instances (prod ↔ local).
 * Syncs cron task definitions so both instances stay in sync.
 */

import "server-only";

import { eq, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { env } from "@/config/env";

import { cronTasks } from "../cron/db";
import type { CronTaskPriorityDB } from "../enum";
import type { JsonValue } from "../unified-runner/types";

type CronTaskSelect = typeof cronTasks.$inferSelect;

/**
 * Serialized cron task for sync payloads
 */
export interface SyncedCronTask {
  id: string;
  routeId: string;
  displayName: string;
  description: string | null;
  category: string;
  schedule: string;
  enabled: boolean;
  priority: (typeof CronTaskPriorityDB)[number];
  timeout: number | null;
  taskInput: Record<string, JsonValue>;
  tags: string[];
}

function serializeForSync(task: CronTaskSelect): SyncedCronTask {
  return {
    id: task.id,
    routeId: task.routeId,
    displayName: task.displayName,
    description: task.description,
    category: task.category,
    schedule: task.schedule,
    enabled: task.enabled,
    priority: task.priority,
    timeout: task.timeout,
    taskInput: task.taskInput,
    tags: task.tags as string[],
  };
}

/**
 * Upsert cron tasks from a remote instance.
 * Only inserts tasks that don't already exist locally (by routeId match).
 */
export async function upsertRemoteTasks(params: {
  tasks: SyncedCronTask[];
  logger: EndpointLogger;
}): Promise<ResponseType<{ synced: number }>> {
  const { tasks, logger } = params;
  let synced = 0;

  for (const remoteTask of tasks) {
    try {
      // Check if task with same routeId already exists
      const [existing] = await db
        .select({ id: cronTasks.id })
        .from(cronTasks)
        .where(eq(cronTasks.routeId, remoteTask.routeId))
        .limit(1);

      if (existing) {
        // Update schedule/config if changed
        await db
          .update(cronTasks)
          .set({
            schedule: remoteTask.schedule,
            enabled: remoteTask.enabled,
            priority: remoteTask.priority,
            taskInput: remoteTask.taskInput,
            updatedAt: new Date(),
          })
          .where(eq(cronTasks.id, existing.id));
        synced++;
      } else {
        await db.insert(cronTasks).values({
          routeId: remoteTask.routeId,
          displayName: remoteTask.displayName,
          description: remoteTask.description,
          category: remoteTask.category,
          schedule: remoteTask.schedule,
          enabled: remoteTask.enabled,
          priority: remoteTask.priority,
          timeout: remoteTask.timeout,
          taskInput: remoteTask.taskInput,
          tags: remoteTask.tags,
        });
        synced++;
      }

      logger.debug("Synced remote cron task", {
        routeId: remoteTask.routeId,
        displayName: remoteTask.displayName,
      });
    } catch (error) {
      logger.error("Failed to upsert remote cron task", {
        routeId: remoteTask.routeId,
        ...parseError(error),
      });
    }
  }

  return success({ synced });
}

/**
 * Get all user-created cron tasks for sync (excludes system-seeded tasks).
 */
export async function getUserCreatedTasks(params: {
  logger: EndpointLogger;
}): Promise<ResponseType<{ tasks: SyncedCronTask[] }>> {
  const { logger } = params;

  try {
    const tasks = await db
      .select()
      .from(cronTasks)
      .where(sql`${cronTasks.userId} IS NOT NULL`)
      .limit(100);

    return success({
      tasks: tasks.map((t) => serializeForSync(t)),
    });
  } catch (error) {
    logger.error("Failed to get user-created tasks", parseError(error));
    return fail({
      message:
        "app.api.system.unifiedInterface.tasks.taskSync.errors.listFailed",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

/**
 * Build headers for remote sync requests.
 */
function buildRemoteSyncHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const leadId = env.THEA_REMOTE_LEAD_ID;
  if (leadId) {
    headers.Cookie = `lead_id=${leadId}`;
  }
  return headers;
}

/**
 * Pull cron tasks from remote Thea instance and upsert locally.
 */
export async function pullFromRemote(
  logger: EndpointLogger,
): Promise<ResponseType<{ pulled: number }>> {
  const remoteUrl = env.THEA_REMOTE_URL;
  const apiKey = env.THEA_REMOTE_API_KEY;

  if (!remoteUrl || !apiKey) {
    return success({ pulled: 0 });
  }

  try {
    const syncUrl = `${remoteUrl.replace(/\/$/, "")}/api/en-GLOBAL/system/unified-interface/tasks/task-sync`;

    const response = await fetch(syncUrl, {
      method: "POST",
      headers: buildRemoteSyncHeaders(),
      body: JSON.stringify({ apiKey }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      logger.error("Pull from remote failed", {
        status: response.status,
        statusText: response.statusText,
      });
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.taskSync.errors.syncFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const result = (await response.json()) as {
      success: boolean;
      data?: {
        tasksJson?: string;
        synced?: number;
      };
    };

    if (!result.success || !result.data) {
      logger.error("Pull from remote returned failure", { result });
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.taskSync.errors.syncFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    let pulled = 0;
    if (result.data.tasksJson) {
      const remoteTasks = JSON.parse(result.data.tasksJson) as SyncedCronTask[];
      if (remoteTasks.length > 0) {
        const upsertResult = await upsertRemoteTasks({
          tasks: remoteTasks,
          logger,
        });
        pulled = upsertResult.success ? upsertResult.data.synced : 0;
      }
    }

    if (pulled > 0) {
      logger.info(`Remote sync: pulled ${pulled} cron tasks`);
    }

    return success({ pulled });
  } catch (error) {
    logger.error("Pull from remote error", parseError(error));
    return fail({
      message:
        "app.api.system.unifiedInterface.tasks.taskSync.errors.syncFailed",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
