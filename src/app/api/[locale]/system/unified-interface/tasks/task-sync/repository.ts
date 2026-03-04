/**
 * Task Sync Repository
 * Handles remote sync of cron tasks between Thea instances (prod ↔ local).
 * Syncs cron task definitions so both instances stay in sync.
 */

import "server-only";

import { createHash } from "node:crypto";

import { eq, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import { z } from "zod";

import { memories } from "@/app/api/[locale]/agent/chat/memories/db";
import { db } from "@/app/api/[locale]/system/db";
import { generateSchemaForUsage } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { FieldUsage } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { getPreferredToolName } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type {
  JsonObject,
  RemoteToolCapability,
} from "@/app/api/[locale]/user/remote-connection/db";
import { touchLastSynced } from "@/app/api/[locale]/user/remote-connection/repository";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { env } from "@/config/env";
import { type CountryLanguage, defaultLocale } from "@/i18n/core/config";

import { definitionsRegistry } from "../../shared/endpoints/definitions/registry";
import type { CreateApiEndpointAny } from "../../shared/types/endpoint-base";
import type { NewCronTask } from "../cron/db";
import { cronTasks } from "../cron/db";
import {
  type CronTaskPriorityDB,
  CronTaskStatus,
  type TaskCategoryDB,
  type TaskOutputModeDB,
} from "../enum";
import { scopedTranslation } from "../i18n";
import type { JsonValue, NotificationTarget } from "../unified-runner/types";
import type { SyncRequestOutput, SyncResponseOutput } from "./definition";

/**
 * Build the remote API URL for an endpoint from its definition path.
 */
function buildRemoteEndpointUrl(
  remoteBaseUrl: string,
  endpoint: CreateApiEndpointAny,
): string {
  return `${remoteBaseUrl}/api/${defaultLocale}/${endpoint.path.join("/")}`;
}

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
 * Build a capability snapshot for a user — serializes all endpoints the user
 * can access as JSON Schema tool manifests. Sent to cloud on each pulse.
 * JSON.stringify naturally strips function refs (render, execute, etc.).
 */
export function buildCapabilitySnapshot(
  user: JwtPayloadType,
  instanceId: string,
  locale: CountryLanguage,
): { capabilities: RemoteToolCapability[]; hash: string } {
  const allEndpoints = definitionsRegistry.getEndpointsForUser(
    Platform.AI,
    user,
  );
  const capabilities: RemoteToolCapability[] = [];

  for (const endpoint of allEndpoints) {
    try {
      const { t } = endpoint.scopedTranslation.scopedT(locale);
      const toolName = getPreferredToolName(endpoint);
      const title = t(endpoint.title);
      const description = t(endpoint.description ?? endpoint.title);

      // Build input schema via same logic as tools-loader
      const requestDataSchema = generateSchemaForUsage(
        endpoint.fields,
        FieldUsage.RequestData,
      ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;

      const urlParamsSchema = generateSchemaForUsage(
        endpoint.fields,
        FieldUsage.RequestUrlParams,
      ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;

      const combinedShape: Record<string, z.ZodTypeAny> = {};
      if (requestDataSchema instanceof z.ZodObject) {
        Object.assign(combinedShape, requestDataSchema.shape);
      }
      if (urlParamsSchema instanceof z.ZodObject) {
        Object.assign(combinedShape, urlParamsSchema.shape);
      }

      const inputSchema = z.toJSONSchema(z.object(combinedShape), {
        target: "draft-7",
        io: "input",
        unrepresentable: "any",
      }) as JsonObject;

      // Serialize fields — JSON.stringify drops render/function refs automatically
      const fields = JSON.parse(
        JSON.stringify(endpoint.fields ?? {}),
      ) as JsonObject;

      capabilities.push({
        toolName,
        title,
        description,
        inputSchema,
        fields,
        executionMode: "via-execute-route",
        isAsync: true,
        instanceId,
      });
    } catch {
      // Skip endpoints that fail to serialize
    }
  }

  const hash = createHash("sha256")
    .update(JSON.stringify(capabilities))
    .digest("hex");

  return { capabilities, hash };
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
  locale: CountryLanguage;
}): Promise<ResponseType<{ tasks: SyncedCronTask[] }>> {
  const { logger, locale } = params;
  const { t } = scopedTranslation.scopedT(locale);

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

/**
 * Pull cron tasks and memories from all users' remote connections.
 * Iterates user_remote_connections — each user's remote is synced independently.
 * Cloud instances (VIBE_IS_CLOUD=true) skip outbound sync entirely.
 */
export async function pullFromRemote(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<{ pulled: number }>> {
  const { t } = scopedTranslation.scopedT(locale);

  // Cloud instances receive syncs, they don't initiate outbound ones
  if (env.VIBE_IS_CLOUD) {
    return success({ pulled: 0 });
  }

  try {
    const { getAllActiveConnectionsForSync } =
      await import("@/app/api/[locale]/user/remote-connection/repository");
    const activeConnections = await getAllActiveConnectionsForSync();

    if (activeConnections.length === 0) {
      return success({ pulled: 0 });
    }

    const { endpoints: syncEndpoints } = await import("./definition");
    const localInstanceId = env.INSTANCE_ID ?? "hermes";
    let totalPulled = 0;

    for (const conn of activeConnections) {
      try {
        const syncUrl = buildRemoteEndpointUrl(
          conn.remoteUrl,
          syncEndpoints.POST,
        );

        // Include local shared memories for bidirectional sync (scoped to this user)
        const memResult = await getSharedMemories({
          logger,
          userId: conn.userId,
        });
        const localMemories = memResult.success ? memResult.data.memories : [];

        // Build capability snapshot — only send if hash changed
        // Use CUSTOMER role for snapshot — conservative, reflects what a typical user can access
        const capSnapshot = buildCapabilitySnapshot(
          {
            id: conn.userId,
            leadId: conn.userId,
            isPublic: false as const,
            roles: [UserPermissionRole.CUSTOMER],
          },
          localInstanceId,
          locale,
        );
        const sendCapabilities = conn.capabilitiesHash !== capSnapshot.hash;

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${conn.token}`,
        };
        if (conn.leadId) {
          headers.Cookie = `lead_id=${conn.leadId}`;
        }

        const response = await fetch(syncUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            memoriesJson: JSON.stringify(localMemories),
            ...(sendCapabilities
              ? {
                  capabilitiesJson: JSON.stringify(capSnapshot.capabilities),
                  capabilitiesHash: capSnapshot.hash,
                }
              : {}),
          }),
          signal: AbortSignal.timeout(30000),
        });

        if (!response.ok) {
          logger.warn("Pull from remote failed for user", {
            userId: conn.userId,
            remoteUrl: conn.remoteUrl,
            status: response.status,
          });
          continue;
        }

        const result = (await response.json()) as {
          success: boolean;
          data?: {
            tasksJson?: string;
            sharedMemoriesJson?: string;
          };
        };

        if (!result.success || !result.data) {
          logger.warn("Pull from remote returned failure for user", {
            userId: conn.userId,
          });
          continue;
        }

        if (result.data.tasksJson) {
          const remoteTasks = JSON.parse(
            result.data.tasksJson,
          ) as SyncedCronTask[];
          const relevantTasks = remoteTasks.filter(
            (task) =>
              task.targetInstance !== null &&
              task.targetInstance === localInstanceId,
          );

          if (relevantTasks.length > 0) {
            const upsertResult = await upsertRemoteTasks({
              tasks: relevantTasks,
              logger,
            });
            totalPulled += upsertResult.success ? upsertResult.data.synced : 0;
          }
        }

        if (result.data.sharedMemoriesJson) {
          const remoteMemories = JSON.parse(
            result.data.sharedMemoriesJson,
          ) as SyncedMemory[];
          if (remoteMemories.length > 0) {
            await upsertSharedMemories({
              remoteMemories,
              localUserId: conn.userId,
              logger,
            });
          }
        }

        // Update lastSyncedAt (instanceId-scoped)
        await touchLastSynced(conn.userId, conn.instanceId);
      } catch (error) {
        logger.error("Pull from remote error for user", {
          userId: conn.userId,
          ...parseError(error),
        });
      }
    }

    if (totalPulled > 0) {
      logger.info(`Remote sync: pulled ${totalPulled} cron tasks`);
    }

    return success({ pulled: totalPulled });
  } catch (error) {
    logger.error("Pull from remote error", parseError(error));
    return fail({
      message: t("errors.taskSyncSyncFailed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

/**
 * Push a task status update to all active remote connections.
 * Fire-and-forget per user — logs errors but never fails the caller.
 * Cloud instances (VIBE_IS_CLOUD=true) skip outbound push.
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

  if (env.VIBE_IS_CLOUD) {
    return success({ pushed: false });
  }

  try {
    const { getAllActiveConnectionsForSync } =
      await import("@/app/api/[locale]/user/remote-connection/repository");
    const activeConnections = await getAllActiveConnectionsForSync();

    if (activeConnections.length === 0) {
      return success({ pushed: false });
    }

    const { endpoints: reportEndpoints } = await import("./report/definition");
    let anyPushed = false;

    for (const conn of activeConnections) {
      try {
        const reportUrl = buildRemoteEndpointUrl(
          conn.remoteUrl,
          reportEndpoints.POST,
        );
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${conn.token}`,
        };
        if (conn.leadId) {
          headers.Cookie = `lead_id=${conn.leadId}`;
        }

        const response = await fetch(reportUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({ ...payload }),
          signal: AbortSignal.timeout(15000),
        });

        if (response.ok) {
          anyPushed = true;
        } else {
          logger.warn("Push status to remote failed for user", {
            userId: conn.userId,
            status: response.status,
          });
        }
      } catch (error) {
        logger.error("Push status to remote error for user", {
          userId: conn.userId,
          ...parseError(error),
        });
      }
    }

    return success({ pushed: anyPushed });
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
 * When userId is provided, only returns that user's memories (per-user sync).
 */
export async function getSharedMemories(params: {
  logger: EndpointLogger;
  userId?: string;
}): Promise<ResponseType<{ memories: SyncedMemory[] }>> {
  const { logger, userId } = params;
  try {
    // Fetch: isShared=true (active) OR has syncId with isShared=false (tombstone)
    const userFilter = userId
      ? sql`${memories.userId} = ${userId} AND `
      : sql``;
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
        sql`${userFilter}(${memories.isShared} = true OR (${memories.metadata}->>'syncId' IS NOT NULL AND ${memories.isShared} = false))`,
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

/**
 * Orchestrates the full task sync: validates auth (JWT or API key),
 * processes incoming completions and memories, returns local tasks and shared memories.
 *
 * Auth modes:
 * - JWT (per-user): user is authenticated via JWT — memories scoped to that user
 * - API key (instance-to-instance): legacy admin sync, memories go to admin user
 */
export async function syncTasks(
  data: SyncRequestOutput,
  logger: EndpointLogger,
  locale: CountryLanguage,
  user: JwtPayloadType,
): Promise<ResponseType<SyncResponseOutput>> {
  const { t } = scopedTranslation.scopedT(locale);

  // Only authenticated users can sync
  const isUserAuth = !user.isPublic && user.id;

  if (!isUserAuth) {
    return {
      success: false as const,
      message: t("taskSync.post.errors.notFound.title"),
      errorType: ErrorResponseTypes.NOT_FOUND,
    };
  }

  // Process incoming tasks from remote — only accept tasks for this instance
  let completionsProcessed = 0;
  if (data.completionsJson) {
    try {
      const remoteTasks = JSON.parse(data.completionsJson) as SyncedCronTask[];
      const instanceId = env.INSTANCE_ID;
      const relevantTasks = remoteTasks.filter(
        (task) =>
          task.targetInstance !== null && task.targetInstance === instanceId,
      );
      const result = await upsertRemoteTasks({ tasks: relevantTasks, logger });
      if (result.success) {
        completionsProcessed = result.data.synced;
      }
    } catch (error) {
      logger.error("Failed to parse incoming tasks JSON", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Process incoming shared memories
  let memoriesSynced = 0;
  if (data.memoriesJson) {
    try {
      const remoteMemories = JSON.parse(data.memoriesJson) as SyncedMemory[];
      if (remoteMemories.length > 0) {
        const memResult = await upsertSharedMemories({
          remoteMemories,
          localUserId: user.id,
          logger,
        });
        memoriesSynced = memResult.success ? memResult.data.synced : 0;
      }
    } catch (error) {
      logger.error("Failed to parse incoming memories JSON", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Store incoming capability snapshot (diff via hash to avoid unnecessary writes)
  if (data.capabilitiesJson && data.capabilitiesHash) {
    try {
      const { getRemoteConnectionRecord } =
        await import("@/app/api/[locale]/user/remote-connection/repository");
      // Find the connection by token to get the instanceId
      // We can't know instanceId directly from JWT, but we can get it from the connection record
      // Use a DB lookup by userId to find all connections and match by token hash
      const capabilities = JSON.parse(
        data.capabilitiesJson,
      ) as RemoteToolCapability[];
      const instanceId =
        capabilities.length > 0
          ? (capabilities[0]?.instanceId ?? "hermes")
          : "hermes";

      const existing = await getRemoteConnectionRecord(user.id, instanceId);
      if (existing && existing.instanceId) {
        // Only update if hash changed
        const { db: localDb } = await import("@/app/api/[locale]/system/db");
        const { userRemoteConnections } =
          await import("@/app/api/[locale]/user/remote-connection/db");
        const [row] = await localDb
          .select({ capabilitiesHash: userRemoteConnections.capabilitiesHash })
          .from(userRemoteConnections)
          .where(eq(userRemoteConnections.userId, user.id))
          .limit(1);

        if (row?.capabilitiesHash !== data.capabilitiesHash) {
          await touchLastSynced(
            user.id,
            instanceId,
            capabilities,
            data.capabilitiesHash,
          );
        }
      }
    } catch (error) {
      logger.warn("Failed to store capabilities snapshot", parseError(error));
    }
  }

  // Return our user-created tasks and shared memories for the remote to sync
  const localResult = await getUserCreatedTasks({ logger, locale });
  const tasks = localResult.success ? localResult.data.tasks : [];
  const memResult = await getSharedMemories({
    logger,
    userId: user.id,
  });
  const sharedMemories = memResult.success ? memResult.data.memories : [];

  return success({
    tasksJson: JSON.stringify(tasks),
    synced: tasks.length,
    completionsProcessed,
    memoriesSynced,
    sharedMemoriesJson: JSON.stringify(sharedMemories),
  });
}
