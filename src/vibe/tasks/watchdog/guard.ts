/**
 * Task Guard
 *
 * The hot-path half of the watchdog: records every billed step of a background
 * task in the spend ledger and checks run limits + budget caps right after it,
 * so a runaway loop stops at the step that crosses the line - not up to a
 * minute later when the sweep notices.
 *
 * Also owns incident recording (shared with the sweep and the retry loop).
 * Every incident is logged with logger.error: that is the alerting path - it
 * lands in error_logs and shows up in the Error Monitor like any production
 * error.
 */

import "server-only";

import { and, eq, gte, inArray, isNull, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  failInline,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { AbortReason } from "../../agent/ai-stream/repository/core/constants";
import { cronTasks } from "../cron/db";
import { maxDurationFor, TASK_WATCHDOG_CONFIG } from "./config";
import {
  type IncidentMetadata,
  taskBudgetCaps,
  type TaskIncidentRow,
  taskIncidents,
  taskSpendLedger,
} from "./db";
import {
  SpendKind,
  type SpendKindValue,
  TaskIncidentType,
  type TaskIncidentTypeValue,
} from "./enum";
import {
  type BudgetCap,
  evaluateBudget,
  evaluateRunLimits,
  resolveApplicableCaps,
} from "./policy";

export type GuardVerdict =
  | { ok: true }
  | {
      ok: false;
      /** BUDGET_EXCEEDED for caps, TASK_WATCHDOG for loop / duration ceilings */
      abortReason: AbortReason.BUDGET_EXCEEDED | AbortReason.TASK_WATCHDOG;
      incidentType: typeof TaskIncidentTypeValue;
      reason: string;
    };

export interface RunStats {
  turns: number;
  toolCalls: number;
  /** Credits spent by this task in the current run */
  spend: number;
}

/** Start of the current UTC day. */
export function utcDayStart(now: Date): Date {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

/** First goal:<name> tag on a task, or null. */
export function goalFromTags(tags: readonly string[]): string | null {
  const prefix = TASK_WATCHDOG_CONFIG.goalTagPrefix;
  const tag = tags.find(
    (t) => t.startsWith(prefix) && t.length > prefix.length,
  );
  return tag ? tag.slice(prefix.length) : null;
}

export class TaskGuard {
  // ─── Incidents ────────────────────────────────────────────────────────────

  /**
   * Open an incident and log it at error level (alerting path). An unresolved
   * incident of the same task + type is not duplicated - it gets a fresh log
   * line only, so a sweep that sees the same stuck task twice stays quiet.
   */
  static async recordIncident(
    params: {
      taskId: string;
      taskName: string;
      type: typeof TaskIncidentTypeValue;
      reason: string;
      metadata?: IncidentMetadata;
    },
    logger: EndpointLogger,
  ): Promise<ResponseType<TaskIncidentRow | null>> {
    const metadata = params.metadata ?? {};
    logger.error(
      `[TaskWatchdog] ${params.type.split(".").pop() ?? params.type}: ${params.reason}`,
      {
        taskId: params.taskId,
        taskName: params.taskName,
        incidentType: params.type,
        ...metadata,
      },
    );
    try {
      const [open] = await db
        .select({ id: taskIncidents.id })
        .from(taskIncidents)
        .where(
          and(
            eq(taskIncidents.taskId, params.taskId),
            eq(taskIncidents.type, params.type),
            isNull(taskIncidents.resolvedAt),
            gte(taskIncidents.createdAt, new Date(Date.now() - 60 * 60 * 1000)),
          ),
        )
        .limit(1);
      if (open) {
        return success(null);
      }
      const [row] = await db
        .insert(taskIncidents)
        .values({
          taskId: params.taskId,
          taskName: params.taskName,
          type: params.type,
          reason: params.reason,
          metadata,
        })
        .returning();
      return success(row);
    } catch (error) {
      logger.error(
        "[TaskWatchdog] Failed to persist incident",
        parseError(error),
      );
      return failInline({
        message: "Failed to persist task incident",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }

  // ─── Spend ledger ─────────────────────────────────────────────────────────

  static async recordSpend(
    params: {
      taskId: string;
      goal: string | null;
      threadId: string | null;
      kind: typeof SpendKindValue;
      amount: number;
    },
    logger: EndpointLogger,
  ): Promise<ResponseType<null>> {
    try {
      await db.insert(taskSpendLedger).values({
        taskId: params.taskId,
        goal: params.goal,
        threadId: params.threadId,
        kind: params.kind,
        amount: params.amount,
      });
      return success(null);
    } catch (error) {
      logger.error("[TaskWatchdog] Failed to record spend", {
        ...parseError(error),
        taskId: params.taskId,
      });
      return failInline({
        message: "Failed to record task spend",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }

  /** Turns / tool calls / spend of one task since `since`. */
  static async runStats(taskId: string, since: Date): Promise<RunStats> {
    const [row] = await db
      .select({
        turns: sql<number>`count(*) filter (where ${taskSpendLedger.kind} = ${SpendKind.MODEL})::int`,
        toolCalls: sql<number>`count(*) filter (where ${taskSpendLedger.kind} = ${SpendKind.TOOL})::int`,
        spend: sql<number>`coalesce(sum(${taskSpendLedger.amount}), 0)::float8`,
      })
      .from(taskSpendLedger)
      .where(
        and(
          eq(taskSpendLedger.taskId, taskId),
          gte(taskSpendLedger.createdAt, since),
        ),
      );
    return {
      turns: Number(row?.turns ?? 0),
      toolCalls: Number(row?.toolCalls ?? 0),
      spend: Number(row?.spend ?? 0),
    };
  }

  static async daySpend(now: Date): Promise<number> {
    const [row] = await db
      .select({
        spend: sql<number>`coalesce(sum(${taskSpendLedger.amount}), 0)::float8`,
      })
      .from(taskSpendLedger)
      .where(gte(taskSpendLedger.createdAt, utcDayStart(now)));
    return Number(row?.spend ?? 0);
  }

  static async goalSpend(goal: string, now: Date): Promise<number> {
    const [row] = await db
      .select({
        spend: sql<number>`coalesce(sum(${taskSpendLedger.amount}), 0)::float8`,
      })
      .from(taskSpendLedger)
      .where(
        and(
          eq(taskSpendLedger.goal, goal),
          gte(taskSpendLedger.createdAt, utcDayStart(now)),
        ),
      );
    return Number(row?.spend ?? 0);
  }

  /** Enabled cap rows. */
  static async loadCaps(): Promise<BudgetCap[]> {
    const rows = await db
      .select({
        scope: taskBudgetCaps.scope,
        key: taskBudgetCaps.key,
        maxCredits: taskBudgetCaps.maxCredits,
      })
      .from(taskBudgetCaps)
      .where(eq(taskBudgetCaps.enabled, true));
    return rows;
  }

  // ─── The check ────────────────────────────────────────────────────────────

  /**
   * Check a task against its run limits and every applicable cap.
   * Pure read + (on breach) one incident. `since` defaults to the task's
   * current run start.
   */
  static async check(
    taskId: string,
    logger: EndpointLogger,
    now: Date = new Date(),
  ): Promise<GuardVerdict> {
    try {
      const [task] = await db
        .select({
          displayName: cronTasks.displayName,
          routeId: cronTasks.routeId,
          tags: cronTasks.tags,
          timeout: cronTasks.timeout,
          runStartedAt: cronTasks.runStartedAt,
        })
        .from(cronTasks)
        .where(eq(cronTasks.id, taskId))
        .limit(1);
      const taskName = task?.displayName ?? taskId;
      const goal = task ? goalFromTags(task.tags) : null;
      const since = task?.runStartedAt ?? utcDayStart(now);

      const [stats, daySpent, goalSpent, caps] = await Promise.all([
        TaskGuard.runStats(taskId, since),
        TaskGuard.daySpend(now),
        goal === null ? Promise.resolve(null) : TaskGuard.goalSpend(goal, now),
        TaskGuard.loadCaps(),
      ]);

      const budget = evaluateBudget(resolveApplicableCaps(caps, taskId, goal), {
        task: stats.spend,
        day: daySpent,
        goal: goalSpent,
      });
      if (!budget.ok) {
        await TaskGuard.recordIncident(
          {
            taskId,
            taskName,
            type: TaskIncidentType.BUDGET,
            reason: budget.reason,
            metadata: {
              scope: budget.scope,
              capKey: budget.key,
              spent: budget.spent,
              cap: budget.cap,
              turns: stats.turns,
              toolCalls: stats.toolCalls,
            },
          },
          logger,
        );
        return {
          ok: false,
          abortReason: AbortReason.BUDGET_EXCEEDED,
          incidentType: TaskIncidentType.BUDGET,
          reason: budget.reason,
        };
      }

      const limits = evaluateRunLimits({
        ageMs: task?.runStartedAt
          ? now.getTime() - task.runStartedAt.getTime()
          : 0,
        maxDurationMs: maxDurationFor(
          task?.routeId ?? "",
          task?.timeout ?? null,
        ),
        turns: stats.turns,
        toolCalls: stats.toolCalls,
      });
      if (!limits.ok) {
        const type =
          limits.kind === "duration"
            ? TaskIncidentType.TIMEOUT
            : TaskIncidentType.LOOP;
        await TaskGuard.recordIncident(
          {
            taskId,
            taskName,
            type,
            reason: limits.reason,
            metadata: {
              limit: limits.kind,
              turns: stats.turns,
              toolCalls: stats.toolCalls,
              spend: stats.spend,
            },
          },
          logger,
        );
        return {
          ok: false,
          abortReason: AbortReason.TASK_WATCHDOG,
          incidentType: type,
          reason: limits.reason,
        };
      }
      return { ok: true };
    } catch (error) {
      // Fail closed: an unattended task must not run unmetered because the
      // guard could not read its own tables.
      const reason = "Task guard could not evaluate limits";
      logger.error(`[TaskWatchdog] ${reason} - stopping task`, {
        ...parseError(error),
        taskId,
      });
      return {
        ok: false,
        abortReason: AbortReason.TASK_WATCHDOG,
        incidentType: TaskIncidentType.WATCHDOG_CANCEL,
        reason,
      };
    }
  }

  /**
   * Called by the db-writer after every billed step of a background task:
   * ledger first (so the check sees this step), then the verdict.
   */
  static async afterBilledStep(
    params: {
      taskId: string;
      threadId: string | null;
      kind: typeof SpendKindValue;
      amount: number;
    },
    logger: EndpointLogger,
  ): Promise<GuardVerdict> {
    const [task] = await db
      .select({ tags: cronTasks.tags })
      .from(cronTasks)
      .where(eq(cronTasks.id, params.taskId))
      .limit(1);
    await TaskGuard.recordSpend(
      {
        taskId: params.taskId,
        goal: task ? goalFromTags(task.tags) : null,
        threadId: params.threadId,
        kind: params.kind,
        amount: params.amount,
      },
      logger,
    );
    return TaskGuard.check(params.taskId, logger);
  }

  /** Distinct threads a task streamed on since `since` (for cancel fan-out). */
  static async taskThreadIds(taskId: string, since: Date): Promise<string[]> {
    const rows = await db
      .selectDistinct({ threadId: taskSpendLedger.threadId })
      .from(taskSpendLedger)
      .where(
        and(
          eq(taskSpendLedger.taskId, taskId),
          gte(taskSpendLedger.createdAt, since),
        ),
      );
    return rows.flatMap((r) => (r.threadId ? [r.threadId] : []));
  }

  /** Spend / turns for several running tasks at once (health widget). */
  static async statsForTasks(
    taskIds: readonly string[],
    since: Date,
  ): Promise<Map<string, RunStats>> {
    const out = new Map<string, RunStats>();
    if (taskIds.length === 0) {
      return out;
    }
    const rows = await db
      .select({
        taskId: taskSpendLedger.taskId,
        turns: sql<number>`count(*) filter (where ${taskSpendLedger.kind} = ${SpendKind.MODEL})::int`,
        toolCalls: sql<number>`count(*) filter (where ${taskSpendLedger.kind} = ${SpendKind.TOOL})::int`,
        spend: sql<number>`coalesce(sum(${taskSpendLedger.amount}), 0)::float8`,
      })
      .from(taskSpendLedger)
      .where(
        and(
          inArray(taskSpendLedger.taskId, [...taskIds]),
          gte(taskSpendLedger.createdAt, since),
        ),
      )
      .groupBy(taskSpendLedger.taskId);
    for (const r of rows) {
      out.set(r.taskId, {
        turns: Number(r.turns),
        toolCalls: Number(r.toolCalls),
        spend: Number(r.spend),
      });
    }
    return out;
  }
}
