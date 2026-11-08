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
}

declare global {
  var __vibeRunningTasks: Map<string, RunningTaskEntry> | undefined;
}

function entries(): Map<string, RunningTaskEntry> {
  globalThis.__vibeRunningTasks ??= new Map();
  return globalThis.__vibeRunningTasks;
}

export class RunningTaskRegistry {
  static register(taskId: string, controller: AbortController): void {
    entries().set(taskId, { controller, cancelReason: null });
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
    return entry.cancelReason;
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
}
