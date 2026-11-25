/**
 * LocalStreamRuns - process-local handles of the AI runs THIS process executes,
 * keyed by threadId.
 *
 * WHY: a cancel rides StreamControl (KeyedRemoteSignal over the WS hub), which
 * is fire-and-forget. When the running stream misses that signal (its hub
 * subscription was not live yet, or was lost on a hub restart), nothing stops
 * it. Stored threads have the DB `streaming_state` as the cross-process truth
 * and an orphan reap; incognito threads have no row, so before this registry
 * the cancel path could neither confirm the abort nor clean up.
 *
 * The cancel path uses this to:
 *   - abort a local run's controller DIRECTLY (confirmed, no hub hop), and
 *   - decide, after the reap delay, whether the cancelled run actually
 *     finalized (it deregisters only after its stream-finished emit).
 *
 * StreamControl stays the cross-process / cross-instance path; this registry
 * only adds certainty for the process that owns the run. Shared via globalThis
 * because the Next.js build inlines this module into several bundle layers.
 */

import "server-only";

import { AbortReason, StreamAbortError } from "./constants";

/** One in-flight run (loop + finalization) of this process. */
export interface LocalStreamRun {
  threadId: string;
  /** Ownership token of the run (ToolExecutionContextImpl.streamRunId). */
  runId: string | null;
  /** user id (signed in) or lead id (public) that started the run. */
  ownerKey: string;
  registeredAt: number;
  controller: AbortController;
}

declare global {
  var __vibeLocalStreamRuns: Map<string, LocalStreamRun> | undefined;
}

function runs(): Map<string, LocalStreamRun> {
  globalThis.__vibeLocalStreamRuns ??= new Map();
  return globalThis.__vibeLocalStreamRuns;
}

/** Result of a local cancel attempt. */
export interface LocalCancelResult {
  /** The run this process owns for the thread, if any. */
  run: LocalStreamRun | null;
  /** True when this call aborted the controller (false: already aborted / none). */
  abortedNow: boolean;
}

export const LocalStreamRuns = {
  /**
   * Register a run. Returns its deregister function, which only removes THIS
   * run (a newer run on the same thread keeps its entry). Call it once the run
   * has fully finalized (after its stream-finished emit).
   */
  register(run: Omit<LocalStreamRun, "registeredAt">): () => void {
    const entry: LocalStreamRun = { ...run, registeredAt: Date.now() };
    runs().set(run.threadId, entry);
    return (): void => {
      if (runs().get(run.threadId) === entry) {
        runs().delete(run.threadId);
      }
    };
  },

  get(threadId: string): LocalStreamRun | null {
    return runs().get(threadId) ?? null;
  },

  /** True while this exact run is still registered (has not finalized). */
  isLive(run: LocalStreamRun): boolean {
    return runs().get(run.threadId) === run;
  },

  /** Abort the local run of a thread with a user-cancel reason. */
  cancel(threadId: string): LocalCancelResult {
    const run = runs().get(threadId) ?? null;
    if (!run) {
      return { run: null, abortedNow: false };
    }
    if (run.controller.signal.aborted) {
      return { run, abortedNow: false };
    }
    run.controller.abort(new StreamAbortError(AbortReason.USER_CANCELLED));
    return { run, abortedNow: true };
  },

  /** Test helper: number of registered runs. */
  size(): number {
    return runs().size;
  },
};
