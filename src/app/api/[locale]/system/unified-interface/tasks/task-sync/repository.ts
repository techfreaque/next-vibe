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
import type { CronTaskPriorityDB, TaskCategoryDB } from "../enum";
import type { scopedTranslation } from "../i18n";
import type { JsonValue } from "../unified-runner/types";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

type CronTaskSelect = typeof cronTasks.$inferSelect;

/**
 * Serialized cron task for sync payloads
 */
export interface SyncedCronTask {
  id: string;
  routeId: string;
  displayName: string;
  description: string | null;
  category: (typeof TaskCategoryDB)[number];
  schedule: string;
  enabled: boolean;
  priority: (typeof CronTaskPriorityDB)[number];
  timeout: number | null;
  taskInput: Record<string, JsonValue>;
  tags: string[];
  targetInstance: string | null;
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
    targetInstance: task.targetInstance,
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
            targetInstance: remoteTask.targetInstance,
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
          targetInstance: remoteTask.targetInstance,
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
  t: ModuleT;
}): Promise<ResponseType<{ tasks: SyncedCronTask[] }>> {
  const { logger, t } = params;

  try {
    const tasks = await db
      .select()
      .from(cronTasks)
      .where(sql`${cronTasks.userId} IS NOT NULL`)
      .limit(100);

    return success({
      tasks: tasks.map((task) => serializeForSync(task)),
    });
  } catch (error) {
    logger.error("Failed to get user-created tasks", parseError(error));
    return fail({
      message: t("errors.taskSyncListFailed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

/** In-memory cache for lead ID acquired during this process lifetime */
let cachedLeadId: string | null = null;

/**
 * Fetch a lead_id cookie from the remote instance by visiting a page.
 * The middleware on the remote sets a lead_id cookie on first visit via redirect.
 * Persists the acquired lead ID to .env for future restarts.
 */
async function acquireRemoteLeadId(
  remoteUrl: string,
  logger: EndpointLogger,
): Promise<string | null> {
  try {
    // Fetch the remote homepage — middleware will redirect with Set-Cookie
    const response = await fetch(remoteUrl, {
      method: "GET",
      redirect: "manual", // Don't follow redirect, we need the Set-Cookie header
      signal: AbortSignal.timeout(15000),
    });

    // Extract lead_id from Set-Cookie header
    const setCookieHeaders = response.headers.getSetCookie();
    for (const cookie of setCookieHeaders) {
      const match = cookie.match(/lead_id=([0-9a-f-]{36})/i);
      if (match?.[1]) {
        const leadId = match[1];
        logger.info("Acquired lead_id from remote instance", { leadId });

        // Persist to .env file for future restarts
        try {
          const { appendFile, readFile } = await import("node:fs/promises");
          const { join } = await import("node:path");
          const envPath = join(process.cwd(), ".env");
          const envContent = await readFile(envPath, "utf-8").catch(() => "");

          if (!envContent.includes("THEA_REMOTE_LEAD_ID")) {
            await appendFile(envPath, `\nTHEA_REMOTE_LEAD_ID="${leadId}"\n`);
            logger.info("Persisted THEA_REMOTE_LEAD_ID to .env");
          }
        } catch (fsError) {
          logger.warn("Could not persist lead_id to .env (non-fatal)", {
            error: fsError instanceof Error ? fsError.message : String(fsError),
          });
        }

        return leadId;
      }
    }

    logger.warn("No lead_id cookie in remote response", {
      status: response.status,
    });
    return null;
  } catch (error) {
    logger.error("Failed to acquire lead_id from remote", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Build headers for remote sync requests.
 * Auto-acquires lead_id from remote on first use if not configured.
 */
async function buildRemoteSyncHeaders(
  remoteUrl: string,
  logger: EndpointLogger,
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  let leadId = env.THEA_REMOTE_LEAD_ID ?? cachedLeadId;
  if (!leadId) {
    leadId = await acquireRemoteLeadId(remoteUrl, logger);
    if (leadId) {
      cachedLeadId = leadId;
    }
  }

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
  t: ModuleT,
): Promise<ResponseType<{ pulled: number }>> {
  const remoteUrl = env.THEA_REMOTE_URL;
  const apiKey = env.THEA_REMOTE_API_KEY;

  if (!remoteUrl || !apiKey) {
    return success({ pulled: 0 });
  }

  try {
    const syncUrl = `${remoteUrl}/api/en-GLOBAL/system/unified-interface/tasks/task-sync`;

    const response = await fetch(syncUrl, {
      method: "POST",
      headers: await buildRemoteSyncHeaders(remoteUrl, logger),
      body: JSON.stringify({ apiKey }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      logger.error("Pull from remote failed", {
        status: response.status,
        statusText: response.statusText,
        syncUrl,
      });
      return fail({
        message: t("errors.taskSyncSyncFailed"),
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
        message: t("errors.taskSyncSyncFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    let pulled = 0;
    if (result.data.tasksJson) {
      const remoteTasks = JSON.parse(result.data.tasksJson) as SyncedCronTask[];
      // Only pull tasks explicitly targeted at this instance
      // (null targetInstance = host only, not synced to remote instances)
      const instanceId = env.INSTANCE_ID;
      const relevantTasks = instanceId
        ? remoteTasks.filter((t) => t.targetInstance === instanceId)
        : remoteTasks;

      if (relevantTasks.length > 0) {
        logger.debug(
          `Task sync: ${relevantTasks.length}/${remoteTasks.length} tasks relevant for instance "${instanceId ?? "all"}"`,
        );
        const upsertResult = await upsertRemoteTasks({
          tasks: relevantTasks,
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
      message: t("errors.taskSyncSyncFailed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
