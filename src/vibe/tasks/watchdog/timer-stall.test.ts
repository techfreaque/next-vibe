import type { SamplingProfileStackFrame } from "bun:jsc";
import { expect, it } from "bun:test";

import { summarizeTimerStall } from "./phase-profiler";

function trace(
  timestamp: number,
  name: string,
): { timestamp: number; frames: SamplingProfileStackFrame[] } {
  const frame: SamplingProfileStackFrame = {
    sourceID: 1,
    name,
    location: "",
    sourceURL: import.meta.path,
    line: 1,
    column: 1,
    category: "Baseline",
    flags: 0,
  };
  return { timestamp, frames: [frame] };
}

it("keeps an earlier startup burst out of the measured timer stall", () => {
  const traces = [
    trace(0, "importEndpoint"),
    trace(0.01, "importEndpoint"),
    trace(0.02, "importEndpoint"),
    trace(0.125, "timerWork"),
    trace(0.25, "afterStall"),
  ];
  const timer = { startedAt: 1100, endedAt: 1200 };
  const measured = summarizeTimerStall(traces, 1000, 1260, timer);
  expect(measured.samples).toBe(1);
  expect(measured.hotStacks).toContain("timerWork");
  expect(measured.hotStacks).not.toContain("importEndpoint");
  expect(summarizeTimerStall(traces, 1000, 1600, timer)).toEqual({
    ...timer,
    samples: 0,
    hotStacks: "",
  });
});
