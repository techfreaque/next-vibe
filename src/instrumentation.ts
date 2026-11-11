/**
 * Next.js server-init hook (runs once in the Node server runtime).
 *
 * Installs the GRACEFUL SHUTDOWN DRAIN (G1) for in-flight AI streams. The
 * `vibe start` supervisor forwards SIGTERM to this Next.js child on a rolling
 * deploy / scale-in; by the time that happens the load balancer has already
 * deregistered this node (rolling-deploy script), so no NEW HTTP traffic is
 * arriving. This handler then:
 *   1. flips the drain flag (health endpoint starts reporting "draining" so any
 *      LB that is still health-checking fails this node fast),
 *   2. awaits every in-flight StreamLoop up to STREAM_DRAIN_TIMEOUT_MS,
 *   3. aborts whatever is still running (its abort handler saves partial content
 *      + settles credits, like a user cancel), then lets the process exit.
 *
 * This is what makes rolling deploys stream-safe: no half-written answer is
 * severed as long as it finishes within the drain window.
 *
 * Only the Node.js runtime gets the handler (the edge runtime has no AI loops).
 */
export async function register(): Promise<void> {
  if (process.env["NEXT_RUNTIME"] !== "nodejs") {
    return;
  }

  // Bounded drain window. Long enough for a typical multi-step agent turn to
  // land, short enough that a deploy never stalls. Overridable via env.
  const parsed = Number.parseInt(
    process.env["STREAM_DRAIN_TIMEOUT_MS"] ?? "",
    10,
  );
  const STREAM_DRAIN_TIMEOUT_MS =
    Number.isFinite(parsed) && parsed > 0 ? parsed : 90_000;

  const { drainActiveLoops, activeLoopCount } =
    await import("@/vibe/agent/ai-stream/repository/loop/active-loops");

  let draining = false;
  const onSignal = (signal: NodeJS.Signals): void => {
    if (draining) {
      return;
    }
    draining = true;
    const started = Date.now();
    const initial = activeLoopCount();
    // eslint-disable-next-line no-console
    console.log(
      `[shutdown] ${signal} received — draining ${initial} in-flight AI stream(s) (timeout ${STREAM_DRAIN_TIMEOUT_MS}ms)`,
    );
    void drainActiveLoops(STREAM_DRAIN_TIMEOUT_MS, (remaining) => {
      // eslint-disable-next-line no-console
      console.log(`[shutdown] still draining — ${remaining} loop(s) left`);
    })
      .then((remaining) => {
        const secs = ((Date.now() - started) / 1000).toFixed(1);
        // eslint-disable-next-line no-console
        console.log(
          remaining > 0
            ? `[shutdown] drain window elapsed after ${secs}s — aborted ${remaining} straggler(s), exiting`
            : `[shutdown] all AI streams drained cleanly in ${secs}s — exiting`,
        );
        process.exit(0);
      })
      .catch(() => process.exit(0));
  };

  process.once("SIGTERM", () => onSignal("SIGTERM"));
  process.once("SIGINT", () => onSignal("SIGINT"));
}
