import { readFileSync } from "node:fs";

interface ThreadSchedulerSample {
  cpuNs: number;
  runQueueNs: number;
}

export function readThreadSchedulerSample(): ThreadSchedulerSample | undefined {
  if (process.platform !== "linux") {
    return undefined;
  }
  try {
    // thread-self refers to the calling thread. Bun's process.cpuUsage()
    // includes worker threads and cannot tell whether the loop was scheduled.
    const stat = readFileSync("/proc/thread-self/schedstat", "utf8");
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

function readCpuPressureTotal(path: string): number | undefined {
  try {
    const total = /^some [^\n]*\btotal=(\d+)/m.exec(
      readFileSync(path, "utf8"),
    )?.[1];
    if (total !== undefined && Number.isSafeInteger(Number(total))) {
      return Number(total);
    }
  } catch {
    // PSI is optional on older kernels and isolated hosts.
  }
  return undefined;
}

export function readCpuPressureSample():
  | {
      host?: number;
      cgroup?: number;
    }
  | undefined {
  if (process.platform !== "linux") {
    return undefined;
  }
  const host = readCpuPressureTotal("/proc/pressure/cpu");
  const cgroup = readCpuPressureTotal("/sys/fs/cgroup/cpu.pressure");
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
  before: ReturnType<typeof readCpuPressureSample>,
  after: ReturnType<typeof readCpuPressureSample>,
): { hostSomeMs?: number; cgroupSomeMs?: number } | undefined {
  const hostSomeMs = pressureDeltaMs(before?.host, after?.host);
  const cgroupSomeMs = pressureDeltaMs(before?.cgroup, after?.cgroup);
  return hostSomeMs === undefined && cgroupSomeMs === undefined
    ? undefined
    : { hostSomeMs, cgroupSomeMs };
}
