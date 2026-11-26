import { readFile } from "node:fs/promises";

interface HostCpuSample {
  totalTicks: number;
  stealTicks: number;
}

export function parseHostCpuSample(stat: string): HostCpuSample | undefined {
  const aggregate = /^cpu[ \t]+([^\n]+)/m.exec(stat)?.[1];
  const ticks = aggregate?.trim().split(/\s+/).slice(0, 8).map(Number);
  const stealTicks = ticks?.[7];
  if (
    !ticks ||
    stealTicks === undefined ||
    ticks.some((value) => !Number.isSafeInteger(value) || value < 0)
  ) {
    return undefined;
  }
  // Guest and guest_nice are already included in user and nice.
  return {
    totalTicks: ticks.reduce((total, value) => total + value, 0),
    stealTicks,
  };
}

export async function readHostCpuSample(): Promise<HostCpuSample | undefined> {
  if (process.platform !== "linux") {
    return undefined;
  }
  try {
    return parseHostCpuSample(await readFile("/proc/stat", "utf8"));
  } catch {
    // Some containers do not expose the host counters.
    return undefined;
  }
}

export function hostCpuStealPercent(
  before: HostCpuSample | undefined,
  after: HostCpuSample | undefined,
): number | undefined {
  if (!before || !after) {
    return undefined;
  }
  const total = after.totalTicks - before.totalTicks;
  const steal = after.stealTicks - before.stealTicks;
  return total > 0 && steal >= 0 && steal <= total
    ? Math.round((100 * steal) / total)
    : undefined;
}

interface ThreadSchedulerSample {
  cpuNs: number;
  runQueueNs: number;
}

export async function readThreadSchedulerSample(): Promise<
  ThreadSchedulerSample | undefined
> {
  if (process.platform !== "linux") {
    return undefined;
  }
  try {
    // Pin the read to the main thread regardless of which thread does the I/O.
    const stat = await readFile(
      `/proc/self/task/${process.pid}/schedstat`,
      "utf8",
    );
    const [cpuNs, runQueueNs, timeslices] = stat
      .trim()
      .split(/\s+/)
      .map(Number);
    if (
      cpuNs !== undefined &&
      Number.isSafeInteger(cpuNs) &&
      cpuNs >= 0 &&
      runQueueNs !== undefined &&
      Number.isSafeInteger(runQueueNs) &&
      runQueueNs >= 0 &&
      timeslices !== undefined &&
      Number.isSafeInteger(timeslices) &&
      timeslices > 0
    ) {
      return { cpuNs, runQueueNs };
    }
  } catch {
    // Some hosts hide procfs. The regular lag diagnostics still apply.
  }
  return undefined;
}

export function threadSchedulerDelta(
  before: ThreadSchedulerSample | undefined,
  after: ThreadSchedulerSample | undefined,
): { stallThreadCpuMs: number; stallRunQueueMs?: number } | undefined {
  if (!before || !after || after.cpuNs < before.cpuNs) {
    return undefined;
  }
  return {
    stallThreadCpuMs: Math.round((after.cpuNs - before.cpuNs) / 1e6),
    // A zero counter can mean scheduler delay accounting is disabled.
    stallRunQueueMs:
      after.runQueueNs > before.runQueueNs
        ? Math.round((after.runQueueNs - before.runQueueNs) / 1e6)
        : undefined,
  };
}

/** Attribute elapsed time using only the counters the kernel actually reported. */
export function describeSchedulerEvidence(
  scheduler: ReturnType<typeof threadSchedulerDelta>,
  stallMs: number,
  scheduledTickMs = 0,
): string {
  if (!scheduler) {
    return "no-scheduler-sample";
  }
  const cpuMs = scheduler.stallThreadCpuMs;
  const waitMs = scheduler.stallRunQueueMs ?? 0;
  // Kernel counters cover the scheduled interval as well as its delay. Only
  // attribute a majority if it survives excluding the ordinary tick period.
  if (cpuMs - scheduledTickMs >= stallMs / 2 && cpuMs > waitMs) {
    return "main-thread-cpu";
  }
  if (waitMs - scheduledTickMs >= stallMs / 2 && waitMs > cpuMs) {
    return "main-thread-runnable-wait";
  }
  // Even if the entire scheduled interval was idle, at least this much
  // of the delay elapsed off CPU and outside the measured runnable wait.
  if (
    scheduler.stallRunQueueMs !== undefined &&
    stallMs - cpuMs - waitMs > stallMs / 2
  ) {
    return "outside-cpu-and-runnable-wait";
  }
  return "no-dominant-scheduler-counter";
}

async function readCpuPressureTotal(path: string): Promise<number | undefined> {
  try {
    const total = /^some [^\n]*\btotal=(\d+)/m.exec(
      await readFile(path, "utf8"),
    )?.[1];
    if (total !== undefined && Number.isSafeInteger(Number(total))) {
      return Number(total);
    }
  } catch {
    // PSI is optional on older kernels and isolated hosts.
  }
  return undefined;
}

export async function readCpuPressureSample(): Promise<
  | {
      host?: number;
      cgroup?: number;
    }
  | undefined
> {
  if (process.platform !== "linux") {
    return undefined;
  }
  const [host, cgroup] = await Promise.all([
    readCpuPressureTotal("/proc/pressure/cpu"),
    readCpuPressureTotal("/sys/fs/cgroup/cpu.pressure"),
  ]);
  return host === undefined && cgroup === undefined
    ? undefined
    : { host, cgroup };
}

function pressureDeltaMs(before?: number, after?: number): number | undefined {
  return before !== undefined && after !== undefined && after >= before
    ? Math.round((after - before) / 1_000)
    : undefined;
}

/** Time in the five-second lag window with at least one runnable task waiting. */
export function cpuPressureWindow(
  before: Awaited<ReturnType<typeof readCpuPressureSample>>,
  after: Awaited<ReturnType<typeof readCpuPressureSample>>,
): { hostSomeMs?: number; cgroupSomeMs?: number } | undefined {
  const hostSomeMs = pressureDeltaMs(before?.host, after?.host);
  const cgroupSomeMs = pressureDeltaMs(before?.cgroup, after?.cgroup);
  return hostSomeMs === undefined && cgroupSomeMs === undefined
    ? undefined
    : { hostSomeMs, cgroupSomeMs };
}

interface CpuThrottleSample {
  periods: number;
  microseconds: number;
}

/** Read the cgroup v2 CPU quota counters when Docker exposes them. */
export async function readCpuThrottleSample(): Promise<
  CpuThrottleSample | undefined
> {
  if (process.platform !== "linux") {
    return undefined;
  }
  try {
    const stat = await readFile("/sys/fs/cgroup/cpu.stat", "utf8");
    const periods = /^nr_throttled (\d+)$/m.exec(stat)?.[1];
    const microseconds = /^throttled_usec (\d+)$/m.exec(stat)?.[1];
    if (periods !== undefined && microseconds !== undefined) {
      return { periods: Number(periods), microseconds: Number(microseconds) };
    }
  } catch {
    // Optional on platforms without a unified cgroup.
  }
  return undefined;
}

export function cpuThrottleWindow(
  before: CpuThrottleSample | undefined,
  after: CpuThrottleSample | undefined,
): { throttledPeriods: number; throttledMs: number } | undefined {
  if (!before || !after || after.periods < before.periods) {
    return undefined;
  }
  const throttledMs = pressureDeltaMs(before.microseconds, after.microseconds);
  return throttledMs === undefined
    ? undefined
    : { throttledPeriods: after.periods - before.periods, throttledMs };
}
