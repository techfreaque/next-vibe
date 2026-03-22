/**
 * Task Sync Repository
 * Handles remote sync of cron tasks between Thea instances (prod ↔ local).
 * Syncs cron task definitions so both instances stay in sync.
 */

import "server-only";

import { nanoid } from "nanoid";

import { and, eq, sql } from "drizzle-orm";
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
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { RemoteToolCapability } from "@/app/api/[locale]/user/remote-connection/db";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { env } from "@/config/env";
import { type CountryLanguage, defaultLocale } from "@/i18n/core/config";

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
import type { TaskSyncPullPostResponseOutput } from "./pull/definition";

/**
 * Serialized cron task for sync payloads
 */
interface SyncedCronTask {
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

/**
 * Serialized shared memory for cross-instance sync.
 * Uses syncId (UUID in metadata jsonb) for stable cross-instance identity.
 */
interface SyncedMemory {
  /** Stable UUID identity stored in metadata.syncId */
  syncId: string;
  content: string;
  tags: string[];
  priority: number;
  updatedAt: string;
  /** false = tombstone (memory was unshared/deleted, propagate removal) */
  isShared: boolean;
}

interface UpsertRemoteTasksResult {
  synced: number;
}
interface GetUserCreatedTasksResult {
  tasks: SyncedCronTask[];
}
interface PushStatusToRemoteResult {
  pushed: boolean;
}
interface UpsertSharedMemoriesResult {
  synced: number;
}

export class TaskSyncRepository {
  /**
   * Parse a sync field that may arrive as a JSON string OR as a pre-parsed array
   * (Next.js request parser auto-deserialises JSON-looking string values).
   */
  private static parseSyncField<T>(value: string | T[] | JsonValue): T[] {
    if (Array.isArray(value)) {
      return value as T[];
    }
    if (typeof value === "string") {
      return JSON.parse(value) as T[];
    }
    return [];
  }

  /**
   * Build the remote API URL for an endpoint from its definition path.
   */
  private static buildRemoteEndpointUrl(
    remoteBaseUrl: string,
    endpoint: CreateApiEndpointAny,
  ): string {
    return `${remoteBaseUrl}/api/${defaultLocale}/${endpoint.path.join("/")}`;
  }

  private static serializeForSync(
    task: typeof cronTasks.$inferSelect,
  ): SyncedCronTask {
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
  static async upsertRemoteTasks(params: {
    tasks: SyncedCronTask[];
    logger: EndpointLogger;
  }): Promise<ResponseType<UpsertRemoteTasksResult>> {
    const { tasks, logger } = params;
    let synced = 0;

    // Build the set of locally-known route IDs to validate incoming tasks against.
    // A remote instance must not inject tasks targeting routes that don't exist here,
    // because those tasks would execute as the ADMIN system user.
    const { getFullPath } =
      await import("@/app/api/[locale]/system/unified-interface/shared/utils/path");

    for (const remoteTask of tasks) {
      try {
        // Reject tasks whose routeId is not a known local endpoint.
        // Prevents a compromised remote from injecting arbitrary route executions.
        const resolvedPath = getFullPath(remoteTask.routeId);
        if (resolvedPath === null) {
          logger.warn(
            "Rejecting remote task — routeId not recognised locally",
            {
              id: remoteTask.id,
              routeId: remoteTask.routeId,
            },
          );
          continue;
        }

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
        const definitionFields: Partial<
          NewCronTask<Record<string, JsonValue>>
        > & { updatedAt: Date } = {
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
          // New task — use remote's id directly.
          // Cross-instance delegated tasks (targetInstance set) are always treated as
          // run-once: the remote re-creates them if it wants another execution.
          // This prevents a task created with runOnce:false from looping indefinitely
          // on the local instance.
          const effectiveRunOnce =
            remoteTask.targetInstance !== null
              ? true
              : (definitionFields.runOnce ?? remoteTask.runOnce);
          await db.insert(cronTasks).values({
            id: remoteTask.id,
            shortId: nanoid(8),
            routeId: remoteTask.routeId,
            displayName: definitionFields.displayName ?? remoteTask.routeId,
            category: definitionFields.category ?? remoteTask.category,
            schedule: definitionFields.schedule ?? remoteTask.schedule,
            priority: definitionFields.priority ?? remoteTask.priority,
            enabled: remoteTask.enabled,
            ...definitionFields,
            runOnce: effectiveRunOnce,
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
  static async getUserCreatedTasks(params: {
    logger: EndpointLogger;
    locale: CountryLanguage;
  }): Promise<ResponseType<GetUserCreatedTasksResult>> {
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
        tasks: tasks.map((task) => TaskSyncRepository.serializeForSync(task)),
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
   * Pull from all users' remote connections using hash-first protocol.
   * Local sends hashes → remote diffs → returns only changed payloads.
   * Cloud instances (NEXT_PUBLIC_VIBE_IS_CLOUD=true) skip outbound sync entirely.
   */
  static async pullFromRemote(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<TaskSyncPullPostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    if (env.NEXT_PUBLIC_VIBE_IS_CLOUD) {
      return success({ pulled: 0 });
    }

    try {
      const { RemoteConnectionRepository } =
        await import("@/app/api/[locale]/user/remote-connection/repository");

      const activeConnections =
        await RemoteConnectionRepository.getAllActiveConnectionsForSync();
      if (activeConnections.length === 0) {
        return success({ pulled: 0 });
      }

      const { endpoints: syncEndpoints } = await import("./definition");
      const localInstanceId =
        RemoteConnectionRepository.deriveDefaultSelfInstanceId();

      // Get local capabilities version (build-time constant)
      const { CAPABILITIES_VERSION } =
        await import("@/app/api/[locale]/system/generated/remote-capabilities/version").catch(
          () => ({
            CAPABILITIES_VERSION: "unknown",
          }),
        );

      let totalPulled = 0;

      for (const conn of activeConnections) {
        try {
          const syncUrl = TaskSyncRepository.buildRemoteEndpointUrl(
            conn.remoteUrl,
            syncEndpoints.POST,
          );

          // Compute local memories hash (also stores it on the connection row)
          const localMemoriesHash =
            await RemoteConnectionRepository.computeAndStoreMemoriesHash(
              conn.userId,
            );

          // Only send capabilities when version changed since last sync
          const sendCapabilities =
            conn.capabilitiesVersion !== CAPABILITIES_VERSION;

          let capabilitiesJson: string | undefined;
          if (sendCapabilities) {
            // Load the capability file matching the remote user's role.
            // Fetch the user's roles from DB to pick the right file.
            const { userRoles: userRolesTable } =
              await import("@/app/api/[locale]/user/db");
            const userRoleRows = await db
              .select({ role: userRolesTable.role })
              .from(userRolesTable)
              .where(eq(userRolesTable.userId, conn.userId));
            const roles = userRoleRows.map((r) => r.role);
            const roleSlug = roles.includes(UserPermissionRole.ADMIN)
              ? "admin"
              : roles.includes(UserPermissionRole.CUSTOMER)
                ? "customer"
                : "public";

            const capFileImport =
              roleSlug === "admin"
                ? await import("@/app/api/[locale]/system/generated/remote-capabilities/en/admin").catch(
                    () => null,
                  )
                : roleSlug === "customer"
                  ? await import("@/app/api/[locale]/system/generated/remote-capabilities/en/customer").catch(
                      () => null,
                    )
                  : await import("@/app/api/[locale]/system/generated/remote-capabilities/en/public").catch(
                      () => null,
                    );
            if (capFileImport) {
              // Tag each capability with the local instanceId
              const tagged = (
                (
                  capFileImport as {
                    remoteCapabilities?: RemoteToolCapability[];
                  }
                ).remoteCapabilities ?? []
              ).map((c: RemoteToolCapability) => ({
                ...c,
                instanceId: localInstanceId,
              }));
              capabilitiesJson = JSON.stringify(tagged);
            }
          }

          // Task cursor: stored ISO timestamp of last successful task pull.
          // null = first sync ever → use epoch to get all pending tasks.
          // Set → use stored value to get only tasks created after last pull.
          const taskCursor = conn.taskCursor ?? new Date(0).toISOString();

          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${conn.token}`,
          };
          if (conn.leadId) {
            headers.Cookie = `lead_id=${conn.leadId}`;
          }

          // Send our LOCAL capabilities version so cloud can diff and store the snapshot.
          // conn.capabilitiesVersion on the dev side = last LOCAL version we successfully
          // sent to cloud. On first sync it is null → send "none" (a non-empty sentinel)
          // so cloud's condition `if (data.capabilitiesJson)` fires and stores the caps.
          const body: Record<string, string> = {
            // Tell the remote who we are — our own selfInstanceId
            instanceId: conn.remoteInstanceId ?? localInstanceId,
            memoriesHash: localMemoriesHash,
            capabilitiesVersion: conn.capabilitiesVersion ?? "none",
            taskCursor,
          };
          if (capabilitiesJson !== undefined) {
            body.capabilitiesJson = capabilitiesJson;
          }

          // Collect tasks this instance created that target the remote.
          // conn.instanceId = local label for the remote = remote's name in our tasks.
          {
            const outbound = await db
              .select()
              .from(cronTasks)
              .where(
                sql`${cronTasks.userId} = ${conn.userId} AND ${cronTasks.targetInstance} = ${conn.instanceId} AND ${cronTasks.lastExecutionStatus} IS NULL`,
              )
              .limit(50);
            if (outbound.length > 0) {
              body.outboundTasks = JSON.stringify(
                outbound.map((task) =>
                  TaskSyncRepository.serializeForSync(task),
                ),
              );
            }
          }

          const response = await fetch(syncUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(30000),
          });

          if (!response.ok) {
            // 401 — token expired. Mark connection inactive; user must reconnect.
            if (response.status === 401) {
              logger.warn(
                "Pull from remote: 401 — marking connection inactive",
                {
                  userId: conn.userId,
                  instanceId: conn.instanceId,
                },
              );
              const { RemoteConnectionRepository: RemoteRepo1 } =
                await import("@/app/api/[locale]/user/remote-connection/repository");
              await RemoteRepo1.touchLastSynced(conn.userId, conn.instanceId, {
                isActive: false,
              });
            } else {
              logger.warn("Pull from remote failed", {
                userId: conn.userId,
                status: response.status,
              });
            }
            continue;
          }

          const result = (await response.json()) as {
            success: boolean;
            data?: {
              remoteMemoriesHash?: string;
              memories?: string | null;
              remoteCapabilitiesVersion?: string;
              capabilities?: string | null;
              tasks?: string;
              memoriesSynced?: number;
              serverTime: string;
            };
          };

          if (!result.success || !result.data) {
            logger.warn("Pull from remote returned failure", {
              userId: conn.userId,
            });
            continue;
          }

          const { data } = result;

          // Apply memory diff if remote returned memories (hashes differed)
          if (data.memories) {
            const remoteMemories = JSON.parse(data.memories) as SyncedMemory[];
            if (remoteMemories.length > 0) {
              await TaskSyncRepository.upsertSharedMemories({
                remoteMemories,
                localUserId: conn.userId,
                logger,
              });
            }
          }

          // Apply capability diff if remote returned capabilities (versions differed)
          const { RemoteConnectionRepository: RemoteRepo2 } =
            await import("@/app/api/[locale]/user/remote-connection/repository");

          // Use remote DB server time as next cursor — avoids JS process / Docker
          // container timezone skew where local new Date() is ahead of remote DB clock.
          const newTaskCursor = data.serverTime;

          if (data.capabilities) {
            const caps = JSON.parse(
              data.capabilities,
            ) as RemoteToolCapability[];
            await RemoteRepo2.touchLastSynced(conn.userId, conn.instanceId, {
              // Store cloud's remote capabilities locally for AI tool discovery
              capabilities: caps,
              remoteMemoriesHash: data.remoteMemoriesHash,
              taskCursor: newTaskCursor,
              // capabilitiesVersion on local side = last LOCAL version we sent to cloud.
              // After a successful send, record our LOCAL version so next pulse detects
              // changes (new local deploy → re-send). Don't store cloud's version here.
              ...(sendCapabilities
                ? { capabilitiesVersion: CAPABILITIES_VERSION }
                : {}),
            });
          } else {
            // Even if no capability diff, always store remote's memoriesHash + cursor
            await RemoteRepo2.touchLastSynced(conn.userId, conn.instanceId, {
              remoteMemoriesHash: data.remoteMemoriesHash,
              taskCursor: newTaskCursor,
              // If we sent caps, mark local version as sent regardless of cloud response
              ...(sendCapabilities
                ? { capabilitiesVersion: CAPABILITIES_VERSION }
                : {}),
            });
          }

          // Apply remote tasks (REMOTE_TOOL_CALL tasks for this local instance)
          if (data.tasks) {
            const remoteTasks = JSON.parse(data.tasks) as SyncedCronTask[];
            const relevant = remoteTasks.filter(
              (task) => task.targetInstance === localInstanceId,
            );
            if (relevant.length > 0) {
              const upsertResult = await TaskSyncRepository.upsertRemoteTasks({
                tasks: relevant,
                logger,
              });
              totalPulled += upsertResult.success
                ? upsertResult.data.synced
                : 0;
            }
          }

          // Re-check direct accessibility on each sync cycle.
          // If previously accessible but now unreachable (or vice versa), update the flag.
          // This is cloud-side: conn.localUrl is the local instance's reachable URL.
          if (conn.localUrl) {
            const { RemoteConnectionRegisterRepository: RegisterRepo } =
              await import("@/app/api/[locale]/user/remote-connection/register/repository");
            const { remoteConnections: connTable } =
              await import("@/app/api/[locale]/user/remote-connection/db");
            const nowAccessible = await RegisterRepo.checkDirectAccessibility(
              conn.localUrl,
              logger,
              locale,
            );
            if (nowAccessible !== conn.isDirectlyAccessible) {
              await db
                .update(connTable)
                .set({
                  isDirectlyAccessible: nowAccessible,
                  updatedAt: new Date(),
                })
                .where(eq(connTable.userId, conn.userId));
              logger.info(
                "[TaskSync] Updated isDirectlyAccessible for connection",
                {
                  instanceId: conn.instanceId,
                  isDirectlyAccessible: nowAccessible,
                },
              );
            }
          }
        } catch (error) {
          logger.error("Pull from remote error for connection", {
            userId: conn.userId,
            instanceId: conn.instanceId,
            ...parseError(error),
          });
        }
      }

      if (totalPulled > 0) {
        logger.info(`Remote sync: pulled ${totalPulled} tasks`);
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
   * Cloud instances (NEXT_PUBLIC_VIBE_IS_CLOUD=true) skip outbound push.
   */
  static async pushStatusToRemote(params: {
    /** The task's unique id (e.g. "remote-hermes-dev-...") — used by /report to look up the exact task */
    taskId: string;
    status: string;
    summary: string;
    durationMs: number | null;
    executionId?: string;
    output?: Record<string, JsonValue>;
    startedAt?: string;
    serverTimezone: string;
    executedByInstance: string | null;
    logger: EndpointLogger;
  }): Promise<ResponseType<PushStatusToRemoteResult>> {
    const { logger, ...payload } = params;

    if (env.NEXT_PUBLIC_VIBE_IS_CLOUD) {
      return success({ pushed: false });
    }

    try {
      const { RemoteConnectionRepository: RemoteRepoSync } =
        await import("@/app/api/[locale]/user/remote-connection/repository");
      const activeConnections =
        await RemoteRepoSync.getAllActiveConnectionsForSync();

      if (activeConnections.length === 0) {
        return success({ pushed: false });
      }

      const { endpoints: reportEndpoints } =
        await import("./report/definition");
      let anyPushed = false;

      for (const conn of activeConnections) {
        try {
          const reportUrl = TaskSyncRepository.buildRemoteEndpointUrl(
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

  /**
   * Get shared memories for sync.
   * Includes active shared memories AND tombstones (recently unshared memories
   * that still have a syncId — so the remote knows to remove them).
   * When userId is provided, only returns that user's memories (per-user sync).
   */
  static async getSharedMemories(params: {
    logger: EndpointLogger;
    userId?: string;
  }) {
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
  static async upsertSharedMemories(params: {
    remoteMemories: SyncedMemory[];
    localUserId: string;
    logger: EndpointLogger;
  }): Promise<ResponseType<UpsertSharedMemoriesResult>> {
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
   * Hash-first sync handler — cloud side.
   *
   * Protocol:
   * 1. Local sends: memoriesHash, capabilitiesVersion, capabilitiesJson (if changed), taskCursor
   * 2. Cloud diffs hashes against stored values
   * 3. Cloud returns: memoriesHash, memories (if diff), capabilitiesVersion, capabilities (if diff), tasks (since cursor)
   *
   * All payloads are null when hashes match — one tiny request per tick in steady state.
   */
  static async syncTasks(
    data: SyncRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
    user: JwtPayloadType,
  ): Promise<ResponseType<SyncResponseOutput>> {
    const { t: syncT } = scopedTranslation.scopedT(locale);

    if (user.isPublic || !user.id) {
      return fail({
        message: syncT("taskSync.post.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const { RemoteConnectionRepository: RemoteRepoReport } =
      await import("@/app/api/[locale]/user/remote-connection/repository");
    const { remoteConnections: connTable } =
      await import("@/app/api/[locale]/user/remote-connection/db");

    // Find the connection record for this user (the local that is calling us).
    // Local sends its instanceId in the request body — use it to find the right record.
    // Fall back to first active record if not provided (backward compat).
    const conditions = [
      eq(connTable.userId, user.id),
      eq(connTable.isActive, true),
    ];
    if (data.instanceId) {
      conditions.push(eq(connTable.instanceId, data.instanceId));
    }
    const [connRow] = await db
      .select()
      .from(connTable)
      .where(and(...conditions))
      .limit(1);

    const instanceId = connRow?.instanceId ?? data.instanceId ?? "unknown";

    // ── 1. Process incoming capability snapshot (only if version changed) ──────
    let memoriesSynced = 0;
    if (data.capabilitiesJson) {
      try {
        const capabilities =
          TaskSyncRepository.parseSyncField<RemoteToolCapability>(
            data.capabilitiesJson,
          );
        const storedVersion = connRow?.capabilitiesVersion;
        if (storedVersion !== data.capabilitiesVersion) {
          await RemoteRepoReport.touchLastSynced(user.id, instanceId, {
            capabilities,
            capabilitiesVersion: data.capabilitiesVersion,
          });
          logger.debug("Stored updated capability snapshot", {
            instanceId,
            version: data.capabilitiesVersion,
            count: capabilities.length,
          });
        }
      } catch (error) {
        logger.warn("Failed to store capabilities snapshot", parseError(error));
      }
    }

    // ── 1b. Upsert inbound tasks from local instance (outbound push) ──────────
    // Dev sends tasks targeting our instanceId — upsert them so our pulse picks them up.
    if (data.outboundTasks) {
      try {
        const inboundTasks = TaskSyncRepository.parseSyncField<SyncedCronTask>(
          data.outboundTasks,
        );
        if (inboundTasks.length > 0) {
          const upsertResult = await TaskSyncRepository.upsertRemoteTasks({
            tasks: inboundTasks,
            logger,
          });
          if (upsertResult.success) {
            logger.info("Stored inbound outbound tasks from local", {
              instanceId,
              count: upsertResult.data.synced,
            });
          }
        }
      } catch (error) {
        logger.warn("Failed to process outboundTasks", parseError(error));
      }
    }

    // ── 2. Compute our own memories hash and diff against local's ─────────────
    const ourMemoriesHash = await RemoteRepoReport.computeAndStoreMemoriesHash(
      user.id,
    );
    const localMemoriesHash = data.memoriesHash;
    const memoryHashDiffers = localMemoriesHash !== ourMemoriesHash;

    // Store remote's hash for future diffs
    if (localMemoriesHash) {
      await RemoteRepoReport.touchLastSynced(user.id, instanceId, {
        remoteMemoriesHash: localMemoriesHash,
      });
    }

    // ── 3. Build memory payload (only if hashes differ) ───────────────────────
    let memoriesPayload: string | null = null;
    if (memoryHashDiffers) {
      const memResult = await TaskSyncRepository.getSharedMemories({
        logger,
        userId: user.id,
      });
      const sharedMemories = memResult.success ? memResult.data.memories : [];
      memoriesPayload = JSON.stringify(sharedMemories);
      memoriesSynced = sharedMemories.length;
    }

    // ── 4. Build capabilities payload (only if version differs) ───────────────
    let capabilitiesPayload: string | null = null;
    const { CAPABILITIES_VERSION } =
      await import("@/app/api/[locale]/system/generated/remote-capabilities/version").catch(
        () => ({
          CAPABILITIES_VERSION: "unknown",
        }),
      );

    const capVersionDiffers = data.capabilitiesVersion !== CAPABILITIES_VERSION;

    if (capVersionDiffers) {
      // Use the role matching the requesting user — admin gets admin capabilities
      const { userRoles: userRolesTable } =
        await import("@/app/api/[locale]/user/db");
      const userRoleRows = await db
        .select({ role: userRolesTable.role })
        .from(userRolesTable)
        .where(eq(userRolesTable.userId, user.id));
      const roles = userRoleRows.map((r) => r.role);
      const roleSlug = roles.includes(UserPermissionRole.ADMIN)
        ? "admin"
        : roles.includes(UserPermissionRole.CUSTOMER)
          ? "customer"
          : "public";

      const capFileImport =
        roleSlug === "admin"
          ? await import("@/app/api/[locale]/system/generated/remote-capabilities/en/admin").catch(
              () => null,
            )
          : roleSlug === "customer"
            ? await import("@/app/api/[locale]/system/generated/remote-capabilities/en/customer").catch(
                () => null,
              )
            : await import("@/app/api/[locale]/system/generated/remote-capabilities/en/public").catch(
                () => null,
              );
      if (capFileImport) {
        capabilitiesPayload = JSON.stringify(
          (capFileImport as { remoteCapabilities?: RemoteToolCapability[] })
            .remoteCapabilities ?? [],
        );
      }
    }

    // ── 5. Build tasks payload (REMOTE_TOOL_CALL tasks since cursor) ──────────
    const cursor = data.taskCursor ? new Date(data.taskCursor) : new Date(0);

    // Fetch server DB time — local uses this as next cursor to avoid
    // JS process / Docker container timezone skew corrupting the cursor.
    const serverTimeResult = await db.execute<{ now: string }>(
      sql`SELECT NOW() as now`,
    );
    const serverTime = new Date(serverTimeResult.rows[0].now).toISOString();

    const pendingTasks = await db
      .select()
      .from(cronTasks)
      .where(
        sql`${cronTasks.userId} = ${user.id} AND ${cronTasks.targetInstance} = ${connRow?.remoteInstanceId ?? instanceId} AND ${cronTasks.createdAt} > ${cursor} AND ${cronTasks.lastExecutionStatus} IS NULL`,
      )
      .limit(50);

    const tasks = pendingTasks.map((t) =>
      TaskSyncRepository.serializeForSync(t),
    );

    return success({
      remoteMemoriesHash: ourMemoriesHash,
      memories: memoriesPayload,
      remoteCapabilitiesVersion: CAPABILITIES_VERSION,
      capabilities: capabilitiesPayload,
      tasks: JSON.stringify(tasks),
      memoriesSynced,
      serverTime,
    });
  }
}
