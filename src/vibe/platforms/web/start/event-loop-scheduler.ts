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
