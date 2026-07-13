/**
 * Pulse Health Repository
 * Database operations for pulse health monitoring
 * Following interface + implementation pattern
 */

import { and, desc, eq, gt, inArray, isNull, ne, or, sql } from "drizzle-orm";
import { getFullPath } from "next-vibe/core/core-utils/path";
import { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  isContentResponse,
  isFileResponse,
  isStreamingResponse,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { EndpointLogger } from "next-vibe/logger/types";
import { splitTaskArgs } from "next-vibe/tasks/cron/arg-splitter";
import {
  cronTasks as cronTasksTable,
  dbUserIdToOwner,
} from "next-vibe/tasks/cron/db";
import { createTaskEmitters } from "next-vibe/tasks/cron/emitter";
import { CronTasksRepository } from "next-vibe/tasks/cron/repository";
import { resolveTaskOwnerUser } from "next-vibe/tasks/cron/resolve-task-user";
import {
  scopedTranslation,
  scopedTranslation as tasksScopedTranslation,
} from "next-vibe/tasks/i18n";
import type { PulseStatusResponseOutput } from "next-vibe/tasks/pulse/status/definition";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { env } from "@/config/env";

import { isCronTaskDue } from "../cron-formatter";
import {
  CronTaskStatus,
  type CronTaskStatusValue,
  getPriorityWeight,
  PulseExecutionStatus,
  PulseHealthStatus,
} from "../enum";
import type {
  NewPulseExecution,
  NewPulseHealth,
  PulseExecution,
  PulseHealth,
} from "./db";
import { pulseExecutions, pulseHealth } from "./db";
import { resolveTaskDisplayName } from "./i18n-utils";

/**
 * Implementation of Pulse Health Repository
 */
export class PulseHealthRepository {
  private static async getCurrentHealth(
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

  private static async updateHealth(
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

  private static async createHealthRecord(
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

  private static async createExecution(
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
        await import("@/app/api/[locale]/remote-connection/repository");
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
      const seenTaskIds = new Set<string>();

      // Two-pass approach: run scheduled tasks first, then pick up any tasks
      // that were inserted during this pulse cycle.
      // Pass 1: tasks that existed before the pulse started (respect schedule).
      // Pass 2: tasks created after pulseStart with no execution status yet
      //         (run-once delegated tasks - these are always due immediately).
      const passes = [
        // Pass 1: normal scheduled tasks
        await db
          .select()
          .from(cronTasksTable)
          .where(and(...whereConditions)),
        // Pass 2: tasks created during this pulse.
        // Fetched after pass 1 runs, so they exist in DB by the time we process them.
        // Using a lazy getter so it only executes after the first pass completes.
      ] as (typeof cronTasksTable.$inferSelect)[][];

      const allTasks = passes[0];

      for (let pass = 0; pass < 2; pass++) {
        let passTasks: (typeof cronTasksTable.$inferSelect)[];
        if (pass === 0) {
          passTasks = allTasks;
        } else {
          // Fetch tasks that appeared during this pulse cycle
          passTasks = await db
            .select()
            .from(cronTasksTable)
            .where(
              and(
                eq(cronTasksTable.enabled, true),
                isNull(cronTasksTable.lastExecutionStatus),
                gt(cronTasksTable.createdAt, now),
                ...(options.taskNames && options.taskNames.length > 0
                  ? [inArray(cronTasksTable.routeId, options.taskNames)]
                  : []),
              ),
            );
          if (passTasks.length > 0) {
            logger.debug(
              `Pulse pass 2: executing ${passTasks.length} tasks inserted during this cycle`,
            );
          }
        }

        // Sort by priority: CRITICAL first, BACKGROUND last
        passTasks.sort(
          (a, b) =>
            getPriorityWeight(b.priority) - getPriorityWeight(a.priority),
        );

        // Discover which tasks are due
        for (const dbTask of passTasks) {
          if (seenTaskIds.has(dbTask.id)) {
            continue;
          }
          seenTaskIds.add(dbTask.id);
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
          const cachedAdmin = adminAuthResult?.success
            ? adminAuthResult.data
            : null;
          const taskUserContext = await resolveTaskOwnerUser(
            dbUserIdToOwner(dbTask.userId),
            options.systemLocale,
            logger,
            cachedAdmin,
          );

          if (!taskUserContext) {
            tasksFailed.push(dbTask.displayName);
            const failedOwner = dbUserIdToOwner(dbTask.userId);
            logger.error(
              `Pulse: failed to resolve user context for task "${dbTask.displayName}"${
                failedOwner.type === "user"
                  ? ` (userId: ${failedOwner.userId})`
                  : " (check VIBE_ADMIN_USER_EMAIL)"
              }`,
            );
            continue;
          }

          const { user: cronUser, locale: userLocale } = taskUserContext;
          const { t: tTask } = scopedTranslation.scopedT(userLocale);
          const resolvedTaskName = resolveTaskDisplayName(
            dbTask.displayName,
            userLocale,
          );
          const startedAt = new Date();

          // Emit task-updated (RUNNING) to WS subscribers
          {
            const { emitTaskList, emitTaskQueue } = createTaskEmitters(
              logger,
              cronUser,
            );
            const runningPayload = {
              tasks: [
                {
                  id: dbTask.id,
                  lastExecutionStatus: CronTaskStatus.RUNNING,
                  enabled: dbTask.runOnce ? false : dbTask.enabled,
                },
              ],
            };
            emitTaskList("task-updated", { responseData: runningPayload });
            emitTaskQueue("task-updated", { responseData: runningPayload });
          }

          // Resolve routeId → endpoint path → handler
          const path = getFullPath(dbTask.routeId);
          const handler = path
            ? await import("@/generated/routes/handlers").then((m) =>
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
              let finalStatus: typeof CronTaskStatusValue =
                CronTaskStatus.FAILED;
              let finalMessage: string | null = null;
              let finalMessageParams:
                | Record<string, string | number | boolean>
                | undefined;
              let finalDurationMs = 0;
              let didLogHistory = false;

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
                      cronTaskId: dbTask.id,
                      streamContext: {
                        // Cron tasks never carry the context explicitly — a
                        // revival adopts the THREAD anchor at stream setup.
                        rootFolderId: DefaultFolderId.BACKGROUND,
                        threadId: undefined,
                        // no user context — UTC (dates not user-facing here)
                        timezone: "UTC",
                        aiMessageId: undefined,
                        currentToolMessageId: undefined,
                        callerToolCallId: undefined,
                        pendingToolMessages: undefined,
                        duplicateToolCallKeys: undefined,
                        executeClaimCount: undefined,
                        pendingTimeoutMs: undefined,
                        leafMessageId: undefined,
                        skillId: undefined,
                        favoriteId: undefined,
                        headless: undefined,
                        subAgentDepth: 0,
                        isRevival: undefined,
                        waitingForRemoteResult: undefined,
                        voiceEnabled: false,
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
                  const execResponse =
                    await CronTasksRepository.createExecution(
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
                  break;
                }

                finalStatus = attemptStatus;
                finalMessage = typedResult.message ?? null;
                finalMessageParams = typedResult.messageParams;

                const logMessage = finalMessage
                  ? finalMessageParams
                    ? finalMessage.replace(
                        /\{\{(\w+)\}\}/g,
                        (match, key: string) =>
                          String(finalMessageParams?.[key] ?? match),
                      )
                    : finalMessage
                  : null;

                if (attempt < maxRetries) {
                  logger.warn(
                    `Pulse: task "${resolvedTaskName}" failed (attempt ${attempt + 1}/${maxRetries + 1}), will retry`,
                    { message: logMessage },
                  );
                } else {
                  logger.error(
                    `Pulse: task "${resolvedTaskName}" failed after ${maxRetries + 1} attempt(s)`,
                    { message: logMessage },
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

              // Emit task-updated (final status) to WS subscribers
              {
                const { emitTaskList, emitTaskQueue } = createTaskEmitters(
                  logger,
                  cronUser,
                );
                const completedPayload = {
                  tasks: [
                    {
                      id: dbTask.id,
                      lastExecutionStatus: finalStatus,
                      lastExecutedAt: startedAt.toISOString(),
                      lastExecutionDuration: finalDurationMs,
                      consecutiveFailures: newConsecutiveFailures,
                    },
                  ],
                };
                emitTaskList("task-updated", {
                  responseData: completedPayload,
                });
                emitTaskQueue("task-updated", {
                  responseData: completedPayload,
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

              // Emit task-updated (FAILED) to WS subscribers
              {
                const { emitTaskList, emitTaskQueue } = createTaskEmitters(
                  logger,
                  cronUser,
                );
                const failedPayload = {
                  tasks: [
                    {
                      id: dbTask.id,
                      lastExecutionStatus: CronTaskStatus.FAILED,
                      consecutiveFailures: catchConsecutiveFailures,
                    },
                  ],
                };
                emitTaskList("task-updated", { responseData: failedPayload });
                emitTaskQueue("task-updated", { responseData: failedPayload });
              }
            }
          }
        } // end for dbTask
      } // end for pass

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
  private static async recordPulseExecution(
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
