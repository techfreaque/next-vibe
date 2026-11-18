/**
 * In-flight HTTP request counter for the deploy drain.
 *
 * A drain-based rolling deploy waits until the node's in-flight work reaches 0
 * before the container is recreated (`scripts/ha-node-drain.sh app-wait`,
 * `src/vibe/platforms/web/drain.ts`). AI runs and async tasks were counted, but
 * a plain long HTTP request (image generation POST: 30-120 s) was not, so the
 * recreate cut it off and the browser got a bare 502 from Caddy.
 *
 * Every API route handler (createNextHandler) brackets its request with
 * {@link trackInFlightRequest}; the `next` drain watcher (instrumentation.ts)
 * reports {@link inFlightRequestCount} as the `http` counter.
 *
 * State lives on globalThis: instrumentation.ts and the route handlers can be
 * separate bundles in the Next server, and a module-local counter would then
 * be two counters.
 */

declare global {
  var __vibeInFlightHttp: { count: number } | undefined;
}

function state(): { count: number } {
  globalThis.__vibeInFlightHttp ??= { count: 0 };
  return globalThis.__vibeInFlightHttp;
}

/** Count one request as in flight; call the returned function exactly once when it ends. */
export function trackInFlightRequest(): () => void {
  const s = state();
  s.count++;
  let done = false;
  return (): void => {
    if (done) {
      return;
    }
    done = true;
    s.count = Math.max(0, s.count - 1);
  };
}

/** API requests currently being handled by this process. */
export function inFlightRequestCount(): number {
  return state().count;
}
