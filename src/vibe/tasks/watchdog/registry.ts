/**
 * Running Task Registry
 *
 * In-process map of the abort controllers of tasks THIS process is executing
 * (pulse attempts and async-tool goroutines). The watchdog aborts through it so
 * a cancelled task actually stops working, not just its DB row.
 *
 * Cross-process cancels reach AI loops through StreamControl (thread channel);
 * a task nobody holds a controller for is an orphan and is recovered by row.
 *
 * Stored on globalThis: dev HMR re-evaluates modules and a module-level Map
 * would lose every in-flight controller.
 */

import "server-only";

interface RunningTaskEntry {
  controller: AbortController;
  /** Set when the watchdog / an admin cancelled this run */
  cancelReason: string | null;
  /** Human-readable name (task display name / tool name) for diagnostics */
  label: string;
  /** Wall clock (ms) the run was registered */
  startedAt: number;
}

interface FinishedTaskEntry {
  label: string;
  startedAt: number;
  endedAt: number;
}

/**
 * How many finished runs to remember. The event-loop lag probe samples on the
 * first tick AFTER a stall, so a run that caused the stall and then finished
 * (or whose bookkeeping blocked right after it unregistered) was invisible:
 * prod lag rows 2026-11-15 named no task although a cron run had ended a few
 * ms before the stall began.
 */
const FINISHED_RING_SIZE = 60;

interface PhaseEntry {
  label: string;
  startedAt: number;
}

declare global {
  var __vibeRunningTasks: Map<string, RunningTaskEntry> | undefined;
  var __vibeFinishedTasks: FinishedTaskEntry[] | undefined;
  var __vibeActivePhases: Map<number, PhaseEntry> | undefined;
  var __vibePhaseSeq: number | undefined;
}

function entries(): Map<string, RunningTaskEntry> {
  globalThis.__vibeRunningTasks ??= new Map();
  return globalThis.__vibeRunningTasks;
}

function finished(): FinishedTaskEntry[] {
  globalThis.__vibeFinishedTasks ??= [];
  return globalThis.__vibeFinishedTasks;
}

function phases(): Map<number, PhaseEntry> {
  globalThis.__vibeActivePhases ??= new Map();
  return globalThis.__vibeActivePhases;
}

function pushFinished(entry: FinishedTaskEntry): void {
  const ring = finished();
  ring.push(entry);
  if (ring.length > FINISHED_RING_SIZE) {
    ring.splice(0, ring.length - FINISHED_RING_SIZE);
  }
}

export class RunningTaskRegistry {
  static register(
    taskId: string,
    controller: AbortController,
    label: string,
  ): void {
    entries().set(taskId, {
      controller,
      cancelReason: null,
      label,
      startedAt: Date.now(),
    });
  }

  /**
   * Drop the entry. Returns the cancel reason when the run was cancelled by the
   * watchdog / an admin, so the caller can finish as CANCELLED and not retry.
   */
  static unregister(
    taskId: string,
    controller: AbortController,
  ): string | null {
    const entry = entries().get(taskId);
    if (!entry || entry.controller !== controller) {
      return null;
    }
    entries().delete(taskId);
    pushFinished({
      label: entry.label,
      startedAt: entry.startedAt,
      endedAt: Date.now(),
    });
    return entry.cancelReason;
  }

  /**
   * Mark a stretch of work that is not a cancellable run (pulse bookkeeping
   * around a task: owner lookup, route import, history write, emits) so lag
   * rows can name it. Phases never count as runs: size(), cancel() and the
   * deploy drain ignore them. Returns the function that ends the phase.
   */
  static beginPhase(label: string): () => void {
    globalThis.__vibePhaseSeq = (globalThis.__vibePhaseSeq ?? 0) + 1;
    const id = globalThis.__vibePhaseSeq;
    const startedAt = Date.now();
    phases().set(id, { label, startedAt });
    return (): void => {
      if (phases().delete(id)) {
        pushFinished({ label, startedAt, endedAt: Date.now() });
      }
    };
  }

  /** Abort a run held by this process. False = no local run (orphan / other process). */
  static cancel(taskId: string, reason: string): boolean {
    const entry = entries().get(taskId);
    if (!entry) {
      return false;
    }
    entry.cancelReason = reason;
    if (!entry.controller.signal.aborted) {
      entry.controller.abort(new Error(reason));
    }
    return true;
  }

  static has(taskId: string): boolean {
    return entries().has(taskId);
  }

  /**
   * Runs and phases that were in flight at any point since `sinceMs`: the
   * ones still running (endedAt null) plus the ones that finished after it. The lag
   * monitor passes the stall start minus a margin.
   */
  static activeSince(
    sinceMs: number,
  ): { label: string; startedAt: number; endedAt: number | null }[] {
    const running = [...entries().values(), ...phases().values()].map(
      (entry) => ({
        label: entry.label,
        startedAt: entry.startedAt,
        endedAt: null,
      }),
    );
    const ended = finished().filter((entry) => entry.endedAt >= sinceMs);
    return [...running, ...ended];
  }

  /** Runs this process holds right now (deploy drain status). */
  static size(): number {
    return entries().size;
  }

  /**
   * Abort every run this process holds (shutdown drain timed out). Each run
   * finishes as CANCELLED instead of staying RUNNING until the watchdog sweep.
   */
  static cancelAll(reason: string): number {
    let cancelled = 0;
    for (const taskId of entries().keys()) {
      if (RunningTaskRegistry.cancel(taskId, reason)) {
        cancelled++;
      }
    }
    return cancelled;
  }
}
