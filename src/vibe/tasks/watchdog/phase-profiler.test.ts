/**
 * PhaseProfiler: a stall inside (or right after) a profiled cron phase must be
 * named by function, so the lag row says what blocked the loop.
 */

import type { SamplingProfile, SamplingProfileStackFrame } from "bun:jsc";
import * as jsc from "bun:jsc";
import { describe, expect, it, mock, spyOn } from "bun:test";

import { coreEnv } from "../../core/env";
import { defaultLocale } from "../../core/i18n/core/config";
import { Environment } from "../../env/env-util";
import { createEndpointLogger } from "../../logger/server";
import type { EndpointLogger } from "../../logger/types";
import { PhaseProfiler } from "./phase-profiler";

function blockTheLoopForProfilerTest(ms: number): number {
  const end = performance.now() + ms;
  let acc = 0;
  while (performance.now() < end) {
    acc += Math.sqrt(acc + 1);
  }
  return acc;
}

function fixtureSampler(streakMs: number): {
  completeAtWindowEnd: () => Promise<void>;
  restore: () => void;
} {
  const result = Promise.withResolvers<SamplingProfile>();
  const sample = spyOn(jsc, "profile").mockReturnValueOnce(result.promise);
  const frame: SamplingProfileStackFrame = {
    sourceID: 1,
    name: blockTheLoopForProfilerTest.name,
    location: "",
    sourceURL: import.meta.path,
    line: 1,
    column: 1,
    category: "Baseline",
    flags: 0,
  };

  return {
    async completeAtWindowEnd(): Promise<void> {
      const [call] = sample.mock.calls;
      expect(call).toBeDefined();
      await call[0]();
      result.resolve({
        functions: "",
        bytecodes: "",
        stackTraces: {
          interval: 0.001,
          sources: [{ sourceID: frame.sourceID, url: frame.sourceURL }],
          traces: [
            { timestamp: 0, frames: [] },
            ...Array.from(Array<undefined>(streakMs).keys(), (index) => ({
              timestamp: (50 + index) / 1000,
              frames: [frame],
            })),
          ],
        },
      });
    },
    restore: (): void => sample.mockRestore(),
  };
}

describe("PhaseProfiler", () => {
  it("names the function behind a stall that starts right after the phase", async () => {
    const warn = mock<EndpointLogger["warn"]>();
    const logger = { ...createEndpointLogger(false, defaultLocale), warn };
    const sampler = fixtureSampler(300);
    try {
      const end = PhaseProfiler.hold("cron-post:test", logger);
      await Bun.sleep(50);
      const sampling = sampler.completeAtWindowEnd();
      end();
      // The fixture's stall comes after the phase ended, inside the real tail.
      const stallAt = Date.now();
      await Bun.sleep(300);
      const stallEndedAt = Date.now();
      await sampling;
      await PhaseProfiler.flush(stallAt);

      const profile = PhaseProfiler.profileCovering(stallAt);
      expect(profile).toBeDefined();
      expect(profile?.streakMs).toBe(300);
      expect(profile?.hotFrames).toContain("blockTheLoopForProfilerTest");
      expect(profile?.phases).toContain("cron-post:test");
      expect(profile?.sessionEndedAt).toBeGreaterThanOrEqual(stallEndedAt);
      expect(profile?.earliestStreakStartMs).toBeGreaterThanOrEqual(
        profile?.sessionStartedAt ?? 0,
      );
      expect(profile?.earliestStreakStartMs).toBeLessThanOrEqual(stallEndedAt);
      expect(profile?.latestStreakEndMs).toBeGreaterThanOrEqual(stallAt);
      expect(profile?.latestStreakEndMs).toBeLessThanOrEqual(profile?.sessionEndedAt ?? 0);
      expect(profile?.totalSamples).toBeGreaterThan(0);
      expect(profile?.windowSampleCount).toBeGreaterThanOrEqual(profile?.totalSamples ?? 0);
      expect(profile?.gcSamples).toBeLessThanOrEqual(profile?.totalSamples ?? 0);
      if (coreEnv.NODE_ENV !== Environment.DEVELOPMENT && profile) {
        expect(warn).toHaveBeenCalledWith(
          "[EventLoop] Stall profiled in a window with cron bookkeeping",
          expect.objectContaining({
            profileWindowStartedAt: new Date(profile.sessionStartedAt).toISOString(),
            profileWindowEndedAt: new Date(profile.sessionEndedAt).toISOString(),
          }),
        );
      }
    } finally {
      sampler.restore();
    }
  });

  it("keeps short sampling windows available without reporting a cron stall", async () => {
    const warn = mock<EndpointLogger["warn"]>();
    const logger = { ...createEndpointLogger(false, defaultLocale), warn };
    const end = PhaseProfiler.hold("cron-post:idle", logger);
    const idleAt = Date.now();
    await Bun.sleep(100);
    end();
    await Bun.sleep(1800);
    const profile = PhaseProfiler.profileCovering(idleAt);
    expect(profile).toBeDefined();
    expect(profile?.streakMs).toBeLessThan(200);
    expect(warn).not.toHaveBeenCalled();
  });

  it.each([
    { busyMs: 300, logsStall: false },
    { busyMs: 900, logsStall: true },
  ])(
    "uses the high lag threshold for dev profile dumps ($busyMs ms busy)",
    async ({ busyMs, logsStall }) => {
      const previousEnv = coreEnv.NODE_ENV;
      coreEnv.NODE_ENV = Environment.DEVELOPMENT;
      const warn = mock<EndpointLogger["warn"]>();
      const logger = { ...createEndpointLogger(false, defaultLocale), warn };
      const sampler = fixtureSampler(busyMs);
      try {
        const end = PhaseProfiler.hold("cron-post:dev", logger);
        await Bun.sleep(50);
        const sampling = sampler.completeAtWindowEnd();
        end();
        const stallAt = Date.now();
        await Bun.sleep(busyMs);
        await PhaseProfiler.flush(stallAt);
        await sampling;

        const profile = PhaseProfiler.profileCovering(stallAt);
        expect(profile?.streakMs).toBe(busyMs);
        expect(profile?.hotFrames).toContain("blockTheLoopForProfilerTest");
        expect(warn).toHaveBeenCalledTimes(logsStall ? 1 : 0);
      } finally {
        sampler.restore();
        coreEnv.NODE_ENV = previousEnv;
      }
    },
  );

  it("names a stall outside any phase in continuous mode", async () => {
    const logger = createEndpointLogger(false, defaultLocale);
    const sampler = fixtureSampler(300);
    PhaseProfiler.startContinuous(logger);
    try {
      await Bun.sleep(50);
      const sampling = sampler.completeAtWindowEnd();
      const stallAt = Date.now();
      await Bun.sleep(300);
      await PhaseProfiler.flush(stallAt);
      await sampling;

      const profile = PhaseProfiler.profileCovering(stallAt);
      expect(profile).toBeDefined();
      expect(profile?.streakMs).toBe(300);
      expect(profile?.hotFrames).toContain("blockTheLoopForProfilerTest");
      expect(profile?.phases).toBe("");
      expect(PhaseProfiler.isContinuous()).toBe(true);
    } finally {
      PhaseProfiler.stopContinuous();
      sampler.restore();
    }
  });

  it("captures the real blocked stack with the Bun sampler", async () => {
    const logger = createEndpointLogger(false, defaultLocale);
    PhaseProfiler.startContinuous(logger);
    try {
      await Bun.sleep(50);
      const stallAt = Date.now();
      blockTheLoopForProfilerTest(300);
      await PhaseProfiler.flush(stallAt);
      expect(PhaseProfiler.profileCovering(stallAt)?.hotFrames).toContain(
        "blockTheLoopForProfilerTest",
      );
    } finally {
      PhaseProfiler.stopContinuous();
    }
  });
});

it("names profiler window closes that overlap a stall", () => {
  globalThis.__vibeProfilerCloses = [
    { startedAt: 1_000, endedAt: 1_080, traces: 9_000 },
    { startedAt: 5_000, endedAt: 5_004, traces: 700 },
  ];
  expect(PhaseProfiler.closesDuring(1_050, 1_200)).toBe(
    `80 ms / 9000 traces at ${new Date(1_000).toISOString()}`,
  );
  expect(PhaseProfiler.closesDuring(2_000, 3_000)).toBeUndefined();
  globalThis.__vibeProfilerCloses = undefined;
});
