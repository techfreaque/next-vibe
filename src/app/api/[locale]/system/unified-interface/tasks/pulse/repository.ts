/**
 * Pulse Health Repository
 * Database operations for pulse health monitoring
 * Following interface + implementation pattern
 */

import {
  and,
  count,
  desc,
  eq,
  inArray,
  isNull,
  ne,
  or,
  sql,
} from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  isContentResponse,
  isFileResponse,
  isStreamingResponse,
  success,
} from "next-vibe/shared/types/response.schema";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { LeadAuthRepository } from "@/app/api/[locale]/leads/auth/repository";
import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  CronTaskStatus,
  type CronTaskStatusValue,
  getPriorityWeight,
  PulseExecutionStatus,
  PulseHealthStatus,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { users as usersTable } from "@/app/api/[locale]/user/db";
import { UserRolesRepository } from "@/app/api/[locale]/user/user-roles/repository";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import type { CallbackModeValue } from "../../ai/execute-tool/constants";
import { Platform } from "../../shared/types/platform";
import { getFullPath } from "../../shared/utils/path";
import { isCronTaskDue } from "../cron-formatter";
import { splitTaskArgs } from "../cron/arg-splitter";
import { cronTasks as cronTasksTable } from "../cron/db";
import { CronTasksRepository } from "../cron/repository";
import {
  scopedTranslation,
  scopedTranslation as tasksScopedTranslation,
} from "../i18n";
import { handleTaskCompletion } from "../task-completion-handler";
import { TaskSyncRepository } from "../task-sync/repository";
import type { JsonValue } from "../unified-runner/types";
import type {
  NewPulseExecution,
  NewPulseHealth,
  NewPulseNotification,
  PulseExecution,
  PulseHealth,
  PulseNotification,
} from "./db";
import {
  pulseExecutions,
  pulseHealth,
  pulseNotifications,
  selectPulseNotificationSchema,
} from "./db";
import type { PulseStatusResponseOutput } from "./status/definition";

/**
 * Implementation of Pulse Health Repository
 */
export class PulseHealthRepository {
  static async getCurrentHealth(
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseHealth | null>> {
    try {
      const health = await db
        .select()
        .from(pulseHealth)
        .orderBy(desc(pulseHealth.updatedAt))
        .limit(1);

      return success<PulseHealth | null>(health[0] ?? null);
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async updateHealth(
    updates: Partial<PulseHealth>,
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseHealth>> {
    try {
      // Get the current health record
      const currentHealthResponse =
        await PulseHealthRepository.getCurrentHealth(locale);
      if (!currentHealthResponse.success || !currentHealthResponse.data) {
        // If no health record exists, cannot update - require a full create
        const { t } = tasksScopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.repositoryNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const [updatedHealth] = await db
        .update(pulseHealth)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(pulseHealth.id, currentHealthResponse.data.id))
        .returning();

      return success<PulseHealth>(updatedHealth);
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async createHealthRecord(
    health: NewPulseHealth,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseHealth>> {
    try {
      const [newHealth] = await db
        .insert(pulseHealth)
        .values(health)
        .returning();
      return success<PulseHealth>(newHealth);
    } catch (error) {
      logger.error("Failed to create health record", parseError(error));
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async createExecution(
    execution: NewPulseExecution,
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseExecution>> {
    try {
      const [newExecution] = await db
        .insert(pulseExecutions)
        .values(execution)
        .returning();
      return success(newExecution);
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async updateExecution(
    id: string,
    updates: Partial<PulseExecution>,
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseExecution>> {
    try {
      const [updatedExecution] = await db
        .update(pulseExecutions)
        .set(updates)
        .where(eq(pulseExecutions.id, id))
        .returning();

      if (!updatedExecution) {
        const { t } = tasksScopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.repositoryNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(updatedExecution);
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async getRecentExecutions(
    limit = 50,
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseExecution[]>> {
    try {
      const executions = await db
        .select()
        .from(pulseExecutions)
        .orderBy(desc(pulseExecutions.startedAt))
        .limit(limit);

      return success(executions);
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async getExecutionById(
    id: string,
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseExecution | null>> {
    try {
      const execution = await db
        .select()
        .from(pulseExecutions)
        .where(eq(pulseExecutions.id, id))
        .limit(1);

      return success(execution[0] ?? null);
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async createNotification(
    notification: NewPulseNotification,
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseNotification>> {
    try {
      const [newNotification] = await db
        .insert(pulseNotifications)
        .values(notification)
        .returning();
      return success(newNotification);
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);

      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async getUnsentNotifications(
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseNotification[]>> {
    try {
      const notifications = await db
        .select()
        .from(pulseNotifications)
        .where(eq(pulseNotifications.sent, false))
        .orderBy(pulseNotifications.createdAt);

      return success(notifications);
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async markNotificationSent(
    id: string,
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseNotification>> {
    try {
      const [updatedNotification] = await db
        .update(pulseNotifications)
        .set({ sent: true, sentAt: new Date() })
        .where(eq(pulseNotifications.id, id))
        .returning();

      if (!updatedNotification) {
        const { t } = tasksScopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.repositoryNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(selectPulseNotificationSchema.parse(updatedNotification));
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async getHealthStatistics(locale: CountryLanguage): Promise<
    ResponseType<{
      currentStatus: string;
      totalExecutions: number;
      successRate: number;
      averageExecutionTime: number;
      consecutiveFailures: number;
    }>
  > {
    try {
      // Get current health
      const currentHealthResponse =
        await PulseHealthRepository.getCurrentHealth(locale);
      if (!currentHealthResponse.success) {
        const { t } = tasksScopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.repositoryInternalError"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          cause: currentHealthResponse,
        });
      }
      const currentHealth = currentHealthResponse.data;

      // Get execution statistics
      const [execStats] = await db
        .select({
          totalExecutions: count(pulseExecutions.id),
          averageExecutionTime: sql<number>`avg(${pulseExecutions.durationMs})::int`,
        })
        .from(pulseExecutions);

      return success({
        currentStatus: currentHealth?.status || "UNKNOWN",
        totalExecutions: execStats.totalExecutions,
        successRate: currentHealth?.successRate || 0,
        averageExecutionTime: execStats.averageExecutionTime || 0,
        consecutiveFailures: currentHealth?.consecutiveFailures || 0,
      });
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
  /**
   * Resolve the user context for a task execution.
   * System tasks (no userId) use the cached admin auth result.
   * User tasks fetch real roles and leadId from the DB.
   */
  private static async resolveTaskUser(
    userId: string | null,
    adminAuthResult: ResponseType<JwtPrivatePayloadType> | null,
    systemLocale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<{
    user: JwtPrivatePayloadType;
    locale: CountryLanguage;
  } | null> {
    if (!userId) {
      // System task - use the cached admin user
      if (!adminAuthResult?.success || !adminAuthResult.data) {
        return null;
      }
      return { user: adminAuthResult.data, locale: systemLocale };
    }

    // User task - resolve locale, roles, and leadId
    let userLocale: CountryLanguage = systemLocale;
    const ownerRow = await db
      .select({ locale: usersTable.locale })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    if (ownerRow[0]?.locale) {
      userLocale = ownerRow[0].locale;
    }

    const rolesResult = await UserRolesRepository.getUserRoles(
      userId,
      logger,
      userLocale,
    );
    if (!rolesResult.success) {
      return null;
    }

    const { leadId } = await LeadAuthRepository.getAuthenticatedUserLeadId(
      userId,
      undefined,
      userLocale,
      logger,
    );

    return {
      user: {
        id: userId,
        leadId,
        isPublic: false as const,
        roles: rolesResult.data,
      },
      locale: userLocale,
    };
  }

  /**
   * Execute a pulse cycle with the given options
   * Merged functionality from old system
   */
  static async executePulse(
    options: {
      dryRun?: boolean;
      taskNames?: string[];
      force?: boolean;
      systemLocale: CountryLanguage;
    },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      success: boolean;
      summary: {
        pulseId: string;
        executedAt: string;
        totalTasksDiscovered: number;
        tasksDue: string[];
        tasksExecuted: string[];
        tasksSucceeded: string[];
        tasksFailed: string[];
        tasksSkipped: string[];
        totalExecutionTimeMs: number;
        errors?: Array<{
          message: string;
          messageParams?: Record<string, string | number | boolean>;
          errorType: string;
        }>;
      };
      isDryRun: boolean;
    }>
  > {
    try {
      locale = options.systemLocale;
      const startTime = Date.now();
      const pulseId = crypto.randomUUID();
      const now = new Date();

      const { RemoteConnectionRepository } =
        await import("@/app/api/[locale]/user/remote-connection/repository");
      const instanceId =
        RemoteConnectionRepository.deriveDefaultSelfInstanceId();

      const tasksDue: string[] = [];
      const tasksExecuted: string[] = [];
      const tasksSucceeded: string[] = [];
      const tasksFailed: string[] = [];
      const tasksSkipped: string[] = [];

      // Resolve admin user for system tasks (cached for entire pulse cycle)
      const adminEmail = env.VIBE_ADMIN_USER_EMAIL;
      const adminAuthResult = adminEmail
        ? await AuthRepository.authenticateUserByEmail(
            adminEmail,
            options.systemLocale,
            logger,
          )
        : null;

      // All tasks live in the DB (system tasks have no userId, user tasks have one)
      const whereConditions = [eq(cronTasksTable.enabled, true)];
      if (options.taskNames && options.taskNames.length > 0) {
        whereConditions.push(
          inArray(cronTasksTable.routeId, options.taskNames),
        );
      }
      const allTasks = await db
        .select()
        .from(cronTasksTable)
        .where(and(...whereConditions));

      // Sort by priority: CRITICAL first, BACKGROUND last
      allTasks.sort(
        (a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority),
      );

      // Discover which tasks are due
      for (const dbTask of allTasks) {
        // Instance routing: null targetInstance = runs on any instance,
        // specific targetInstance = only on that named instance
        const taskTarget = dbTask.targetInstance ?? null;
        if (taskTarget !== null && taskTarget !== instanceId) {
          tasksSkipped.push(dbTask.displayName);
          continue;
        }

        const isDue =
          options.force || isCronTaskDue(logger, dbTask.schedule, now);
        if (!isDue) {
          tasksSkipped.push(dbTask.displayName);
          continue;
        }

        // Overlap prevention: skip if this task is still running from a previous pulse
        if (dbTask.lastExecutionStatus === CronTaskStatus.RUNNING) {
          tasksSkipped.push(dbTask.displayName);
          logger.debug(
            `Pulse: skipping task "${dbTask.displayName}" - still running from previous pulse`,
          );
          continue;
        }

        tasksDue.push(dbTask.displayName);

        if (options.dryRun) {
          continue;
        }

        // Atomically claim the task using FOR UPDATE SKIP LOCKED
        // This prevents two instances from executing the same task simultaneously
        const claimed = await db.transaction(async (tx) => {
          const [row] = await tx
            .select()
            .from(cronTasksTable)
            .where(
              and(
                eq(cronTasksTable.id, dbTask.id),
                // NULL != 'running' is NULL in SQL (three-value logic) - must explicitly handle NULL
                or(
                  isNull(cronTasksTable.lastExecutionStatus),
                  ne(
                    cronTasksTable.lastExecutionStatus,
                    CronTaskStatus.RUNNING,
                  ),
                ),
              ),
            )
            .for("update", { skipLocked: true })
            .limit(1);

          if (!row) {
            return null;
          }

          await tx
            .update(cronTasksTable)
            .set({
              lastExecutionStatus: CronTaskStatus.RUNNING,
              ...(dbTask.runOnce ? { enabled: false } : {}),
              updatedAt: new Date(),
            })
            .where(eq(cronTasksTable.id, dbTask.id));

          return row;
        });

        if (!claimed) {
          tasksSkipped.push(dbTask.displayName);
          logger.debug(
            `Pulse: skipping task "${dbTask.displayName}" - claimed by another instance`,
          );
          continue;
        }

        if (dbTask.runOnce) {
          logger.debug(
            `[run-once] Task "${dbTask.displayName}" disabled before execution`,
          );
        }

        tasksExecuted.push(dbTask.displayName);
        logger.debug(
          `Pulse executing task: ${dbTask.displayName} (routeId: ${dbTask.routeId})`,
        );

        // Resolve user context with real roles from DB
        const taskUserContext = await PulseHealthRepository.resolveTaskUser(
          dbTask.userId,
          adminAuthResult,
          options.systemLocale,
          logger,
        );

        if (!taskUserContext) {
          tasksFailed.push(dbTask.displayName);
          logger.error(
            `Pulse: failed to resolve user context for task "${dbTask.displayName}"${
              dbTask.userId
                ? ` (userId: ${dbTask.userId})`
                : " (check VIBE_ADMIN_USER_EMAIL)"
            }`,
          );
          continue;
        }

        const { user: cronUser, locale: userLocale } = taskUserContext;
        const { t: tTask } = scopedTranslation.scopedT(userLocale);
        const startedAt = new Date();

        // Resolve routeId → endpoint path → handler
        const path = getFullPath(dbTask.routeId);
        const handler = path
          ? await import("../../../generated/route-handlers").then((m) =>
              m.getRouteHandler(path),
            )
          : null;
        let taskSucceeded = false;

        if (!path || !handler) {
          tasksFailed.push(dbTask.displayName);
          logger.error(
            `Pulse: ${!path ? "unknown routeId" : "no handler"} "${dbTask.routeId}" for task "${dbTask.displayName}"`,
          );
        } else {
          // Fire-and-forget: notify remote that task is now RUNNING
          if (dbTask.targetInstance) {
            void TaskSyncRepository.pushStatusToRemote({
              taskId: dbTask.id,
              status: CronTaskStatus.RUNNING,
              summary: "",
              durationMs: null,
              startedAt: startedAt.toISOString(),
              serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              executedByInstance: instanceId,
              logger,
            }).catch((err) => {
              logger.warn("pushStatusToRemote (RUNNING) failed", {
                taskId: dbTask.id,
                error: String(err),
              });
            });
          }

          try {
            const taskInput = dbTask.taskInput ?? {};
            const { urlPathParams, data } = await splitTaskArgs(
              path,
              taskInput,
            );
            const timeoutMs = dbTask.timeout ?? 300000;
            const maxRetries = dbTask.retries ?? 0;
            const retryDelayMs = dbTask.retryDelay ?? 30000;

            let firstExecutionId: string | null = null;
            let finalStatus: typeof CronTaskStatusValue = CronTaskStatus.FAILED;
            let finalMessage: string | null = null;
            let finalDurationMs = 0;
            let didLogHistory = false;
            let finalOutput: Record<string, JsonValue> | null = null;

            for (let attempt = 0; attempt <= maxRetries; attempt++) {
              if (attempt > 0) {
                logger.debug(
                  `Pulse: retrying task "${dbTask.displayName}" (attempt ${attempt + 1}/${maxRetries + 1}) after ${retryDelayMs}ms`,
                );
                await new Promise<void>((resolve) => {
                  setTimeout(resolve, retryDelayMs);
                });
              }

              const attemptStart = Date.now();
              const taskAbortController = new AbortController();
              let typedResult: ResponseType<
                Record<string, string | number | boolean>
              >;

              try {
                // Execute with timeout
                const result = await Promise.race([
                  handler({
                    data,
                    urlPathParams,
                    user: cronUser,
                    locale: userLocale,
                    logger,
                    platform: Platform.CRON,
                    streamContext: {
                      rootFolderId: DefaultFolderId.CRON,
                      threadId: undefined,
                      aiMessageId: undefined,
                      currentToolMessageId: undefined,
                      callerToolCallId: undefined,
                      pendingToolMessages: undefined,
                      pendingTimeoutMs: undefined,
                      leafMessageId: undefined,
                      skillId: undefined,
                      modelId: undefined,
                      favoriteId: undefined,
                      headless: undefined,
                      imageGenModelId: undefined,
                      musicGenModelId: undefined,
                      videoGenModelId: undefined,
                      isRevival: undefined,
                      waitingForRemoteResult: undefined,
                      abortSignal: taskAbortController.signal,
                      callerCallbackMode: undefined,
                      escalateToTask: undefined,
                      onEscalatedTaskCancel: undefined,
                    },
                  }),
                  new Promise<never>((...[, reject]) => {
                    setTimeout(
                      () => reject(new Error("TASK_TIMEOUT")),
                      timeoutMs,
                    );
                  }),
                ]);

                // Normalize non-standard responses
                typedResult =
                  isStreamingResponse(result) ||
                  isFileResponse(result) ||
                  isContentResponse(result)
                    ? fail({
                        message: tTask("errors.repositoryInternalError"),
                        errorType: ErrorResponseTypes.INTERNAL_ERROR,
                      })
                    : result;
              } catch (err) {
                const isTimeout =
                  err instanceof Error && err.message === "TASK_TIMEOUT";
                typedResult = fail({
                  message: isTimeout
                    ? tTask("errors.repositoryInternalError")
                    : tTask("errors.repositoryInternalError"),
                  errorType: ErrorResponseTypes.INTERNAL_ERROR,
                });
                finalStatus = isTimeout
                  ? CronTaskStatus.TIMEOUT
                  : CronTaskStatus.FAILED;
              }

              const attemptDuration = Date.now() - attemptStart;
              const attemptStatus: typeof CronTaskStatusValue =
                typedResult.success
                  ? CronTaskStatus.COMPLETED
                  : finalStatus === CronTaskStatus.TIMEOUT
                    ? CronTaskStatus.TIMEOUT
                    : CronTaskStatus.FAILED;

              // History throttle: skip logging successful runs when within historyInterval
              const shouldLogHistory =
                !typedResult.success ||
                !dbTask.historyInterval ||
                !dbTask.lastHistoryLoggedAt ||
                Date.now() - dbTask.lastHistoryLoggedAt.getTime() >=
                  dbTask.historyInterval;

              // Record execution for this attempt (unless throttled)
              if (shouldLogHistory) {
                const execResponse = await CronTasksRepository.createExecution(
                  {
                    taskId: dbTask.id,
                    taskName: dbTask.displayName,
                    executionId: crypto.randomUUID(),
                    status: attemptStatus,
                    priority: dbTask.priority,
                    startedAt: new Date(attemptStart),
                    completedAt: new Date(),
                    durationMs: attemptDuration,
                    config: taskInput,
                    result: typedResult.success
                      ? (typedResult.data ?? null)
                      : null,
                    error: !typedResult.success ? typedResult : null,
                    retryAttempt: attempt,
                    parentExecutionId: firstExecutionId,
                    triggeredBy: "pulse",
                  },
                  tTask,
                  logger,
                );

                // Track first execution ID for retry chain
                if (attempt === 0 && execResponse.success) {
                  firstExecutionId = execResponse.data.id;
                }
                didLogHistory = true;
              }

              finalDurationMs += attemptDuration;

              if (typedResult.success) {
                taskSucceeded = true;
                finalStatus = CronTaskStatus.COMPLETED;
                finalMessage = null;
                finalOutput = typedResult.data ?? null;
                break;
              }

              finalStatus = attemptStatus;
              finalMessage = typedResult.message ?? null;

              if (attempt < maxRetries) {
                logger.warn(
                  `Pulse: task "${dbTask.displayName}" failed (attempt ${attempt + 1}/${maxRetries + 1}), will retry`,
                  { message: finalMessage },
                );
              } else {
                logger.error(
                  `Pulse: task "${dbTask.displayName}" failed after ${maxRetries + 1} attempt(s)`,
                  { message: finalMessage },
                );
              }
            }

            if (taskSucceeded) {
              tasksSucceeded.push(dbTask.displayName);
            } else {
              tasksFailed.push(dbTask.displayName);
            }

            // Update task stats (once, after all attempts)
            const newConsecutiveFailures = taskSucceeded
              ? 0
              : (dbTask.consecutiveFailures ?? 0) + 1;

            // Use atomic SQL increments to avoid lost updates across instances
            await db
              .update(cronTasksTable)
              .set({
                lastExecutedAt: startedAt,
                lastExecutionStatus: finalStatus,
                lastExecutionDuration: finalDurationMs,
                executionCount: sql`${cronTasksTable.executionCount} + 1`,
                consecutiveFailures: newConsecutiveFailures,
                ...(taskSucceeded
                  ? {
                      successCount: sql`${cronTasksTable.successCount} + 1`,
                    }
                  : { errorCount: sql`${cronTasksTable.errorCount} + 1` }),
                ...(didLogHistory ? { lastHistoryLoggedAt: new Date() } : {}),
                updatedAt: new Date(),
              })
              .where(eq(cronTasksTable.id, dbTask.id));

            // If task has callback context (set by wait-for-task or execute-tool AI path),
            // emit TASK_COMPLETED WS event + backfill tool message + schedule resume-stream.
            // Read from typed wakeUp* columns - not from untyped taskInput JSON blob.
            const taskCallbackMode =
              (dbTask.wakeUpCallbackMode as CallbackModeValue | null) ?? null;
            const taskThreadId = dbTask.wakeUpThreadId ?? null;
            const taskToolMessageId = dbTask.wakeUpToolMessageId ?? null;
            const completionUserId = cronUser.id;

            if (taskToolMessageId && completionUserId) {
              await handleTaskCompletion({
                toolMessageId: taskToolMessageId,
                threadId: taskThreadId,
                callbackMode: taskCallbackMode,
                status: finalStatus,
                output: taskSucceeded
                  ? ((finalOutput as JsonValue) ?? null)
                  : null,
                taskId: dbTask.id,
                modelId: dbTask.wakeUpModelId ?? null,
                skillId: dbTask.wakeUpSkillId ?? null,
                favoriteId: dbTask.wakeUpFavoriteId ?? null,
                leafMessageId: dbTask.wakeUpLeafMessageId ?? null,
                userId: completionUserId,
                logger,
                directResumeUser: cronUser,
                directResumeLocale: userLocale,
              }).catch((completionErr: Error) => {
                logger.error("handleTaskCompletion failed in pulse", {
                  taskId: dbTask.id,
                  error: completionErr.message,
                });
              });
            }

            // Fire-and-forget: push final status to remote
            if (dbTask.targetInstance) {
              void TaskSyncRepository.pushStatusToRemote({
                taskId: dbTask.id,
                status: finalStatus,
                summary: finalMessage ?? "",
                durationMs: finalDurationMs,
                executionId: firstExecutionId ?? undefined,
                startedAt: startedAt.toISOString(),
                serverTimezone:
                  Intl.DateTimeFormat().resolvedOptions().timeZone,
                executedByInstance: instanceId,
                ...(finalOutput ? { output: finalOutput } : {}),
                logger,
              }).catch((err) => {
                logger.warn("pushStatusToRemote (final) failed", {
                  taskId: dbTask.id,
                  status: finalStatus,
                  error: String(err),
                });
              });
            }
          } catch (unexpectedError) {
            // Catch-all: if something goes wrong outside the retry loop,
            // ensure the task doesn't stay stuck in RUNNING state forever
            logger.error(
              `Pulse: unexpected error for task "${dbTask.displayName}"`,
              parseError(unexpectedError),
            );
            tasksFailed.push(dbTask.displayName);
            const catchConsecutiveFailures =
              (dbTask.consecutiveFailures ?? 0) + 1;

            // Use atomic SQL increments to avoid lost updates across instances
            await db
              .update(cronTasksTable)
              .set({
                lastExecutionStatus: CronTaskStatus.FAILED,
                executionCount: sql`${cronTasksTable.executionCount} + 1`,
                errorCount: sql`${cronTasksTable.errorCount} + 1`,
                consecutiveFailures: catchConsecutiveFailures,
                updatedAt: new Date(),
              })
              .where(eq(cronTasksTable.id, dbTask.id));

            // Fire-and-forget: push FAILED to remote so it doesn't stay stuck on RUNNING
            if (dbTask.targetInstance) {
              void TaskSyncRepository.pushStatusToRemote({
                taskId: dbTask.id,
                status: CronTaskStatus.FAILED,
                summary: parseError(unexpectedError).message,
                durationMs: null,
                startedAt: startedAt.toISOString(),
                serverTimezone:
                  Intl.DateTimeFormat().resolvedOptions().timeZone,
                executedByInstance: instanceId,
                logger,
              }).catch((err) => {
                logger.warn("pushStatusToRemote (FAILED catch-all) failed", {
                  taskId: dbTask.id,
                  error: String(err),
                });
              });
            }
          }
        }
      }

      const summary = {
        pulseId,
        executedAt: now.toISOString(),
        totalTasksDiscovered: allTasks.length,
        tasksDue,
        tasksExecuted,
        tasksSucceeded,
        tasksFailed,
        tasksSkipped,
        totalExecutionTimeMs: Date.now() - startTime,
      };

      // Record pulse execution for health tracking
      await PulseHealthRepository.recordPulseExecution(
        tasksFailed.length === 0,
        summary.totalExecutionTimeMs,
        logger,
        options.systemLocale,
        summary,
      );

      return success({
        success: true,
        summary,
        isDryRun: options.dryRun || false,
      });
    } catch (error) {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Record a pulse execution for health tracking and persist to pulseExecutions
   */
  static async recordPulseExecution(
    isSuccessful: boolean,
    executionTimeMs: number,
    logger: EndpointLogger,
    locale: CountryLanguage,
    summary?: {
      pulseId: string;
      executedAt: string;
      totalTasksDiscovered: number;
      tasksDue: string[];
      tasksExecuted: string[];
      tasksSucceeded: string[];
      tasksFailed: string[];
      tasksSkipped: string[];
      totalExecutionTimeMs: number;
    },
  ): Promise<ResponseType<void>> {
    try {
      // Only persist failures - successful pulses are silent going forward
      if (isSuccessful) {
        return success(undefined);
      }

      // Persist to pulseExecutions table if summary is available
      if (summary) {
        await PulseHealthRepository.createExecution(
          {
            pulseId: summary.pulseId,
            executionId: crypto.randomUUID(),
            status: isSuccessful
              ? PulseExecutionStatus.SUCCESS
              : PulseExecutionStatus.FAILURE,
            healthStatus: isSuccessful
              ? PulseHealthStatus.HEALTHY
              : PulseHealthStatus.WARNING,
            startedAt: new Date(summary.executedAt),
            completedAt: new Date(),
            durationMs: summary.totalExecutionTimeMs,
            totalTasksDiscovered: summary.totalTasksDiscovered,
            tasksDue: summary.tasksDue,
            tasksExecuted: summary.tasksExecuted,
            tasksSucceeded: summary.tasksSucceeded,
            tasksFailed: summary.tasksFailed,
            tasksSkipped: summary.tasksSkipped,
            totalExecutionTimeMs: summary.totalExecutionTimeMs,
            triggeredBy: "schedule",
          },
          locale,
        );
      }

      const currentHealthResponse =
        await PulseHealthRepository.getCurrentHealth(locale);

      if (!currentHealthResponse.success || !currentHealthResponse.data) {
        // Create initial health record
        await PulseHealthRepository.createHealthRecord(
          {
            status: isSuccessful
              ? PulseHealthStatus.HEALTHY
              : PulseHealthStatus.WARNING,
            lastPulseAt: new Date(),
            consecutiveFailures: isSuccessful ? 0 : 1,
            avgExecutionTimeMs: executionTimeMs,
            successRate: isSuccessful ? 10000 : 0, // Basis points
            totalExecutions: 1,
            totalSuccesses: isSuccessful ? 1 : 0,
            totalFailures: isSuccessful ? 0 : 1,
            metadata: {},
            alertsSent: 0,
            lastAlertAt: null,
            isMaintenanceMode: false,
          },
          logger,
          locale,
        );
      } else {
        // Update existing health record
        const health = currentHealthResponse.data;
        const newTotalExecutions = health.totalExecutions + 1;
        const newTotalSuccesses =
          health.totalSuccesses + (isSuccessful ? 1 : 0);
        const newTotalFailures = health.totalFailures + (isSuccessful ? 0 : 1);
        const newSuccessRate = Math.round(
          (newTotalSuccesses / newTotalExecutions) * 10000,
        );

        await PulseHealthRepository.updateHealth(
          {
            lastPulseAt: new Date(),
            consecutiveFailures: isSuccessful
              ? 0
              : health.consecutiveFailures + 1,
            avgExecutionTimeMs: Math.round(
              ((health.avgExecutionTimeMs || 0) + executionTimeMs) / 2,
            ),
            successRate: newSuccessRate,
            totalExecutions: newTotalExecutions,
            totalSuccesses: newTotalSuccesses,
            totalFailures: newTotalFailures,
            status: isSuccessful
              ? PulseHealthStatus.HEALTHY
              : PulseHealthStatus.WARNING,
          },
          locale,
        );
      }

      return success();
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get the current pulse health status for the status endpoint
   */
  static async getHealthStatus(
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseStatusResponseOutput>> {
    const healthResponse = await PulseHealthRepository.getCurrentHealth(locale);

    if (!healthResponse.success || !healthResponse.data) {
      return success<PulseStatusResponseOutput>({
        status: "UNKNOWN",
        lastPulseAt: null,
        successRate: null,
        totalExecutions: 0,
      });
    }

    const health = healthResponse.data;
    return success<PulseStatusResponseOutput>({
      status: health.status,
      lastPulseAt: health.lastPulseAt?.toISOString() ?? null,
      successRate: health.successRate,
      totalExecutions: health.totalExecutions,
    });
  }
}
