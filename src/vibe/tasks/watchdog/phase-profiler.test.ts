/**
 * PhaseProfiler: a stall inside (or right after) a profiled cron phase must be
 * named by function, so the lag row says what blocked the loop.
 */

import { describe, expect, it, mock } from "bun:test";

import { defaultLocale } from "../../core/i18n/core/config";
import { createEndpointLogger } from "../../logger/server";
import type { LoggerMetadata } from "../../logger/types";
import { PhaseProfiler } from "./phase-profiler";

function blockTheLoopForProfilerTest(ms: number): number {
  const end = Date.now() + ms;
  let acc = 0;
  while (Date.now() < end) {
    acc += Math.sqrt(acc + 1);
  }
  return acc;
}

describe("PhaseProfiler", () => {
  it("names the function behind a stall that starts right after the phase", async () => {
    const warn = mock((_message: string, ..._metadata: LoggerMetadata[]) => {});
    const logger = { ...createEndpointLogger(false, defaultLocale), warn };
    const end = PhaseProfiler.hold("cron-post:test", logger);
    // Let the sampler start (bun:jsc loads asynchronously)
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 50);
    });
    end();
    // The stall comes after the phase ended, inside the tail
    const stallAt = Date.now();
    blockTheLoopForProfilerTest(300);
    // Tail (1.5 s) + summarizing
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 2000);
    });

    const profile = PhaseProfiler.profileCovering(stallAt);
    expect(profile).toBeDefined();
    // Sampler gaps under a loaded box split the 300 ms block; naming is what counts
    expect(profile?.streakMs).toBeGreaterThanOrEqual(150);
    expect(profile?.hotFrames).toContain("blockTheLoopForProfilerTest");
    expect(profile?.phases).toContain("cron-post:test");
    expect(profile?.earliestStreakStartMs).toBeGreaterThanOrEqual(profile?.sessionStartedAt ?? 0);
    expect(profile?.earliestStreakStartMs).toBeLessThanOrEqual(stallAt + 300);
    expect(profile?.latestStreakEndMs).toBeGreaterThanOrEqual(stallAt);
    expect(profile?.latestStreakEndMs).toBeLessThanOrEqual(profile?.sessionEndedAt ?? 0);
    expect(profile?.totalSamples).toBeGreaterThan(0);
    expect(profile?.windowSampleCount).toBeGreaterThanOrEqual(
      profile?.totalSamples ?? 0,
    );
    expect(profile?.gcSamples).toBeLessThanOrEqual(profile?.totalSamples ?? 0);
    if (profile && profile.streakMs >= 200) {
      expect(warn).toHaveBeenCalledWith(
        "[EventLoop] Stall profiled in a window with cron bookkeeping",
        expect.objectContaining({
          profileWindowStartedAt: new Date(profile.sessionStartedAt).toISOString(),
          profileWindowEndedAt: new Date(profile.sessionEndedAt).toISOString(),
        }),
      );
    }
  });

  it("keeps short sampling windows available without reporting a cron stall", async () => {
    const warn = mock((_message: string, ..._metadata: LoggerMetadata[]) => {});
    const logger = { ...createEndpointLogger(false, defaultLocale), warn };
    const end = PhaseProfiler.hold("cron-post:idle", logger);
    const idleAt = Date.now();
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 100);
    });
    end();
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1800);
    });
    const profile = PhaseProfiler.profileCovering(idleAt);
    expect(profile).toBeDefined();
    expect(profile?.streakMs).toBeLessThan(200);
    expect(warn).not.toHaveBeenCalled();
  });

  it("names a stall outside any phase in continuous mode", async () => {
    const logger = createEndpointLogger(false, defaultLocale);
    PhaseProfiler.startContinuous(logger);
    try {
      // Let the sampler start (bun:jsc loads asynchronously)
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 50);
      });
      const stallAt = Date.now();
      blockTheLoopForProfilerTest(300);
      // The lag monitor flushes right after it measured the stall
      await PhaseProfiler.flush(stallAt);

      const profile = PhaseProfiler.profileCovering(stallAt);
      expect(profile).toBeDefined();
      // Sampler gaps under a loaded box split the 300 ms block; naming is what counts
      expect(profile?.streakMs).toBeGreaterThanOrEqual(150);
      expect(profile?.hotFrames).toContain("blockTheLoopForProfilerTest");
      expect(profile?.phases).toBe("");
      // The next window starts on its own
      expect(PhaseProfiler.isContinuous()).toBe(true);
    } finally {
      PhaseProfiler.stopContinuous();
    }
  });
});
