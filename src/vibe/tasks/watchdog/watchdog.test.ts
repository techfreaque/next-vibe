/**
 * Task watchdog - integration tests (real DB).
 *
 * - A task over the duration cap is stopped with a TIMEOUT incident.
 * - A loop over the turn ceiling is cancelled with a LOOP incident.
 * - A run held by this process is actually aborted (not just its row).
 * - A budget cap blocks the next billed step with BUDGET_EXCEEDED.
 */

import "server-only";

import { eq, inArray } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";

import { AbortReason } from "../../agent/ai-stream/repository/core/constants";
import { cronTaskExecutions, cronTasks } from "../cron/db";
import { CronTaskPriority, CronTaskStatus, TaskCategory } from "../enum";
import { TASK_WATCHDOG_CONFIG } from "./config";
import { taskBudgetCaps, taskIncidents, taskSpendLedger } from "./db";
import {
  BudgetScope,
  SpendKind,
  TaskIncidentType,
} from "./enum";
import { TaskGuard } from "./guard";
import { RunningTaskRegistry } from "./registry";
import { TaskWatchdogRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const user = {
  isPublic: true as const,
  leadId: "00000000-0000-4000-8000-0000000000dd",
  roles: [],
};
const stamp = Date.now();
const MINUTE_MS = 60_000;
const created: string[] = [];

async function insertRunningTask(
  suffix: string,
  opts: { startedMinutesAgo: number; timeoutMs?: number; tags?: string[] },
): Promise<string> {
  const id = `wd-test-${suffix}-${stamp}`;
  const startedAt = new Date(Date.now() - opts.startedMinutesAgo * MINUTE_MS);
  await db.insert(cronTasks).values({
    id,
    shortId: id,
    routeId: "wd-test-route",
    displayName: `Watchdog test ${suffix}`,
    category: TaskCategory.SYSTEM,
    schedule: "0 0 1 1 *",
    priority: CronTaskPriority.LOW,
    enabled: false,
    timeout: opts.timeoutMs ?? 60_000,
    tags: opts.tags ?? [],
    lastExecutionStatus: CronTaskStatus.RUNNING,
    runStartedAt: startedAt,
  });
  created.push(id);
  return id;
}

async function incidentsFor(taskId: string) {
  return db
    .select()
    .from(taskIncidents)
    .where(eq(taskIncidents.taskId, taskId));
}

async function statusOf(taskId: string): Promise<string | null> {
  const [row] = await db
    .select({ status: cronTasks.lastExecutionStatus })
    .from(cronTasks)
    .where(eq(cronTasks.id, taskId));
  return row?.status ?? null;
}

async function addSteps(
  taskId: string,
  kind: typeof SpendKind.MODEL | typeof SpendKind.TOOL,
  count: number,
  amount: number,
): Promise<void> {
  await db.insert(taskSpendLedger).values(
    Array.from({ length: count }, () => ({
      taskId,
      goal: null,
      threadId: null,
      kind,
      amount,
    })),
  );
}

afterAll(async () => {
  if (created.length === 0) {
    return;
  }
  await db.delete(taskIncidents).where(inArray(taskIncidents.taskId, created));
  await db
    .delete(taskSpendLedger)
    .where(inArray(taskSpendLedger.taskId, created));
  await db.delete(taskBudgetCaps).where(eq(taskBudgetCaps.key, `wd-test-cap-${stamp}`));
  await db.delete(cronTasks).where(inArray(cronTasks.id, created));
});

describe("task watchdog sweep", () => {
  it("stops a task past its duration cap with a TIMEOUT incident", async () => {
    const limitMin = TASK_WATCHDOG_CONFIG.maxDurationMs.default / MINUTE_MS;
    const taskId = await insertRunningTask("duration", {
      startedMinutesAgo: limitMin + 5,
    });

    const result = await TaskWatchdogRepository.sweep(user, logger);
    expect(result.success).toBe(true);

    expect(await statusOf(taskId)).toBe(CronTaskStatus.TIMEOUT);
    const incidents = await incidentsFor(taskId);
    expect(incidents).toHaveLength(1);
    expect(incidents[0].type).toBe(TaskIncidentType.TIMEOUT);
    expect(incidents[0].reason).toContain("limit");
    expect(incidents[0].resolvedAt).toBeNull();

    // orphan (no process holds it): the sweep wrote the history row itself
    const history = await db
      .select()
      .from(cronTaskExecutions)
      .where(eq(cronTaskExecutions.taskId, taskId));
    expect(history).toHaveLength(1);
    expect(history[0].status).toBe(CronTaskStatus.TIMEOUT);
    expect(history[0].triggeredBy).toBe("task-watchdog");
  });

  it("leaves a healthy running task alone", async () => {
    const taskId = await insertRunningTask("healthy", { startedMinutesAgo: 1 });
    await addSteps(taskId, SpendKind.MODEL, 3, 0.5);
    await TaskWatchdogRepository.sweep(user, logger);
    expect(await statusOf(taskId)).toBe(CronTaskStatus.RUNNING);
    expect(await incidentsFor(taskId)).toHaveLength(0);
  });

  it("cancels a loop over the turn ceiling and aborts the local run", async () => {
    const taskId = await insertRunningTask("turns", { startedMinutesAgo: 2 });
    await addSteps(
      taskId,
      SpendKind.MODEL,
      TASK_WATCHDOG_CONFIG.loopCeilings.maxTurns + 1,
      0,
    );
    const controller = new AbortController();
    RunningTaskRegistry.register(taskId, controller);

    await TaskWatchdogRepository.sweep(user, logger);

    expect(controller.signal.aborted).toBe(true);
    expect(RunningTaskRegistry.unregister(taskId, controller)).toContain(
      "turns",
    );
    expect(await statusOf(taskId)).toBe(CronTaskStatus.CANCELLED);
    const incidents = await incidentsFor(taskId);
    expect(incidents.map((i) => i.type)).toEqual([TaskIncidentType.LOOP]);
  });
});

describe("task budget guard", () => {
  it("blocks the next billed step once the per-task cap is hit", async () => {
    const taskId = await insertRunningTask("budget", { startedMinutesAgo: 1 });
    await db.insert(taskBudgetCaps).values({
      scope: BudgetScope.TASK,
      key: taskId,
      maxCredits: 5,
    });

    const under = await TaskGuard.afterBilledStep(
      { taskId, threadId: null, kind: SpendKind.MODEL, amount: 2 },
      logger,
    );
    expect(under.ok).toBe(true);

    const over = await TaskGuard.afterBilledStep(
      { taskId, threadId: null, kind: SpendKind.MODEL, amount: 3 },
      logger,
    );
    expect(over.ok).toBe(false);
    if (!over.ok) {
      expect(over.abortReason).toBe(AbortReason.BUDGET_EXCEEDED);
      expect(over.incidentType).toBe(TaskIncidentType.BUDGET);
    }

    // preflight of the next run is blocked too
    const preflight = await TaskGuard.check(taskId, logger);
    expect(preflight.ok).toBe(false);

    const incidents = await incidentsFor(taskId);
    expect(incidents.map((i) => i.type)).toEqual([TaskIncidentType.BUDGET]);

    await db.delete(taskBudgetCaps).where(eq(taskBudgetCaps.key, taskId));
  });

  it("stops a step that crosses the tool-call ceiling as a LOOP", async () => {
    const taskId = await insertRunningTask("tools", { startedMinutesAgo: 1 });
    await addSteps(
      taskId,
      SpendKind.TOOL,
      TASK_WATCHDOG_CONFIG.loopCeilings.maxToolCalls,
      0,
    );
    const verdict = await TaskGuard.afterBilledStep(
      { taskId, threadId: null, kind: SpendKind.TOOL, amount: 0 },
      logger,
    );
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      expect(verdict.abortReason).toBe(AbortReason.TASK_WATCHDOG);
      expect(verdict.incidentType).toBe(TaskIncidentType.LOOP);
    }
  });
});
