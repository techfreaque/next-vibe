/**
 * Task Watchdog Repository
 * Server-only. Sweep (stuck / looping / orphaned tasks), manual cancel,
 * incident resolution, health snapshot and budget caps.
 *
 * Hot-path checks (spend ledger, per-step guard, incident recording) live in
 * guard.ts so the AI stream can import them without pulling in this file.
 */

import "server-only";

import { and, desc, eq, gte, inArray, isNull, lt, ne, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  failInline,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { getEndpoint } from "@/generated/endpoints/endpoint";

import { StreamControl } from "../../agent/ai-stream/repository/core/stream-control";
import { cronTaskExecutions, type CronTaskRow, cronTasks } from "../cron/db";
import { CronTaskStatus, type CronTaskStatusValue } from "../enum";
import { scopedTranslation as tasksScopedTranslation } from "../i18n";
import type { BudgetCapsGetResponseOutput } from "./budget-caps/definition";
import type {
  BudgetCapSetRequestOutput,
  BudgetCapSetResponseOutput,
} from "./budget-caps/definition";
import type {
  TaskCancelRequestOutput,
  TaskCancelResponseOutput,
} from "./cancel/definition";
import {
  maxDurationFor,
  TASK_WATCHDOG_CONFIG,
  TASK_WATCHDOG_SELF_ID,
} from "./config";
import { taskBudgetCaps, taskIncidents, taskSpendLedger } from "./db";
import {
  BudgetScope,
  TaskIncidentType,
  type TaskIncidentTypeValue,
} from "./enum";
import { TaskGuard } from "./guard";
import type { TaskHealthGetResponseOutput } from "./health/definition";
import type { WatchdogT } from "./i18n";
import {
  detectErrorLoop,
  type ExecutionSample,
  normalizeErrorMessage,
} from "./policy";
import { RunningTaskRegistry } from "./registry";
import type { TaskWatchdogSweepResponseOutput } from "./sweep/definition";

/** Statuses a finished run can be reported as failed under. */
const FAILED_STATUSES = [
  CronTaskStatus.FAILED,
  CronTaskStatus.ERROR,
  CronTaskStatus.TIMEOUT,
  CronTaskStatus.CANCELLED,
] as const;

const HEALTH_FAILURE_WINDOW_MS = 24 * 60 * 60 * 1000;
const HEALTH_LIST_LIMIT = 25;

export class TaskWatchdogRepository {
  // ─── Stop one task ────────────────────────────────────────────────────────

  /**
   * Stop a RUNNING task: abort the local run (if this process holds it),
   * cancel its AI streams wherever they run, and move the row to a terminal
   * status. A run nobody holds (process died) is recovered by row alone.
   * Returns whether this process held the run.
   */
  private static async stopTask(
    row: CronTaskRow,
    params: {
      status: typeof CronTaskStatusValue;
      reason: string;
      /** false when TaskGuard.check already opened the incident */
      incident: { type: typeof TaskIncidentTypeValue } | null;
    },
    user: JwtPayloadType,
    logger: EndpointLogger,
    now: Date,
  ): Promise<{ hadLocalRun: boolean }> {
    const since = row.runStartedAt ?? row.updatedAt;
    const hadLocalRun = RunningTaskRegistry.cancel(row.id, params.reason);

    const threadIds = await TaskGuard.taskThreadIds(row.id, since);
    for (const threadId of threadIds) {
      StreamControl.deliver(threadId, "cancel", user, logger);
    }

    const durationMs = now.getTime() - since.getTime();
    const updated = await db
      .update(cronTasks)
      .set({
        lastExecutionStatus: params.status,
        lastExecutionDuration: durationMs,
        runStartedAt: null,
        executionCount: sql`${cronTasks.executionCount} + 1`,
        errorCount: sql`${cronTasks.errorCount} + 1`,
        consecutiveFailures: sql`${cronTasks.consecutiveFailures} + 1`,
        updatedAt: now,
      })
      .where(
        and(
          eq(cronTasks.id, row.id),
          eq(cronTasks.lastExecutionStatus, CronTaskStatus.RUNNING),
        ),
      )
      .returning({ id: cronTasks.id });

    // A run this process holds writes its own CANCELLED history row when its
    // handler unwinds; only a run nobody holds needs one here.
    if (updated.length > 0 && !hadLocalRun) {
      try {
        await db.insert(cronTaskExecutions).values({
          taskId: row.id,
          taskName: row.displayName,
          executionId: crypto.randomUUID(),
          status: params.status,
          priority: row.priority,
          startedAt: since,
          completedAt: now,
          durationMs,
          config: row.taskInput,
          error: failInline({
            message: params.reason,
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          }),
          triggeredBy: "task-watchdog",
        });
      } catch (error) {
        logger.error("[TaskWatchdog] Failed to write execution history", {
          ...parseError(error),
          taskId: row.id,
        });
      }
    }

    if (params.incident) {
      await TaskGuard.recordIncident(
        {
          taskId: row.id,
          taskName: row.displayName,
          type: params.incident.type,
          reason: params.reason,
          metadata: {
            ageMs: durationMs,
            hadLocalRun,
            threadsCancelled: threadIds.length,
            routeId: row.routeId,
          },
        },
        logger,
      );
    }

    logger.warn("[TaskWatchdog] Task stopped", {
      taskId: row.id,
      taskName: row.displayName,
      status: params.status,
      reason: params.reason,
      hadLocalRun,
      threadsCancelled: threadIds.length,
    });
    return { hadLocalRun };
  }

  // ─── Sweep ────────────────────────────────────────────────────────────────

  static async sweep(
    user: JwtPayloadType,
    logger: EndpointLogger,
    now: Date = new Date(),
  ): Promise<ResponseType<TaskWatchdogSweepResponseOutput>> {
    const result = {
      checked: 0,
      cancelled: 0,
      orphaned: 0,
      loops: 0,
      incidents: 0,
    };
    try {
      const running = await db
        .select()
        .from(cronTasks)
        .where(eq(cronTasks.lastExecutionStatus, CronTaskStatus.RUNNING));
      result.checked = running.length;

      for (const row of running) {
        // The watchdog never judges its own (currently executing) run.
        if (row.id === TASK_WATCHDOG_SELF_ID) {
          continue;
        }
        // Rows that were already RUNNING before runStartedAt existed: adopt
        // updatedAt (claim time) as the start so they age normally.
        if (row.runStartedAt === null) {
          await db
            .update(cronTasks)
            .set({ runStartedAt: row.updatedAt })
            .where(eq(cronTasks.id, row.id));
          row.runStartedAt = row.updatedAt;
        }
        const verdict = await TaskGuard.check(row.id, logger, now);
        if (verdict.ok) {
          continue;
        }
        const isTimeout = verdict.incidentType === TaskIncidentType.TIMEOUT;
        const { hadLocalRun } = await TaskWatchdogRepository.stopTask(
          row,
          {
            status: isTimeout
              ? CronTaskStatus.TIMEOUT
              : CronTaskStatus.CANCELLED,
            reason: verdict.reason,
            // check() opened the cause incident, except when it failed closed
            incident:
              verdict.incidentType === TaskIncidentType.WATCHDOG_CANCEL
                ? { type: TaskIncidentType.WATCHDOG_CANCEL }
                : null,
          },
          user,
          logger,
          now,
        );
        result.cancelled++;
        result.incidents++;
        if (!hadLocalRun) {
          result.orphaned++;
        }
      }

      result.loops = await TaskWatchdogRepository.disableErrorLoops(
        logger,
        now,
      );
      result.incidents += result.loops;

      await TaskWatchdogRepository.purgeOld(logger, now);

      if (result.cancelled > 0 || result.loops > 0) {
        logger.warn("[TaskWatchdog] Sweep acted", result);
      } else {
        logger.debug("[TaskWatchdog] Sweep clean", result);
      }
      return success(result);
    } catch (error) {
      logger.error("[TaskWatchdog] Sweep failed", parseError(error));
      return failInline({
        message: "Task watchdog sweep failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * A scheduled task that keeps failing with the same error on its last N
   * runs is a retry loop: disable it (re-enable by hand once fixed).
   */
  private static async disableErrorLoops(
    logger: EndpointLogger,
    now: Date,
  ): Promise<number> {
    const { consecutiveSameError } = TASK_WATCHDOG_CONFIG.errorLoop;
    const candidates = await db
      .select()
      .from(cronTasks)
      .where(
        and(
          eq(cronTasks.enabled, true),
          eq(cronTasks.runOnce, false),
          ne(cronTasks.lastExecutionStatus, CronTaskStatus.RUNNING),
          sql`${cronTasks.consecutiveFailures} >= ${consecutiveSameError}`,
        ),
      );

    let disabled = 0;
    for (const task of candidates) {
      const recent = await db
        .select({
          status: cronTaskExecutions.status,
          error: cronTaskExecutions.error,
          startedAt: cronTaskExecutions.startedAt,
        })
        .from(cronTaskExecutions)
        .where(
          and(
            eq(cronTaskExecutions.taskId, task.id),
            // one entry per RUN, not per retry attempt
            eq(cronTaskExecutions.retryAttempt, 0),
          ),
        )
        .orderBy(desc(cronTaskExecutions.startedAt))
        .limit(consecutiveSameError);

      const samples: ExecutionSample[] = recent.map((e) => ({
        status: e.status,
        errorMessage:
          e.status === CronTaskStatus.COMPLETED || !e.error?.message
            ? null
            : normalizeErrorMessage(e.error.message),
        startedAt: e.startedAt,
      }));
      const loop = detectErrorLoop(samples, now);
      if (!loop.loop) {
        continue;
      }
      await db
        .update(cronTasks)
        .set({ enabled: false, updatedAt: now })
        .where(eq(cronTasks.id, task.id));
      await TaskGuard.recordIncident(
        {
          taskId: task.id,
          taskName: task.displayName,
          type: TaskIncidentType.LOOP,
          reason: `Failed ${loop.count} runs in a row with the same error - task disabled: ${loop.message}`,
          metadata: { runs: loop.count, routeId: task.routeId, disabled: true },
        },
        logger,
      );
      disabled++;
    }
    return disabled;
  }

  private static async purgeOld(
    logger: EndpointLogger,
    now: Date,
  ): Promise<void> {
    const cutoff = new Date(
      now.getTime() - TASK_WATCHDOG_CONFIG.retentionDays * 24 * 60 * 60 * 1000,
    );
    try {
      await db
        .delete(taskSpendLedger)
        .where(lt(taskSpendLedger.createdAt, cutoff));
      await db
        .delete(taskIncidents)
        .where(
          and(
            lt(taskIncidents.createdAt, cutoff),
            sql`${taskIncidents.resolvedAt} is not null`,
          ),
        );
    } catch (error) {
      logger.warn("[TaskWatchdog] Retention purge failed", parseError(error));
    }
  }

  // ─── Manual cancel / resolve ──────────────────────────────────────────────

  static async cancelOrResolve(
    data: TaskCancelRequestOutput,
    user: JwtPayloadType,
    t: WatchdogT,
    logger: EndpointLogger,
  ): Promise<ResponseType<TaskCancelResponseOutput>> {
    if (!data.taskId && !data.incidentId) {
      return fail({
        message: t("errors.nothingToDo"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    try {
      let cancelled = false;
      let resolved = false;

      if (data.taskId) {
        const [row] = await db
          .select()
          .from(cronTasks)
          .where(
            and(
              eq(cronTasks.id, data.taskId),
              eq(cronTasks.lastExecutionStatus, CronTaskStatus.RUNNING),
            ),
          )
          .limit(1);
        if (!row) {
          return fail({
            message: t("errors.taskNotRunning", { taskId: data.taskId }),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        await TaskWatchdogRepository.stopTask(
          row,
          {
            status: CronTaskStatus.CANCELLED,
            reason: "Cancelled by an admin",
            incident: { type: TaskIncidentType.WATCHDOG_CANCEL },
          },
          user,
          logger,
          new Date(),
        );
        cancelled = true;
      }

      if (data.incidentId) {
        const updated = await db
          .update(taskIncidents)
          .set({ resolvedAt: new Date() })
          .where(
            and(
              eq(taskIncidents.id, data.incidentId),
              isNull(taskIncidents.resolvedAt),
            ),
          )
          .returning({ id: taskIncidents.id });
        if (updated.length === 0) {
          return fail({
            message: t("errors.incidentNotFound", {
              incidentId: data.incidentId,
            }),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        resolved = true;
      }
      return success({ cancelled, resolved });
    } catch (error) {
      logger.error("[TaskWatchdog] Cancel / resolve failed", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ─── Health ───────────────────────────────────────────────────────────────

  /**
   * System tasks store scoped translation keys as their display name
   * ("updateAllModelPrices.name"): resolve each through its own endpoint's
   * scope, fall back to the raw value.
   */
  private static async translateNames(
    items: ReadonlyArray<{ taskId: string; name: string }>,
    locale: CountryLanguage,
  ): Promise<Map<string, string>> {
    const out = new Map<string, string>();
    const ids = [...new Set(items.map((i) => i.taskId))];
    if (ids.length === 0) {
      return out;
    }
    const routes = await db
      .select({ id: cronTasks.id, routeId: cronTasks.routeId })
      .from(cronTasks)
      .where(inArray(cronTasks.id, ids));
    const routeById = new Map(routes.map((r) => [r.id, r.routeId]));
    for (const item of items) {
      const routeId = routeById.get(item.taskId);
      const endpoint = routeId ? await getEndpoint(routeId) : null;
      const translated = endpoint
        ? endpoint.scopedTranslation.scopedT(locale).t(item.name)
        : item.name;
      out.set(`${item.taskId}\u0000${item.name}`, translated);
    }
    return out;
  }

  static async health(
    locale: CountryLanguage,
    t: WatchdogT,
    logger: EndpointLogger,
    now: Date = new Date(),
  ): Promise<ResponseType<TaskHealthGetResponseOutput>> {
    try {
      const runningRows = await db
        .select()
        .from(cronTasks)
        .where(eq(cronTasks.lastExecutionStatus, CronTaskStatus.RUNNING));

      const starts = runningRows.map((r) =>
        (r.runStartedAt ?? r.updatedAt).getTime(),
      );
      const earliest = new Date(
        starts.length > 0 ? Math.min(...starts) : now.getTime(),
      );
      const [stats, failures, incidents, daySpent, caps] = await Promise.all([
        TaskGuard.statsForTasks(
          runningRows.map((r) => r.id),
          earliest,
        ),
        db
          .select({
            id: cronTaskExecutions.id,
            taskId: cronTaskExecutions.taskId,
            name: cronTaskExecutions.taskName,
            status: cronTaskExecutions.status,
            completedAt: cronTaskExecutions.completedAt,
            startedAt: cronTaskExecutions.startedAt,
            durationMs: cronTaskExecutions.durationMs,
            error: cronTaskExecutions.error,
          })
          .from(cronTaskExecutions)
          .where(
            and(
              inArray(cronTaskExecutions.status, [...FAILED_STATUSES]),
              gte(
                cronTaskExecutions.startedAt,
                new Date(now.getTime() - HEALTH_FAILURE_WINDOW_MS),
              ),
            ),
          )
          .orderBy(desc(cronTaskExecutions.startedAt))
          .limit(HEALTH_LIST_LIMIT),
        db
          .select()
          .from(taskIncidents)
          .where(isNull(taskIncidents.resolvedAt))
          .orderBy(desc(taskIncidents.createdAt))
          .limit(HEALTH_LIST_LIMIT),
        TaskGuard.daySpend(now),
        TaskGuard.loadCaps(),
      ]);

      const { t: tasksT } = tasksScopedTranslation.scopedT(locale);
      const names = await TaskWatchdogRepository.translateNames(
        [
          ...runningRows.map((r) => ({ taskId: r.id, name: r.displayName })),
          ...failures.map((f) => ({ taskId: f.taskId, name: f.name })),
          ...incidents.map((i) => ({ taskId: i.taskId, name: i.taskName })),
        ],
        locale,
      );
      const nameOf = (taskId: string, name: string): string =>
        names.get(`${taskId}\u0000${name}`) ?? name;

      const dayCap =
        caps.find(
          (c) =>
            c.scope === BudgetScope.DAY &&
            c.key === TASK_WATCHDOG_CONFIG.globalKey,
        )?.maxCredits ?? TASK_WATCHDOG_CONFIG.budgetDefaults.perDayCredits;

      return success({
        running: runningRows.map((r) => {
          const startedAt = r.runStartedAt ?? r.updatedAt;
          const s = stats.get(r.id);
          const goalTag = r.tags.find((tag) =>
            tag.startsWith(TASK_WATCHDOG_CONFIG.goalTagPrefix),
          );
          return {
            id: r.id,
            name: nameOf(r.id, r.displayName),
            routeId: r.routeId,
            goal: goalTag
              ? goalTag.slice(TASK_WATCHDOG_CONFIG.goalTagPrefix.length)
              : null,
            startedAt: startedAt.toISOString(),
            ageMs: now.getTime() - startedAt.getTime(),
            limitMs: maxDurationFor(r.routeId, r.timeout),
            turns: s?.turns ?? 0,
            toolCalls: s?.toolCalls ?? 0,
            spend: s?.spend ?? 0,
          };
        }),
        failures: failures.map((f) => ({
          id: f.id,
          taskId: f.taskId,
          name: nameOf(f.taskId, f.name),
          status: tasksT(f.status),
          finishedAt: (f.completedAt ?? f.startedAt).toISOString(),
          durationMs: f.durationMs,
          lastError: f.error?.message ?? null,
        })),
        incidents: incidents.map((i) => ({
          id: i.id,
          taskId: i.taskId,
          taskName: nameOf(i.taskId, i.taskName),
          type: i.type,
          reason: i.reason,
          createdAt: i.createdAt.toISOString(),
        })),
        daySpent,
        dayCap,
      });
    } catch (error) {
      logger.error("[TaskWatchdog] Health snapshot failed", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ─── Budget caps ──────────────────────────────────────────────────────────

  static async listCaps(
    t: WatchdogT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BudgetCapsGetResponseOutput>> {
    try {
      const rows = await db
        .select({
          id: taskBudgetCaps.id,
          scope: taskBudgetCaps.scope,
          key: taskBudgetCaps.key,
          maxCredits: taskBudgetCaps.maxCredits,
          enabled: taskBudgetCaps.enabled,
          note: taskBudgetCaps.note,
        })
        .from(taskBudgetCaps)
        .orderBy(taskBudgetCaps.scope, taskBudgetCaps.key);
      const daySpent = await TaskGuard.daySpend(new Date());
      return success({ rows, daySpent });
    } catch (error) {
      logger.error("[TaskWatchdog] Failed to list caps", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** Upsert on (scope, key). */
  static async setCap(
    data: BudgetCapSetRequestOutput,
    t: WatchdogT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BudgetCapSetResponseOutput>> {
    if (!(data.maxCredits >= 0) || data.key.trim().length === 0) {
      return fail({
        message: t("errors.invalidCap"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    try {
      const [row] = await db
        .insert(taskBudgetCaps)
        .values({
          scope: data.scope,
          key: data.key.trim(),
          maxCredits: data.maxCredits,
          enabled: data.enabled,
          note: data.note ?? null,
        })
        .onConflictDoUpdate({
          target: [taskBudgetCaps.scope, taskBudgetCaps.key],
          set: {
            maxCredits: data.maxCredits,
            enabled: data.enabled,
            note: data.note ?? null,
            updatedAt: new Date(),
          },
        })
        .returning({ id: taskBudgetCaps.id });
      return success({ id: row.id });
    } catch (error) {
      logger.error("[TaskWatchdog] Failed to set cap", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
