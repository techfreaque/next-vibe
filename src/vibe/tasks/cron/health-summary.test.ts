import { describe, expect, it } from "bun:test";

import { CronTaskStatus } from "../enum";
import {
  classifyTaskHealth,
  isOneOffTask,
  isOrphanedRun,
  isOverdueTask,
  isParkedTask,
  isStuckTask,
  type TaskHealthRow,
} from "./health-summary";
import { TaskHealth } from "./stats/enum";

const NOW = new Date("2026-11-21T12:00:00.000Z");
const MIN = 60_000;

function row(overrides: Partial<TaskHealthRow>): TaskHealthRow {
  return {
    enabled: true,
    schedule: "*/15 * * * *",
    timezone: "UTC",
    timeout: 5 * MIN,
    lastExecutionStatus: CronTaskStatus.COMPLETED,
    lastExecutedAt: new Date(NOW.getTime() - 5 * MIN),
    runStartedAt: null,
    updatedAt: new Date(NOW.getTime() - 5 * MIN),
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    runOnce: false,
    routeId: "test-task",
    ...overrides,
  };
}

describe("classifyTaskHealth", () => {
  it("healthy when the last run completed on schedule", () => {
    expect(classifyTaskHealth(row({}), NOW)).toBe(TaskHealth.HEALTHY);
  });

  it("failing when enabled and the last run failed, errored or timed out", () => {
    for (const status of [
      CronTaskStatus.FAILED,
      CronTaskStatus.ERROR,
      CronTaskStatus.TIMEOUT,
    ]) {
      expect(
        classifyTaskHealth(row({ lastExecutionStatus: status }), NOW),
      ).toBe(TaskHealth.FAILING);
    }
  });

  it("disabled wins over a stale failure and over never ran", () => {
    expect(
      classifyTaskHealth(
        row({ enabled: false, lastExecutionStatus: CronTaskStatus.FAILED }),
        NOW,
      ),
    ).toBe(TaskHealth.DISABLED);
    expect(
      classifyTaskHealth(
        row({
          enabled: false,
          lastExecutionStatus: null,
          lastExecutedAt: null,
        }),
        NOW,
      ),
    ).toBe(TaskHealth.DISABLED);
  });

  it("never ran when enabled without any run", () => {
    expect(
      classifyTaskHealth(
        row({ lastExecutionStatus: null, lastExecutedAt: null }),
        NOW,
      ),
    ).toBe(TaskHealth.NEVER_RAN);
  });

  it("stuck when running past the watchdog limit (max 15 min, timeout + 2 min)", () => {
    const stuck = row({
      lastExecutionStatus: CronTaskStatus.RUNNING,
      runStartedAt: new Date(NOW.getTime() - 16 * MIN),
    });
    expect(isStuckTask(stuck, NOW)).toBe(true);
    expect(classifyTaskHealth(stuck, NOW)).toBe(TaskHealth.STUCK);
  });

  it("a disabled task with a hung run is stuck (orphaned run)", () => {
    const orphan = row({
      enabled: false,
      lastExecutionStatus: CronTaskStatus.RUNNING,
      runStartedAt: new Date(NOW.getTime() - 20 * MIN),
    });
    expect(classifyTaskHealth(orphan, NOW)).toBe(TaskHealth.STUCK);
    expect(isOrphanedRun(orphan, NOW)).toBe(true);
  });

  it("flaky when the last run passed but the window is under 80%", () => {
    expect(
      classifyTaskHealth(row({}), NOW, { completed: 3, failed: 19 }),
    ).toBe(TaskHealth.FLAKY);
    expect(
      classifyTaskHealth(row({}), NOW, { completed: 9, failed: 1 }),
    ).toBe(TaskHealth.HEALTHY);
  });

  it("recovering when the window is flaky but the last runs passed", () => {
    expect(
      classifyTaskHealth(row({}), NOW, {
        completed: 3,
        failed: 19,
        recentAllOk: true,
      }),
    ).toBe(TaskHealth.RECOVERING);
    expect(
      classifyTaskHealth(row({}), NOW, {
        completed: 3,
        failed: 19,
        recentAllOk: false,
      }),
    ).toBe(TaskHealth.FLAKY);
  });

  it("low data when there are failures but under 3 finished runs", () => {
    expect(
      classifyTaskHealth(row({}), NOW, { completed: 1, failed: 1 }),
    ).toBe(TaskHealth.LOW_DATA);
    expect(
      classifyTaskHealth(row({}), NOW, { completed: 2, failed: 0 }),
    ).toBe(TaskHealth.HEALTHY);
  });

  it("parked = finished one-off or never-run disabled without orphan", () => {
    expect(isParkedTask(row({ runOnce: true, enabled: false }), NOW)).toBe(
      true,
    );
    expect(
      isParkedTask(
        row({ enabled: false, lastExecutionStatus: null, lastExecutedAt: null }),
        NOW,
      ),
    ).toBe(true);
    // Disabled with history stays visible.
    expect(
      isParkedTask(
        row({ enabled: false, lastExecutionStatus: CronTaskStatus.FAILED }),
        NOW,
      ),
    ).toBe(false);
  });

  it("one-off = run-once and disabled", () => {
    expect(isOneOffTask(row({ runOnce: true, enabled: false }))).toBe(true);
    expect(isOneOffTask(row({ runOnce: true, enabled: true }))).toBe(false);
  });

  it("running past a short timeout but inside the watchdog limit is running", () => {
    expect(
      classifyTaskHealth(
        row({
          timeout: MIN,
          lastExecutionStatus: CronTaskStatus.RUNNING,
          runStartedAt: new Date(NOW.getTime() - 10 * MIN),
        }),
        NOW,
      ),
    ).toBe(TaskHealth.RUNNING);
  });

  it("falls back to updatedAt when runStartedAt is missing", () => {
    expect(
      isStuckTask(
        row({
          lastExecutionStatus: CronTaskStatus.RUNNING,
          runStartedAt: null,
          updatedAt: new Date(NOW.getTime() - 20 * MIN),
        }),
        NOW,
      ),
    ).toBe(true);
  });

  it("overdue when a scheduled fire passed the grace window without a run", () => {
    const late = row({ lastExecutedAt: new Date(NOW.getTime() - 60 * MIN) });
    expect(isOverdueTask(late, NOW)).toBe(true);
    expect(classifyTaskHealth(late, NOW)).toBe(TaskHealth.OVERDUE);
  });

  it("not overdue inside the grace window", () => {
    // Last fire older than the 10 min grace is 11:45; a run at 11:46 covers it.
    expect(
      isOverdueTask(
        row({ lastExecutedAt: new Date(NOW.getTime() - 14 * MIN) }),
        NOW,
      ),
    ).toBe(false);
  });
});
