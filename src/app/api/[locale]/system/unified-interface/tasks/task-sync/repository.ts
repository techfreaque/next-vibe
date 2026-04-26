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
import { z } from "zod";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { RemoteToolCapabilitySchema } from "@/app/api/[locale]/user/remote-connection/db";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { BEARER_LEAD_ID_SEPARATOR } from "@/config/constants";
import { env } from "@/config/env";
import { type CountryLanguage, defaultLocale } from "@/i18n/core/config";

import type { NewCronTask } from "../cron/db";
import { cronTasks, toDbUserId, dbUserIdToOwner } from "../cron/db";
import {
  CronTaskPriorityDB,
  CronTaskStatus,
  TaskCategoryDB,
  TaskOutputModeDB,
} from "../enum";
import { scopedTranslation } from "../i18n";
import {
  type WidgetData,
  WidgetDataSchema,
} from "@/app/api/[locale]/system/unified-interface/shared/types/json";

import type { SyncRequestOutput, SyncResponseOutput } from "./definition";
import type { TaskSyncPullPostResponseOutput } from "./pull/definition";

// ─── Zod Schemas for remote data validation ──────────────────────────────────

const syncedCronTaskSchema = z.object({
  id: z.string(),
  routeId: z.string(),
  displayName: z.string(),
  description: z.string().nullable(),
  version: z.string().optional(),
  category: z.enum(TaskCategoryDB),
  schedule: z.string(),
  timezone: z.string().nullable().optional(),
  enabled: z.boolean(),
  priority: z.enum(CronTaskPriorityDB),
  timeout: z.number().nullable().optional(),
  retries: z.number().nullable().optional(),
  retryDelay: z.number().nullable().optional(),
  taskInput: z.record(z.string(), WidgetDataSchema),
  runOnce: z.boolean().optional(),
  outputMode: z.enum(TaskOutputModeDB).optional(),
  notificationTargets: z.array(
    z.object({
      type: z.enum(["email", "sms", "webhook"]),
      target: z.string(),
    }),
  ),
  tags: z.array(z.string()),
  targetInstance: z.string().nullable(),
  owner: z.discriminatedUnion("type", [
    z.object({ type: z.literal("user"), userId: z.string() }),
    z.object({ type: z.literal("system") }),
  ]),
  wakeUpCallbackMode: z.string().nullable().optional(),
  wakeUpThreadId: z.string().nullable().optional(),
  wakeUpToolMessageId: z.string().nullable().optional(),
  wakeUpLeafMessageId: z.string().nullable().optional(),
  wakeUpModelId: z.string().nullable().optional(),
  wakeUpSkillId: z.string().nullable().optional(),
  wakeUpFavoriteId: z.string().nullable().optional(),
  wakeUpSubAgentDepth: z.number().nullable().optional(),
});

const remoteSyncResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      remoteSyncHashes: z.record(z.string(), z.string()).optional(),
      syncPayloads: z.record(z.string(), z.string()).optional(),
      syncCounts: z.record(z.string(), z.number()).optional(),
      remoteCapabilitiesVersion: z.string().optional(),
      capabilities: z.string().nullable().optional(),
      tasks: z.string().optional(),
      serverTime: z.string(),
    })
    .optional(),
});

/**
 * Serialized cron task for sync payloads.
 * Inferred from the Zod schema for type safety - no manual duplication.
 */
type SyncedCronTask = z.infer<typeof syncedCronTaskSchema>;

interface UpsertRemoteTasksResult {
  synced: number;
}
interface GetUserCreatedTasksResult {
  tasks: SyncedCronTask[];
}
interface PushStatusToRemoteResult {
  pushed: boolean;
}

export class TaskSyncRepository {
  /**
   * Load the capabilities version constant from the generated file.
   */
  private static async getCapabilitiesVersion(): Promise<string> {
    const { CAPABILITIES_VERSION } =
      await import("@/app/api/[locale]/system/generated/remote-capabilities/version").catch(
        () => ({ CAPABILITIES_VERSION: "unknown" }),
      );
    return CAPABILITIES_VERSION;
  }

  /**
   * Resolve the user's role slug (admin/customer/public) for capability loading.
   */
  private static async getUserRoleSlug(
    userId: string,
  ): Promise<"admin" | "customer" | "public"> {
    const { userRoles: userRolesTable } =
      await import("@/app/api/[locale]/user/db");
    const userRoleRows = await db
      .select({ role: userRolesTable.role })
      .from(userRolesTable)
      .where(eq(userRolesTable.userId, userId));
    const roles = userRoleRows.map((r) => r.role);
    return roles.includes(UserPermissionRole.ADMIN)
      ? "admin"
      : roles.includes(UserPermissionRole.CUSTOMER)
        ? "customer"
        : "public";
  }

  /**
   * Load capabilities JSON for a given role. Returns parsed + validated array, or null.
   */
  private static async loadCapabilities(
    roleSlug: "admin" | "customer" | "public",
  ): Promise<z.infer<typeof RemoteToolCapabilitySchema>[] | null> {
    const capFileImport =
      roleSlug === "admin"
        ? await import("@/app/api/[locale]/system/generated/remote-capabilities/en/admin.json").catch(
            () => null,
          )
        : roleSlug === "customer"
          ? await import("@/app/api/[locale]/system/generated/remote-capabilities/en/customer.json").catch(
              () => null,
            )
          : await import("@/app/api/[locale]/system/generated/remote-capabilities/en/public.json").catch(
              () => null,
            );
    if (!capFileImport) {
      return null;
    }
    return z.array(RemoteToolCapabilitySchema).parse(capFileImport.default);
  }

  /**
   * Parse a sync field that may arrive as a JSON string OR as a pre-parsed array.
   * Uses Zod schema for runtime validation - zero type assertions.
   */
  private static parseSyncField<T>(
    value: string | WidgetData,
    schema: z.ZodType<T[]>,
  ): T[] {
    if (typeof value === "string") {
      return schema.parse(JSON.parse(value));
    }
    if (Array.isArray(value)) {
      return schema.parse(value);
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
      notificationTargets: task.notificationTargets,
      tags: task.tags,
      targetInstance: task.targetInstance,
      owner: dbUserIdToOwner(task.userId),
      wakeUpCallbackMode: task.wakeUpCallbackMode ?? null,
      wakeUpThreadId: task.wakeUpThreadId ?? null,
      wakeUpToolMessageId: task.wakeUpToolMessageId ?? null,
      wakeUpLeafMessageId: task.wakeUpLeafMessageId ?? null,
      wakeUpModelId: task.wakeUpModelId ?? null,
      wakeUpSkillId: task.wakeUpSkillId ?? null,
      wakeUpFavoriteId: task.wakeUpFavoriteId ?? null,
      wakeUpSubAgentDepth: task.wakeUpSubAgentDepth ?? null,
    };
  }

  /**
   * Upsert cron tasks from a remote instance.
   * Match by id - every task has a unique, stable string identity.
   * routeId is NOT used for identity - multiple tasks can call the same endpoint.
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
            "Rejecting remote task - routeId not recognised locally",
            {
              id: remoteTask.id,
              routeId: remoteTask.routeId,
            },
          );
          continue;
        }

        // Match by id - stable, human-readable task identity
        const [existing] = await db
          .select({
            id: cronTasks.id,
            lastExecutionStatus: cronTasks.lastExecutionStatus,
          })
          .from(cronTasks)
          .where(eq(cronTasks.id, remoteTask.id))
          .limit(1);

        // Build update payload from fields actually present in the remote payload.
        // Old remotes may not send newer fields - skip undefined to avoid
        // overwriting local values with null/defaults.
        const definitionFields: Partial<
          NewCronTask<Record<string, WidgetData>>
        > & { updatedAt: Date } = {
          displayName: remoteTask.displayName,
          description: remoteTask.description,
          category: remoteTask.category,
          schedule: remoteTask.schedule,
          priority: remoteTask.priority,
          taskInput: remoteTask.taskInput,
          tags: remoteTask.tags,
          targetInstance: remoteTask.targetInstance,
          userId: toDbUserId(remoteTask.owner),
          updatedAt: new Date(),
          // Revival context - preserve typed columns for wakeUp/wait callback flow
          wakeUpCallbackMode: remoteTask.wakeUpCallbackMode ?? null,
          wakeUpThreadId: remoteTask.wakeUpThreadId ?? null,
          wakeUpToolMessageId: remoteTask.wakeUpToolMessageId ?? null,
          wakeUpLeafMessageId: remoteTask.wakeUpLeafMessageId ?? null,
          wakeUpModelId: remoteTask.wakeUpModelId ?? null,
          wakeUpSkillId: remoteTask.wakeUpSkillId ?? null,
          wakeUpFavoriteId: remoteTask.wakeUpFavoriteId ?? null,
          wakeUpSubAgentDepth: remoteTask.wakeUpSubAgentDepth ?? null,
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
          definitionFields.notificationTargets = remoteTask.notificationTargets;
        }

        if (existing) {
          // Skip update if task is currently RUNNING - avoid overwriting mid-execution
          if (existing.lastExecutionStatus === CronTaskStatus.RUNNING) {
            logger.debug("Skipping sync for RUNNING task", {
              id: remoteTask.id,
              routeId: remoteTask.routeId,
            });
            continue;
          }

          // Update definition fields only - never overwrite local execution state
          // (enabled, lastExecutionStatus, counts, etc. are managed by the local pulse runner)
          await db
            .update(cronTasks)
            .set(definitionFields)
            .where(eq(cronTasks.id, existing.id));
          synced++;
        } else {
          // New task - use remote's id directly.
          // Cross-instance delegated tasks (targetInstance set) are always treated as
          // run-once: the remote re-creates them if it wants another execution.
          // This prevents a task created with runOnce:false from looping indefinitely
          // on the local instance.
          const effectiveRunOnce =
            remoteTask.targetInstance !== null
              ? true
              : (definitionFields.runOnce ?? remoteTask.runOnce);
          // Delegated tasks (targetInstance set) are always inserted as enabled=true.
          // The sender may have disabled the task locally to prevent its own cron from
          // double-executing it, but the recipient should always run what it receives.
          const effectiveEnabled =
            remoteTask.targetInstance !== null ? true : remoteTask.enabled;
          await db.insert(cronTasks).values({
            id: remoteTask.id,
            shortId: nanoid(8),
            routeId: remoteTask.routeId,
            displayName: definitionFields.displayName ?? remoteTask.routeId,
            category: definitionFields.category ?? remoteTask.category,
            schedule: definitionFields.schedule ?? remoteTask.schedule,
            priority: definitionFields.priority ?? remoteTask.priority,
            enabled: effectiveEnabled,
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
   * Local sends per-provider hashes → remote diffs → returns only changed payloads.
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
      const { computeSyncHashes, applySyncPayloads } =
        await import("./sync-provider");

      const activeConnections =
        await RemoteConnectionRepository.getAllActiveConnectionsForSync();

      if (activeConnections.length === 0) {
        return success({ pulled: 0 });
      }

      const { endpoints: syncEndpoints } = await import("./definition");
      const localInstanceId =
        RemoteConnectionRepository.deriveDefaultSelfInstanceId();

      const CAPABILITIES_VERSION =
        await TaskSyncRepository.getCapabilitiesVersion();

      let totalPulled = 0;

      for (const conn of activeConnections) {
        try {
          const syncUrl = TaskSyncRepository.buildRemoteEndpointUrl(
            conn.remoteUrl,
            syncEndpoints.POST,
          );

          // Compute unified per-provider hashes via the sync framework
          const { perProvider: localSyncHashes } = await computeSyncHashes(
            conn.userId,
          );

          // Only send capabilities when version changed since last sync
          const sendCapabilities =
            conn.capabilitiesVersion !== CAPABILITIES_VERSION;

          let capabilitiesJson: string | undefined;
          if (sendCapabilities) {
            const roleSlug = await TaskSyncRepository.getUserRoleSlug(
              conn.userId,
            );
            const caps = await TaskSyncRepository.loadCapabilities(roleSlug);
            if (caps) {
              capabilitiesJson = JSON.stringify(
                caps.map((c) => ({ ...c, instanceId: localInstanceId })),
              );
            }
          }

          const taskCursor = conn.taskCursor ?? new Date(0).toISOString();

          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${conn.token}${BEARER_LEAD_ID_SEPARATOR}${conn.leadId}`,
          };

          const body: Record<string, string | Record<string, string>> = {
            instanceId: localInstanceId,
            syncHashes: localSyncHashes,
            capabilitiesVersion: conn.capabilitiesVersion ?? "none",
            taskCursor,
          };
          if (capabilitiesJson !== undefined) {
            body.capabilitiesJson = capabilitiesJson;
          }

          // Collect tasks this instance created that target the remote
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
            if (response.status === 401) {
              logger.warn(
                "Pull from remote: 401 - marking connection inactive",
                { userId: conn.userId, instanceId: conn.instanceId },
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

          const result = remoteSyncResponseSchema.parse(await response.json());

          if (!result.success || !result.data) {
            logger.warn("Pull from remote returned failure", {
              userId: conn.userId,
            });
            continue;
          }

          const { data } = result;

          // Apply all sync payloads via the unified framework
          if (data.syncPayloads) {
            await applySyncPayloads(data.syncPayloads, conn.userId, logger);
          }

          // Store remote hashes + capability updates + cursor
          const { RemoteConnectionRepository: RemoteRepo2 } =
            await import("@/app/api/[locale]/user/remote-connection/repository");

          const newTaskCursor = data.serverTime;

          if (data.capabilities) {
            const caps = z
              .array(RemoteToolCapabilitySchema)
              .parse(JSON.parse(data.capabilities));
            await RemoteRepo2.touchLastSynced(conn.userId, conn.instanceId, {
              capabilities: caps,
              remoteSyncHashes: data.remoteSyncHashes,
              taskCursor: newTaskCursor,
              ...(sendCapabilities
                ? { capabilitiesVersion: CAPABILITIES_VERSION }
                : {}),
            });
          } else {
            await RemoteRepo2.touchLastSynced(conn.userId, conn.instanceId, {
              remoteSyncHashes: data.remoteSyncHashes,
              taskCursor: newTaskCursor,
              ...(sendCapabilities
                ? { capabilitiesVersion: CAPABILITIES_VERSION }
                : {}),
            });
          }

          // Apply remote tasks (REMOTE_TOOL_CALL tasks for this local instance)
          if (data.tasks) {
            const remoteTasks = z
              .array(syncedCronTaskSchema)
              .parse(JSON.parse(data.tasks));
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

          // Re-check direct accessibility on each sync cycle
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
   * Fire-and-forget per user - logs errors but never fails the caller.
   * Cloud instances (NEXT_PUBLIC_VIBE_IS_CLOUD=true) skip outbound push.
   */
  static async pushStatusToRemote(params: {
    /** The task's unique id (e.g. "remote-hermes-dev-...") - used by /report to look up the exact task */
    taskId: string;
    status: string;
    summary: string;
    durationMs: number | null;
    executionId?: string;
    output?: Record<string, WidgetData>;
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
            Authorization: `Bearer ${conn.token}${BEARER_LEAD_ID_SEPARATOR}${conn.leadId}`,
          };

          const response = await fetch(reportUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
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
   * Hash-first sync handler - cloud side.
   *
   * Protocol:
   * 1. Local sends: syncHashes (per-provider), capabilitiesVersion, capabilitiesJson (if changed), taskCursor
   * 2. Cloud diffs hashes against local state via sync framework
   * 3. Cloud returns: remoteSyncHashes, syncPayloads (only changed), syncCounts, capabilities (if diff), tasks (since cursor)
   *
   * All payloads are empty when hashes match - one tiny request per tick in steady state.
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
    const { buildSyncPayloads } = await import("./sync-provider");

    // Find the connection record for this user (the local that is calling us).
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
    if (data.capabilitiesJson) {
      try {
        const capabilities = TaskSyncRepository.parseSyncField(
          data.capabilitiesJson,
          z.array(RemoteToolCapabilitySchema),
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
    if (data.outboundTasks) {
      try {
        const inboundTasks = TaskSyncRepository.parseSyncField(
          data.outboundTasks,
          z.array(syncedCronTaskSchema),
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

    // ── 2. Diff hashes and build sync payloads via unified framework ──────────
    // Parse incoming syncHashes (may arrive as JSON string or pre-parsed object)
    let incomingHashes: Record<string, string> = {};
    if (data.syncHashes) {
      if (typeof data.syncHashes === "string") {
        incomingHashes = z
          .record(z.string(), z.string())
          .parse(JSON.parse(data.syncHashes));
      } else {
        incomingHashes = data.syncHashes;
      }
    }

    const { remoteSyncHashes, syncPayloads, syncCounts } =
      await buildSyncPayloads(incomingHashes, user.id, logger);

    // Store remote's hashes for future diffs
    if (Object.keys(incomingHashes).length > 0) {
      await RemoteRepoReport.touchLastSynced(user.id, instanceId, {
        remoteSyncHashes: incomingHashes,
      });
    }

    // ── 3. Build capabilities payload (only if version differs) ───────────────
    let capabilitiesPayload: string | null = null;
    const CAPABILITIES_VERSION =
      await TaskSyncRepository.getCapabilitiesVersion();

    const capVersionDiffers = data.capabilitiesVersion !== CAPABILITIES_VERSION;

    if (capVersionDiffers) {
      const roleSlug = await TaskSyncRepository.getUserRoleSlug(user.id);
      const caps = await TaskSyncRepository.loadCapabilities(roleSlug);
      if (caps) {
        capabilitiesPayload = JSON.stringify(caps);
      }
    }

    // ── 4. Build tasks payload (REMOTE_TOOL_CALL tasks since cursor) ──────────
    const cursor = data.taskCursor ? new Date(data.taskCursor) : new Date(0);

    const serverTimeResult = await db.execute<{ now: string }>(
      sql`SELECT NOW() as now`,
    );
    const serverTime = new Date(serverTimeResult.rows[0].now).toISOString();

    const pendingTasks = await db
      .select()
      .from(cronTasks)
      .where(
        sql`${cronTasks.userId} = ${user.id} AND ${cronTasks.targetInstance} = ${connRow?.instanceId ?? instanceId} AND ${cronTasks.createdAt} > ${cursor} AND ${cronTasks.lastExecutionStatus} IS NULL`,
      )
      .limit(50);

    const tasks = pendingTasks.map((task) =>
      TaskSyncRepository.serializeForSync(task),
    );

    return success({
      remoteSyncHashes,
      syncPayloads,
      syncCounts,
      remoteCapabilitiesVersion: CAPABILITIES_VERSION,
      capabilities: capabilitiesPayload,
      tasks: JSON.stringify(tasks),
      serverTime,
    });
  }
}
