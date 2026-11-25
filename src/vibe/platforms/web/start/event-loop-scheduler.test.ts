import { describe, expect, it } from "bun:test";

import {
  cpuPressureWindow,
  cpuThrottleWindow,
  describeSchedulerEvidence,
  readThreadSchedulerSample,
  threadSchedulerDelta,
} from "./event-loop-scheduler";

describe("describeSchedulerEvidence", () => {
  it("distinguishes main-thread work from runnable scheduler wait", () => {
    expect(describeSchedulerEvidence({ stallThreadCpuMs: 130 }, 135)).toBe(
      "main-thread-cpu",
    );
    expect(
      describeSchedulerEvidence(
        { stallThreadCpuMs: 12, stallRunQueueMs: 174 },
        200,
      ),
    ).toBe("main-thread-runnable-wait");
  });

  it("excludes the scheduled 50 ms from CPU attribution and identifies off-CPU time", () => {
    expect(
      describeSchedulerEvidence(
        { stallThreadCpuMs: 78, stallRunQueueMs: 35 },
        84,
        50,
      ),
    ).toBe("no-dominant-scheduler-counter");
    expect(
      describeSchedulerEvidence(
        { stallThreadCpuMs: 418, stallRunQueueMs: 6 },
        917,
        50,
      ),
    ).toBe("outside-cpu-and-runnable-wait");
  });

  it("keeps ambiguous or unavailable scheduler evidence explicit", () => {
    expect(describeSchedulerEvidence({ stallThreadCpuMs: 12 }, 200)).toBe(
      "no-dominant-scheduler-counter",
    );
    expect(describeSchedulerEvidence(undefined, 200)).toBe(
      "no-scheduler-sample",
    );
  });
});

describe("cpuThrottleWindow", () => {
  it("distinguishes quota throttling from an available zero sample", () => {
    const initial = { periods: 2, microseconds: 20_000 };
    expect(cpuThrottleWindow(initial, initial)).toEqual({
      throttledPeriods: 0,
      throttledMs: 0,
    });
    expect(
      cpuThrottleWindow(initial, { periods: 5, microseconds: 112_500 }),
    ).toEqual({ throttledPeriods: 3, throttledMs: 93 });
    expect(
      cpuThrottleWindow(initial, { periods: 1, microseconds: 19_000 }),
    ).toBeUndefined();
  });
});

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

describe("cpuPressureWindow", () => {
  it("reports host and cgroup contention over the lag window in milliseconds", () => {
    expect(
      cpuPressureWindow({ host: 1000, cgroup: 0 }, { host: 281400, cgroup: 0 }),
    ).toEqual({ hostSomeMs: 280, cgroupSomeMs: 0 });
  });

  it("keeps missing and reset counters distinct from measured zero pressure", () => {
    expect(cpuPressureWindow(undefined, { host: 100 })).toBeUndefined();
    expect(cpuPressureWindow({ cgroup: 2000 }, { cgroup: 0 })).toBeUndefined();
    expect(cpuPressureWindow({ host: 0 }, { host: 23000 })).toEqual({
      hostSomeMs: 23,
      cgroupSomeMs: undefined,
    });
  });
});
