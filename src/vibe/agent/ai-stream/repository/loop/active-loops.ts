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
 * Begin draining: flip the flag so new streams are refused, then wait for every
 * in-flight loop to finish, up to `timeoutMs`. On timeout, abort whatever is
 * still running (so the process can exit) and resolve.
 *
 * Returns the number of loops still active when the wait ended (0 = clean).
 * Idempotent: a second call just waits again on whatever remains.
 */
export async function drainActiveLoops(
  timeoutMs: number,
  onProgress?: (remaining: number) => void,
): Promise<number> {
  draining = true;

  const deadline = Date.now() + Math.max(0, timeoutMs);
  const pollMs = 250;

  while (activeLoops.size > 0 && Date.now() < deadline) {
    onProgress?.(activeLoops.size);
    await new Promise<void>((resolve) => {
      setTimeout(resolve, pollMs);
    });
  }

  const remaining = activeLoops.size;
  if (remaining > 0) {
    // Timed out — abort the stragglers so the process can exit. Their abort
    // handlers persist partial content + settle credits (idempotent), same as
    // a user-initiated stop.
    for (const loop of activeLoops) {
      try {
        loop.abort("shutdown-drain-timeout");
      } catch {
        // best-effort; we are exiting regardless
      }
    }
  }
  return remaining;
}
