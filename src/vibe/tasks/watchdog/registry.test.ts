/**
 * RunningTaskRegistry.activeSince: the event-loop lag probe runs only after a
 * stall, so runs that finished just before it must still be reported.
 */

import { describe, expect, it } from "bun:test";

import { RunningTaskRegistry } from "./registry";

describe("RunningTaskRegistry.activeSince", () => {
  it("reports running runs and runs that ended after the cutoff", () => {
    const before = Date.now();
    const done = new AbortController();
    RunningTaskRegistry.register("reg-test-done", done, "cron:done-task");
    RunningTaskRegistry.unregister("reg-test-done", done);

    const live = new AbortController();
    RunningTaskRegistry.register("reg-test-live", live, "cron:live-task");

    const runs = RunningTaskRegistry.activeSince(before - 1);
    const done1 = runs.find((run) => run.label === "cron:done-task");
    const live1 = runs.find((run) => run.label === "cron:live-task");
    expect(done1?.endedAt).toBeNumber();
    expect(live1?.endedAt).toBeNull();

    // A cutoff after the finished run drops it but keeps the live one
    const later = RunningTaskRegistry.activeSince(Date.now() + 1000);
    expect(later.some((run) => run.label === "cron:done-task")).toBe(false);
    expect(later.some((run) => run.label === "cron:live-task")).toBe(true);

    RunningTaskRegistry.unregister("reg-test-live", live);
  });

  it("reports phases without counting them as runs", () => {
    const sizeBefore = RunningTaskRegistry.size();
    const before = Date.now();
    const end = RunningTaskRegistry.beginPhase("cron-prep:phase-test");

    const open = RunningTaskRegistry.activeSince(before - 1);
    expect(
      open.find((run) => run.label === "cron-prep:phase-test")?.endedAt,
    ).toBeNull();
    // Phases are not cancellable runs: drain status ignores them
    expect(RunningTaskRegistry.size()).toBe(sizeBefore);

    end();
    end(); // idempotent: one ring entry, no throw
    const closed = RunningTaskRegistry.activeSince(before - 1).filter(
      (run) => run.label === "cron-prep:phase-test",
    );
    expect(closed).toHaveLength(1);
    expect(closed[0]?.endedAt).toBeNumber();
  });
});
