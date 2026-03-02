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

import { memories } from "@/app/api/[locale]/agent/chat/memories/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";

import type { CreateApiEndpointAny } from "../../shared/types/endpoint-base";
import type { NewCronTask } from "../cron/db";
import { cronTasks } from "../cron/db";
import {
  type CronTaskPriorityDB,
  CronTaskStatus,
  type TaskCategoryDB,
  type TaskOutputModeDB,
} from "../enum";
import type { scopedTranslation } from "../i18n";
import type { JsonValue, NotificationTarget } from "../unified-runner/types";

/**
 * Build the remote API URL for an endpoint from its definition path.
 */
function buildRemoteEndpointUrl(
  remoteBaseUrl: string,
  endpoint: CreateApiEndpointAny,
): string {
  return `${remoteBaseUrl}/api/${defaultLocale}/${endpoint.path.join("/")}`;
}

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
  version: string;
  category: (typeof TaskCategoryDB)[number];
  schedule: string;
  timezone: string | null;
  enabled: boolean;
  priority: (typeof CronTaskPriorityDB)[number];
  timeout: number | null;
  retries: number | null;
  retryDelay: number | null;
  taskInput: Record<string, JsonValue>;
  runOnce: boolean;
  outputMode: (typeof TaskOutputModeDB)[number];
  notificationTargets: NotificationTarget[];
  tags: string[];
  targetInstance: string | null;
}

function serializeForSync(task: CronTaskSelect): SyncedCronTask {
  return {
    id: task.id,
    routeId: task.routeId,
    displayName: task.displayName,
    description: task.description,
    version: task.version,
    category: task.category,
    schedule: task.schedule,
    timezone: task.timezone,
    enabled: task.enabled,
    priority: task.priority,
    timeout: task.timeout,
    retries: task.retries,
    retryDelay: task.retryDelay,
    taskInput: task.taskInput,
    runOnce: task.runOnce,
    outputMode: task.outputMode,
    notificationTargets: task.notificationTargets as NotificationTarget[],
    tags: task.tags as string[],
    targetInstance: task.targetInstance,
  };
}

/**
 * Upsert cron tasks from a remote instance.
 * Match by id — every task has a unique, stable string identity.
 * routeId is NOT used for identity — multiple tasks can call the same endpoint.
 */
export async function upsertRemoteTasks(params: {
  tasks: SyncedCronTask[];
  logger: EndpointLogger;
}): Promise<ResponseType<{ synced: number }>> {
  const { tasks, logger } = params;
  let synced = 0;

  for (const remoteTask of tasks) {
    try {
      // Match by id — stable, human-readable task identity
      const [existing] = await db
        .select({
          id: cronTasks.id,
          lastExecutionStatus: cronTasks.lastExecutionStatus,
        })
        .from(cronTasks)
        .where(eq(cronTasks.id, remoteTask.id))
        .limit(1);

      // Build update payload from fields actually present in the remote payload.
      // Old remotes may not send newer fields — skip undefined to avoid
      // overwriting local values with null/defaults.
      const definitionFields: Partial<NewCronTask> & { updatedAt: Date } = {
        displayName: remoteTask.displayName,
        description: remoteTask.description,
        category: remoteTask.category,
        schedule: remoteTask.schedule,
        priority: remoteTask.priority,
        taskInput: remoteTask.taskInput,
        tags: remoteTask.tags,
        targetInstance: remoteTask.targetInstance,
        updatedAt: new Date(),
      };
      // Only include fields the remote explicitly sent
      if (remoteTask.version !== undefined) {
        definitionFields.version = remoteTask.version;
      }
      if (remoteTask.timezone !== undefined) {
        definitionFields.timezone = remoteTask.timezone;
      }
      if (remoteTask.timeout !== undefined) {
        definitionFields.timeout = remoteTask.timeout;
      }
      if (remoteTask.retries !== undefined) {
        definitionFields.retries = remoteTask.retries;
      }
      if (remoteTask.retryDelay !== undefined) {
        definitionFields.retryDelay = remoteTask.retryDelay;
      }
      if (remoteTask.runOnce !== undefined) {
        definitionFields.runOnce = remoteTask.runOnce;
      }
      if (remoteTask.outputMode !== undefined) {
        definitionFields.outputMode = remoteTask.outputMode;
      }
      if (remoteTask.notificationTargets !== undefined) {
        definitionFields.notificationTargets =
          remoteTask.notificationTargets as NotificationTarget[];
      }

      if (existing) {
        // Skip update if task is currently RUNNING — avoid overwriting mid-execution
        if (existing.lastExecutionStatus === CronTaskStatus.RUNNING) {
          logger.debug("Skipping sync for RUNNING task", {
            id: remoteTask.id,
            routeId: remoteTask.routeId,
          });
          continue;
        }

        // Update definition fields only — never overwrite local execution state
        // (enabled, lastExecutionStatus, counts, etc. are managed by the local pulse runner)
        await db
          .update(cronTasks)
          .set(definitionFields)
          .where(eq(cronTasks.id, existing.id));
        synced++;
      } else {
        // New task — use remote's id directly
        await db.insert(cronTasks).values({
          id: remoteTask.id,
          routeId: remoteTask.routeId,
          displayName: definitionFields.displayName ?? remoteTask.routeId,
          category: definitionFields.category ?? remoteTask.category,
          schedule: definitionFields.schedule ?? remoteTask.schedule,
          priority: definitionFields.priority ?? remoteTask.priority,
          enabled: remoteTask.enabled,
          ...definitionFields,
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
    // Only sync tasks that have an explicit targetInstance.
    // null targetInstance = host-only, never shared with remote instances.
    const tasks = await db
      .select()
      .from(cronTasks)
      .where(
        sql`${cronTasks.userId} IS NOT NULL AND ${cronTasks.targetInstance} IS NOT NULL`,
      )
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
    const { endpoints: syncEndpoints } = await import("./definition");
    const syncUrl = buildRemoteEndpointUrl(remoteUrl, syncEndpoints.POST);

    // Include local shared memories for bidirectional sync
    const memResult = await getSharedMemories({ logger });
    const localMemories = memResult.success ? memResult.data.memories : [];

    const response = await fetch(syncUrl, {
      method: "POST",
      headers: await buildRemoteSyncHeaders(remoteUrl, logger),
      body: JSON.stringify({
        apiKey,
        memoriesJson: JSON.stringify(localMemories),
      }),
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
        sharedMemoriesJson?: string;
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
      // Only pull tasks explicitly targeted at this instance.
      // null targetInstance = host-only, never synced.
      const instanceId = env.INSTANCE_ID;
      const relevantTasks = remoteTasks.filter(
        (t) => t.targetInstance !== null && t.targetInstance === instanceId,
      );

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

    // Pull shared memories from remote
    if (result.data.sharedMemoriesJson) {
      try {
        const remoteMemories = JSON.parse(
          result.data.sharedMemoriesJson,
        ) as SyncedMemory[];
        if (remoteMemories.length > 0) {
          // Find admin user to attach memories to
          const { users, userRoles } =
            await import("@/app/api/[locale]/user/db");
          const { UserPermissionRole } =
            await import("@/app/api/[locale]/user/user-roles/enum");
          const [adminUser] = await db
            .select({ id: users.id })
            .from(users)
            .innerJoin(userRoles, eq(userRoles.userId, users.id))
            .where(eq(userRoles.role, UserPermissionRole.ADMIN))
            .limit(1);

          if (adminUser) {
            await upsertSharedMemories({
              remoteMemories,
              localUserId: adminUser.id,
              logger,
            });
          }
        }
      } catch (error) {
        logger.error("Failed to process remote shared memories", {
          error: error instanceof Error ? error.message : String(error),
        });
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

/**
 * Push a task status update to the remote Thea instance.
 * Supports RUNNING (in-progress visibility) and terminal statuses (with execution records).
 * Fire-and-forget — logs errors but never fails the caller.
 */
export async function pushStatusToRemote(params: {
  taskRouteId: string;
  status: string;
  summary: string;
  durationMs: number | null;
  executionId?: string;
  output?: Record<string, string | number | boolean>;
  startedAt?: string;
  serverTimezone: string;
  executedByInstance: string | null;
  logger: EndpointLogger;
}): Promise<ResponseType<{ pushed: boolean }>> {
  const { logger, ...payload } = params;
  const remoteUrl = env.THEA_REMOTE_URL;
  const apiKey = env.THEA_REMOTE_API_KEY;

  if (!remoteUrl || !apiKey) {
    logger.debug("No remote configured, skipping status push");
    return success({ pushed: false });
  }

  try {
    const { endpoints: reportEndpoints } = await import("./report/definition");
    const reportUrl = buildRemoteEndpointUrl(remoteUrl, reportEndpoints.POST);

    const response = await fetch(reportUrl, {
      method: "POST",
      headers: await buildRemoteSyncHeaders(remoteUrl, logger),
      body: JSON.stringify({ apiKey, ...payload }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      logger.error("Push status to remote failed", {
        status: response.status,
        statusText: response.statusText,
        taskRouteId: payload.taskRouteId,
      });
      return success({ pushed: false });
    }

    logger.info("Status pushed to remote", {
      taskRouteId: payload.taskRouteId,
      status: payload.status,
    });
    return success({ pushed: true });
  } catch (error) {
    logger.error("Push status to remote error", parseError(error));
    return success({ pushed: false });
  }
}

// ─── Memory Sync ─────────────────────────────────────────────────────────────

/**
 * Serialized shared memory for cross-instance sync.
 * Uses syncId (UUID in metadata jsonb) for stable cross-instance identity.
 */
export interface SyncedMemory {
  /** Stable UUID identity stored in metadata.syncId */
  syncId: string;
  content: string;
  tags: string[];
  priority: number;
  updatedAt: string;
  /** false = tombstone (memory was unshared/deleted, propagate removal) */
  isShared: boolean;
}

/**
 * Get shared memories for sync.
 * Includes active shared memories AND tombstones (recently unshared memories
 * that still have a syncId — so the remote knows to remove them).
 */
export async function getSharedMemories(params: {
  logger: EndpointLogger;
}): Promise<ResponseType<{ memories: SyncedMemory[] }>> {
  const { logger } = params;
  try {
    // Fetch: isShared=true (active) OR has syncId with isShared=false (tombstone)
    const rows = await db
      .select({
        id: memories.id,
        content: memories.content,
        tags: memories.tags,
        priority: memories.priority,
        updatedAt: memories.updatedAt,
        isShared: memories.isShared,
        metadata: memories.metadata,
      })
      .from(memories)
      .where(
        sql`${memories.isShared} = true OR (${memories.metadata}->>'syncId' IS NOT NULL AND ${memories.isShared} = false)`,
      )
      .limit(200);

    const result: SyncedMemory[] = [];

    for (const r of rows) {
      const meta = r.metadata;
      let syncId = meta?.syncId ?? null;

      // Backfill: assign syncId to shared memories that don't have one yet
      if (!syncId && r.isShared) {
        syncId = crypto.randomUUID();
        await db
          .update(memories)
          .set({
            metadata: sql`COALESCE(${memories.metadata}, '{}'::jsonb) || ${JSON.stringify({ syncId })}::jsonb`,
          })
          .where(eq(memories.id, r.id));
      }

      if (syncId) {
        result.push({
          syncId,
          content: r.content,
          tags: r.tags as string[],
          priority: r.priority,
          updatedAt: r.updatedAt.toISOString(),
          isShared: r.isShared,
        });
      }
    }

    return success({ memories: result });
  } catch (error) {
    logger.error("Failed to get shared memories", parseError(error));
    return success({ memories: [] });
  }
}

/**
 * Upsert shared memories from a remote instance.
 * Uses syncId-based matching with last-writer-wins conflict resolution.
 * Supports tombstones (isShared=false) for delete/unshare propagation.
 */
export async function upsertSharedMemories(params: {
  remoteMemories: SyncedMemory[];
  localUserId: string;
  logger: EndpointLogger;
}): Promise<ResponseType<{ synced: number }>> {
  const { remoteMemories, localUserId, logger } = params;
  let synced = 0;

  for (const remoteMem of remoteMemories) {
    try {
      // 1. Match by syncId in metadata jsonb
      const [existingBySyncId] = await db
        .select({
          id: memories.id,
          updatedAt: memories.updatedAt,
          isShared: memories.isShared,
        })
        .from(memories)
        .where(
          sql`${memories.userId} = ${localUserId} AND ${memories.metadata}->>'syncId' = ${remoteMem.syncId}`,
        )
        .limit(1);

      if (existingBySyncId) {
        // Tombstone: remote unshared this memory → archive locally
        if (!remoteMem.isShared) {
          await db
            .update(memories)
            .set({
              isShared: false,
              isArchived: true,
              updatedAt: new Date(),
            })
            .where(eq(memories.id, existingBySyncId.id));
          synced++;
          continue;
        }

        // Last-writer-wins: only update if remote is newer
        const remoteUpdatedAt = new Date(remoteMem.updatedAt);
        if (remoteUpdatedAt > existingBySyncId.updatedAt) {
          await db
            .update(memories)
            .set({
              content: remoteMem.content,
              tags: remoteMem.tags,
              priority: remoteMem.priority,
              isShared: true,
              updatedAt: remoteUpdatedAt,
            })
            .where(eq(memories.id, existingBySyncId.id));
          synced++;
        }
        continue;
      }

      // Tombstone for unknown memory — nothing to do
      if (!remoteMem.isShared) {
        continue;
      }

      // 2. Legacy fallback: match by exact content (for pre-syncId memories)
      const [existingByContent] = await db
        .select({
          id: memories.id,
          metadata: memories.metadata,
        })
        .from(memories)
        .where(
          sql`${memories.userId} = ${localUserId} AND ${memories.content} = ${remoteMem.content}`,
        )
        .limit(1);

      if (existingByContent) {
        // Backfill syncId on the existing memory so future syncs use syncId matching
        await db
          .update(memories)
          .set({
            metadata: sql`COALESCE(${memories.metadata}, '{}'::jsonb) || ${JSON.stringify({ syncId: remoteMem.syncId })}::jsonb`,
            isShared: true,
            updatedAt: new Date(),
          })
          .where(eq(memories.id, existingByContent.id));
        synced++;
        continue;
      }

      // 3. New memory — insert with syncId
      const [maxSeq] = await db
        .select({
          max: sql<number>`COALESCE(MAX(${memories.memoryNumber}), -1)`,
        })
        .from(memories)
        .where(eq(memories.userId, localUserId));

      const nextSeq = (maxSeq?.max ?? -1) + 1;

      await db.insert(memories).values({
        userId: localUserId,
        content: remoteMem.content,
        tags: remoteMem.tags,
        priority: remoteMem.priority,
        memoryNumber: nextSeq,
        isShared: true,
        isPublic: false,
        isArchived: false,
        metadata: { source: "remote-sync", syncId: remoteMem.syncId },
      });
      synced++;
    } catch (error) {
      logger.error("Failed to upsert shared memory", {
        syncId: remoteMem.syncId,
        ...parseError(error),
      });
    }
  }

  if (synced > 0) {
    logger.info(`Memory sync: imported/updated ${synced} shared memories`);
  }
  return success({ synced });
}
