/**
 * Pulse Health Repository
 * Database operations for pulse health monitoring
 * Following interface + implementation pattern
 */

import { and, desc, eq, gt, inArray, isNull, ne, or, sql } from "drizzle-orm";
import { DefaultFolderId } from "next-vibe/core/execution-context";

import { getFullPath } from "../../core/core-utils/path";
import type { CountryLanguage } from "../../core/i18n/core/config";
import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  failInline,
  isContentResponse,
  isFileResponse,
  isStreamingResponse,
  success,
} from "../../core/route/response.schema";
import { parseError } from "../../core/utils/parse-error";
import { db } from "../../database";
import { AuthRepository } from "../../identity/auth/repository";
import { identityEnv } from "../../identity/env";
import type { EndpointLogger } from "../../logger/types";
import { Platform } from "../../platforms/platforms";
import { isDrainRequested } from "../../platforms/web/drain";
import { splitTaskArgs } from "../cron/arg-splitter";
import { cronTasks as cronTasksTable, dbUserIdToOwner } from "../cron/db";
import { createTaskEmitters } from "../cron/emitter";
import { CronTasksRepository } from "../cron/repository";
import { resolveTaskOwnerUser } from "../cron/resolve-task-user";
import { isCronTaskDue } from "../cron-formatter";
import {
  CronTaskStatus,
  type CronTaskStatusValue,
  getPriorityWeight,
  PulseExecutionStatus,
  PulseHealthStatus,
} from "../enum";
import {
  scopedTranslation,
  scopedTranslation as tasksScopedTranslation,
} from "../i18n";
import { TaskIncidentType } from "../watchdog/enum";
import { TaskGuard } from "../watchdog/guard";
import {
  decideRetry,
  isInsufficientCreditsFailure,
  type RetryDecision,
} from "../watchdog/policy";
import { RunningTaskRegistry } from "../watchdog/registry";
import type {
  NewPulseExecution,
  NewPulseHealth,
  PulseExecution,
  PulseHealth,
} from "./db";
import { pulseExecutions, pulseHealth } from "./db";
import { resolveTaskDisplayName } from "./i18n-utils";
import type { PulseStatusResponseOutput } from "./status/definition";

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
        await import("../../remote-connection/repository");
      const instanceId =
        RemoteConnectionRepository.deriveDefaultSelfInstanceId();

      const tasksDue: string[] = [];
      const tasksExecuted: string[] = [];
      const tasksSucceeded: string[] = [];
      const tasksFailed: string[] = [];
      const tasksSkipped: string[] = [];
      const drainRequested = !options.force && isDrainRequested();
      if (drainRequested) {
        logger.info("Pulse: node is draining, not claiming new tasks");
      }

      // Resolve admin user for system tasks (cached for entire pulse cycle)
      const adminEmail = identityEnv.VIBE_ADMIN_USER_EMAIL;
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
            options.force ||
            isCronTaskDue(
              logger,
              dbTask.schedule,
              now,
              dbTask.lastExecutedAt,
              // runOnce = "fire once at the next scheduled time", never at boot.
              dbTask.runOnce ? dbTask.createdAt : null,
            );
          if (!isDue) {
            tasksSkipped.push(dbTask.displayName);
            continue;
          }

          // Deploy drain / shutdown: claim nothing new. The task stays due
          // (lastExecutedAt unchanged), so the next node up runs it.
          if (drainRequested) {
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
                runStartedAt: new Date(),
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
              let finalDurationMs = 0;
              let didLogHistory = false;
              // Owner's wallet cannot pay for the run: SKIPPED, not FAILED.
              let skippedForCredits = false;
              // Already skipped for credits last run: stay quiet (no history
              // row, debug log) until the owner tops up.
              const wasSkippedBefore =
                dbTask.lastExecutionStatus === CronTaskStatus.SKIPPED;

              for (let attempt = 0; ; attempt++) {
                const attemptStart = Date.now();
                const taskAbortController = new AbortController();
                // The watchdog / an admin cancels a run through this entry.
                RunningTaskRegistry.register(dbTask.id, taskAbortController);
                let timedOut = false;
                let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
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
                      toolExecutionContext: {
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
                        // Spend / turn / budget accounting is keyed on this
                        cronTaskId: dbTask.id,
                        abortSignal: taskAbortController.signal,
                        callerCallbackMode: undefined,
                        escalateToTask: undefined,
                        onEscalatedTaskCancel: undefined,
                      },
                    }),
                    new Promise<never>((...[, reject]) => {
                      timeoutHandle = setTimeout(() => {
                        // Abort the run itself: rejecting alone leaves the
                        // handler (an AI loop) running and billing forever.
                        timedOut = true;
                        taskAbortController.abort(new Error("TASK_TIMEOUT"));
                        reject(new Error("TASK_TIMEOUT"));
                      }, timeoutMs);
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
                  typedResult = fail({
                    message: tTask("errors.repositoryInternalError"),
                    errorType: ErrorResponseTypes.INTERNAL_ERROR,
                  });
                  finalStatus =
                    timedOut ||
                    (err instanceof Error && err.message === "TASK_TIMEOUT")
                      ? CronTaskStatus.TIMEOUT
                      : CronTaskStatus.FAILED;
                } finally {
                  if (timeoutHandle !== undefined) {
                    clearTimeout(timeoutHandle);
                  }
                }

                // Cancelled by the watchdog / an admin: finish as CANCELLED and
                // never retry - the run was stopped on purpose.
                const cancelReason = RunningTaskRegistry.unregister(
                  dbTask.id,
                  taskAbortController,
                );
                if (cancelReason !== null) {
                  typedResult = failInline({
                    message: cancelReason,
                    errorType: ErrorResponseTypes.INTERNAL_ERROR,
                  });
                  finalStatus = CronTaskStatus.CANCELLED;
                }

                const attemptDuration = Date.now() - attemptStart;
                const creditSkip =
                  !typedResult.success &&
                  cancelReason === null &&
                  isInsufficientCreditsFailure(typedResult.errorType.errorKey);
                const attemptStatus: typeof CronTaskStatusValue =
                  typedResult.success
                    ? CronTaskStatus.COMPLETED
                    : creditSkip
                      ? CronTaskStatus.SKIPPED
                      : finalStatus === CronTaskStatus.TIMEOUT
                        ? CronTaskStatus.TIMEOUT
                        : finalStatus === CronTaskStatus.CANCELLED
                          ? CronTaskStatus.CANCELLED
                          : CronTaskStatus.FAILED;

                // History throttle: skip logging successful runs when within historyInterval
                const shouldLogHistory = creditSkip
                  ? !wasSkippedBefore
                  : !typedResult.success ||
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

                // Already fully interpolated by the failing handler's `t()` call,
                // so there are no `{{param}}` placeholders left to substitute.
                const logMessage = finalMessage;

                if (creditSkip) {
                  // Never retried, never counted as a failure. Logged once per
                  // empty-wallet streak; the next due run after a top-up
                  // simply succeeds.
                  skippedForCredits = true;
                  (wasSkippedBefore ? logger.debug : logger.info).bind(logger)(
                    `Pulse: task "${resolvedTaskName}" skipped - insufficient credits or budget cap reached`,
                    { message: logMessage, taskId: dbTask.id },
                  );
                  break;
                }

                // Retry only TRANSIENT failures (provider 5xx / rate limit /
                // network), with capped exponential backoff. Validation,
                // permission and credit failures, timeouts and watchdog
                // cancels fail immediately.
                const decision: RetryDecision =
                  cancelReason !== null
                    ? { retry: false, exhausted: false }
                    : decideRetry({
                        attempt,
                        taskMaxRetries: maxRetries,
                        baseDelayMs: retryDelayMs,
                        failure: {
                          errorKey: typedResult.errorType.errorKey,
                          message: logMessage ?? "",
                          timedOut: finalStatus === CronTaskStatus.TIMEOUT,
                        },
                      });

                if (decision.retry) {
                  logger.warn(
                    `Pulse: task "${resolvedTaskName}" failed transiently (attempt ${attempt + 1}), retrying in ${decision.delayMs}ms`,
                    { message: logMessage, taskId: dbTask.id },
                  );
                  await new Promise<void>((resolve) => {
                    setTimeout(resolve, decision.delayMs);
                  });
                  continue;
                }

                logger.error(
                  `Pulse: task "${resolvedTaskName}" failed after ${attempt + 1} attempt(s)`,
                  { message: logMessage, taskId: dbTask.id },
                );
                if (
                  cancelReason === null &&
                  finalStatus === CronTaskStatus.TIMEOUT
                ) {
                  await TaskGuard.recordIncident(
                    {
                      taskId: dbTask.id,
                      taskName: resolvedTaskName,
                      type: TaskIncidentType.TIMEOUT,
                      reason: `Run exceeded its ${timeoutMs}ms timeout and was aborted`,
                      metadata: { timeoutMs, attempt: attempt + 1 },
                    },
                    logger,
                  );
                } else if (cancelReason === null && decision.exhausted) {
                  await TaskGuard.recordIncident(
                    {
                      taskId: dbTask.id,
                      taskName: resolvedTaskName,
                      type: TaskIncidentType.TRANSIENT_RETRY_EXHAUSTED,
                      reason: `Transient failure persisted through ${attempt + 1} attempts: ${logMessage ?? ""}`,
                      metadata: { attempts: attempt + 1 },
                    },
                    logger,
                  );
                }
                break;
              }

              if (taskSucceeded) {
                tasksSucceeded.push(dbTask.displayName);
              } else if (skippedForCredits) {
                tasksSkipped.push(dbTask.displayName);
              } else {
                tasksFailed.push(dbTask.displayName);
              }

              // Update task stats (once, after all attempts). A credit skip
              // leaves the failure streak and counters untouched; only
              // lastExecutedAt moves so the task is not re-run every pulse.
              const newConsecutiveFailures = taskSucceeded
                ? 0
                : skippedForCredits
                  ? (dbTask.consecutiveFailures ?? 0)
                  : (dbTask.consecutiveFailures ?? 0) + 1;

              // Use atomic SQL increments to avoid lost updates across instances
              await db
                .update(cronTasksTable)
                .set({
                  lastExecutedAt: startedAt,
                  lastExecutionStatus: finalStatus,
                  lastExecutionDuration: finalDurationMs,
                  runStartedAt: null,
                  consecutiveFailures: newConsecutiveFailures,
                  ...(skippedForCredits
                    ? {}
                    : {
                        executionCount: sql`${cronTasksTable.executionCount} + 1`,
                        ...(taskSucceeded
                          ? {
                              successCount: sql`${cronTasksTable.successCount} + 1`,
                            }
                          : {
                              errorCount: sql`${cronTasksTable.errorCount} + 1`,
                            }),
                      }),
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
                  runStartedAt: null,
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
        message: t("errors.repositoryInternalErrorDetail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
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
