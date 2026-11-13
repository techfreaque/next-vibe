import "server-only";

/**
 * Active-loop registry — process-local set of in-flight {@link StreamLoop}s,
 * used by the graceful-shutdown drain (G1).
 *
 * WHY: a rolling / zero-downtime deploy sends the app SIGTERM. A naive handler
 * kills the process immediately, severing every in-flight AI stream (the user
 * sees a half-written answer vanish and is still billed for the tokens). The
 * drain instead STOPS accepting new streams, lets the live loops finish
 * naturally up to a bounded timeout, and only then exits. The load balancer
 * has already drained this node's new traffic (deregister → SIGTERM in the
 * rolling-deploy script), so no NEW stream should arrive during the window;
 * {@link isDraining} is the belt-and-suspenders guard for the race where one
 * slips in between deregister and SIGTERM.
 *
 * SCOPE: this registry is process-local. StreamLoops execute inside the
 * Next.js server process, so the SIGTERM handler that calls
 * {@link drainActiveLoops} must run in that same process — it is installed
 * from `src/instrumentation.ts` (Next's server-init hook). The `vibe start`
 * supervisor forwards SIGTERM to the Next child and waits for it to exit
 * (bounded) rather than hard-killing it, which is what gives this drain time
 * to run.
 */

/** A live loop the drain can wait on and, on timeout, abort. */
export interface DrainableLoop {
  /** Aborts the loop's stream (used only if the drain times out). */
  abort: (reason: string) => void;
}

const activeLoops = new Set<DrainableLoop>();

let draining = false;

/**
 * True once the drain has begun. Stream entrypoints check this and refuse to
 * start a NEW stream while the node is shutting down, so a request that slips
 * past LB deregistration is rejected cleanly instead of being killed mid-flight.
 */
export function isDraining(): boolean {
  return draining;
}

/** Register a loop as active. Call once, at the very start of `run()`. */
export function registerActiveLoop(loop: DrainableLoop): void {
  activeLoops.add(loop);
}

/** Deregister a loop. Call in `run()`'s `finally` so it always fires. */
export function deregisterActiveLoop(loop: DrainableLoop): void {
  activeLoops.delete(loop);
}

/** Current count of in-flight loops (diagnostics / health). */
export function activeLoopCount(): number {
  return activeLoops.size;
}

/**
 * Whole AI runs (the loop PLUS its finalization: credits, streaming-state
 * clear, stream-finished emit, the next queued message). A StreamLoop
 * deregisters before finalization runs, and an interactive run is detached
 * from its HTTP request, so the loop registry alone lets a drain exit while a
 * turn is still settling.
 */
const activeRuns = new Set<Promise<void>>();

/** Track a detached or awaited AI run until it settles (resolve or reject). */
export function trackActiveRun(run: Promise<void>): void {
  activeRuns.add(run);
  // The run's own error handling lives with its creator; this chain only
  // observes settlement (and must not surface a second unhandled rejection).
  run
    .finally(() => {
      activeRuns.delete(run);
    })
    .catch(() => undefined);
}

/** Current count of AI runs that have not settled yet. */
export function activeRunCount(): number {
  return activeRuns.size;
}

/** How long aborted stragglers get to persist partial content and settle. */
const ABORT_SETTLE_MS = 10_000;

/**
 * Begin draining: flip the flag so new streams are refused, then wait for every
 * in-flight loop and run (plus `extraBusy`, e.g. async tool tasks) to finish,
 * up to `timeoutMs`. On timeout, abort whatever is still running and give the
 * abort handlers up to {@link ABORT_SETTLE_MS} to save partial content, settle
 * credits and clear streaming state before resolving.
 *
 * Returns the busy count when the wait ended (0 = clean).
 * Idempotent: a second call just waits again on whatever remains.
 */
export async function drainActiveLoops(
  timeoutMs: number,
  onProgress?: (remaining: number) => void,
  extraBusy?: () => number,
): Promise<number> {
  draining = true;

  const busy = (): number =>
    activeLoops.size + activeRuns.size + (extraBusy?.() ?? 0);
  const deadline = Date.now() + Math.max(0, timeoutMs);
  const pollMs = 250;
  let lastReport = 0;

  while (busy() > 0 && Date.now() < deadline) {
    if (Date.now() - lastReport >= 5000) {
      lastReport = Date.now();
      onProgress?.(busy());
    }
    await new Promise<void>((resolve) => {
      setTimeout(resolve, pollMs);
    });
  }

  const remaining = busy();
  if (remaining > 0) {
    // Timed out — abort the stragglers so the process can exit. Their abort
    // handlers persist partial content + settle credits (idempotent), same as
    // a user-initiated stop; wait for them so that work is not cut too.
    for (const loop of activeLoops) {
      try {
        loop.abort("shutdown-drain-timeout");
      } catch {
        // best-effort; we are exiting regardless
      }
    }
    const settleDeadline = Date.now() + ABORT_SETTLE_MS;
    while (
      activeLoops.size + activeRuns.size > 0 &&
      Date.now() < settleDeadline
    ) {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, pollMs);
      });
    }
  }
  return remaining;
}
