import { describe, expect, it } from "vitest";

import {
  readThreadSchedulerSample,
  threadSchedulerDelta,
} from "./event-loop-scheduler";

describe("threadSchedulerDelta", () => {
  it("reports the loop thread's CPU and runnable wait between ticks", () => {
    expect(
      threadSchedulerDelta(
        { cpuNs: 20_000_000, runQueueNs: 10_000_000 },
        { cpuNs: 32_000_000, runQueueNs: 184_000_000 },
      ),
    ).toEqual({ stallThreadCpuMs: 12, stallRunQueueMs: 174 });
  });

  it("leaves runnable wait absent when the host reports no increase", () => {
    expect(
      threadSchedulerDelta(
        { cpuNs: 20_000_000, runQueueNs: 0 },
        { cpuNs: 102_000_000, runQueueNs: 0 },
      ),
    ).toEqual({ stallThreadCpuMs: 82 });
  });

  it("leaves the measurement absent when a sample is unavailable", () => {
    expect(
      threadSchedulerDelta(
        { cpuNs: 20_000_000, runQueueNs: 10_000_000 },
        undefined,
      ),
    ).toBeUndefined();
  });

  it("samples the calling thread when Linux exposes schedstat", () => {
    const before = readThreadSchedulerSample();
    if (before) {
      const target = performance.now() + 10;
      while (performance.now() < target) {
        // Burn CPU on the calling thread.
      }
      const delta = threadSchedulerDelta(before, readThreadSchedulerSample());
      expect(delta?.stallThreadCpuMs).toBeGreaterThan(0);
    }
  });
});
