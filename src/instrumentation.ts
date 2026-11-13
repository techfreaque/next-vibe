import type { Instrumentation } from "next";

/**
 * Persist server render errors to the error log.
 *
 * Production React replaces a Server Components render error with the opaque
 * "Minified React error #441" on the client; only its digest reaches the
 * browser error report. The real message and stack exist only here, on the
 * server, and used to live only in docker stdout (lost on every restart).
 * Logging them with the same digest makes the client report traceable.
 * API routes are skipped: endpointsHandler logs its own failures.
 */
export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  if (
    process.env["NEXT_RUNTIME"] !== "nodejs" ||
    context.routeType === "route"
  ) {
    return;
  }
  const { createEndpointLogger } = await import("@/vibe/logger/server");
  const { defaultLocale } = await import("@/vibe/core/i18n/core/config");
  const logger = createEndpointLogger(false, defaultLocale);
  const digest =
    error instanceof Error &&
    "digest" in error &&
    typeof error.digest === "string"
      ? error.digest
      : null;
  logger.error(
    "[Next] Server render error",
    error instanceof Error ? error : String(error),
    {
      digest,
      path: request.path,
      method: request.method,
      routePath: context.routePath,
      routeType: context.routeType,
      renderSource: context.renderSource ?? null,
    },
  );
};

/**
 * Stop accepting NEW connections on every listening server in this process
 * (Next's HTTP server). In-flight requests and open streams continue; Caddy
 * gets "connection refused" for new requests and retries them on the peer
 * node (lb_policy first), exactly like a stopped container, while this
 * process keeps running its AI loops to completion.
 */
async function closeListeningServers(): Promise<number> {
  const { Server } = await import("node:net");
  let closed = 0;
  for (const handle of process._getActiveHandles?.() ?? []) {
    if (handle instanceof Server && handle.listening) {
      handle.close();
      closed++;
    }
  }
  return closed;
}

/**
 * Next.js server-init hook (runs once in the Node server runtime).
 *
 * 1. DEPLOY DRAIN STATUS: while `scripts/ha-node-drain.sh` has asked this node
 *    to drain (see platforms/web/drain.ts), report the in-flight AI loops, AI
 *    runs (loop + finalization) and async tool tasks of this process, so the
 *    deploy recreates the container only once they reached 0.
 *
 * 2. GRACEFUL SHUTDOWN (G1). The `vibe start` server process forwards SIGTERM
 *    to this Next.js child, which runs with NEXT_MANUAL_SIG_HANDLE=true so
 *    Next's own handler (close + exit as soon as no HTTP request is open)
 *    does not cut the detached AI runs. This handler instead:
 *      a. stops accepting new connections (Caddy retries them on the peer),
 *      b. waits for every in-flight loop, run and async task up to
 *         STREAM_DRAIN_TIMEOUT_MS,
 *      c. on timeout aborts the stragglers and waits briefly for their abort
 *         handlers (partial content, credits, streaming state), cancels the
 *         async tasks (CANCELLED, not stuck RUNNING), then exits.
 *
 * Only the Node.js runtime gets this (the edge runtime has no AI loops).
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

  const { drainActiveLoops, activeLoopCount, activeRunCount } =
    await import("@/vibe/agent/ai-stream/repository/loop/active-loops");
  const { RunningTaskRegistry } =
    await import("@/vibe/tasks/watchdog/registry");
  const { startDrainWatcher } = await import("@/vibe/platforms/web/drain");

  startDrainWatcher({
    role: "next",
    counts: () => ({
      loops: activeLoopCount(),
      runs: activeRunCount(),
      tasks: RunningTaskRegistry.size(),
    }),
  });

  let draining = false;
  const onSignal = (signal: NodeJS.Signals): void => {
    if (draining) {
      return;
    }
    draining = true;
    const started = Date.now();
    void closeListeningServers()
      .catch(() => 0)
      .then((closedServers) => {
        // eslint-disable-next-line no-console
        console.log(
          `[shutdown] ${signal} received: closed ${String(closedServers)} listener(s), draining ${String(activeRunCount())} AI run(s), ${String(RunningTaskRegistry.size())} async task(s) (timeout ${String(STREAM_DRAIN_TIMEOUT_MS)}ms)`,
        );
        return drainActiveLoops(
          STREAM_DRAIN_TIMEOUT_MS,
          (remaining) => {
            // eslint-disable-next-line no-console
            console.log(`[shutdown] still draining: ${String(remaining)} busy`);
          },
          () => RunningTaskRegistry.size(),
        );
      })
      .then(async (remaining) => {
        if (remaining > 0 && RunningTaskRegistry.cancelAll("server-shutdown")) {
          // Let the cancelled tasks write their CANCELLED rows.
          const deadline = Date.now() + 5000;
          while (RunningTaskRegistry.size() > 0 && Date.now() < deadline) {
            await new Promise<void>((resolve) => {
              setTimeout(resolve, 250);
            });
          }
        }
        const secs = ((Date.now() - started) / 1000).toFixed(1);
        // eslint-disable-next-line no-console
        console.log(
          remaining > 0
            ? `[shutdown] drain window elapsed after ${secs}s: aborted ${String(remaining)} straggler(s), exiting`
            : `[shutdown] all AI work drained cleanly in ${secs}s, exiting`,
        );
        process.exit(0);
      })
      .catch(() => process.exit(0));
  };

  process.once("SIGTERM", () => onSignal("SIGTERM"));
  process.once("SIGINT", () => onSignal("SIGINT"));
}
