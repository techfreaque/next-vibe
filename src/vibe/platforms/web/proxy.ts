/**
 * Web proxy / WebSocket seam.
 *
 * ONE module owns every decision the built-in Bun HTTP+WebSocket proxy forces
 * on the web platform: reading VIBE_DISABLE_PROXY, the two port layouts it
 * selects between, and starting the Bun server itself.
 *
 * Before this file, that knowledge was duplicated inline in
 * ./dev/repository.ts and ./start/repository.ts — the same `disableProxy`
 * read, the same `NEXT_PORT_OFFSET` / `WS_SIDECAR_OFFSET` arithmetic, the same
 * dynamic `import("../../../realtime/server/server")`, twice. Both call sites
 * now ask this module instead, so the port layout is defined once and a
 * downstream build that ships without a realtime transport replaces exactly
 * this file (see `resolveWebProxyPorts` below for what a null implementation
 * has to return).
 *
 * Behaviour is unchanged from the inlined version:
 *
 *   proxy mode (default)              app server on port+NEXT_PORT_OFFSET
 *                                     Bun proxy on `port` (public)
 *   direct mode (VIBE_DISABLE_PROXY)  app server on `port`
 *                                     WS sidecar on port+WS_SIDECAR_OFFSET
 */

import "server-only";

import type { EndpointLogger } from "../../logger/types";
import { realtimeEnv } from "../../realtime/server/env";
import { serverSystemEnv } from "./env";

/**
 * Offset of the WebSocket sidecar in direct mode, where the app server already
 * owns the main port and the sidecar needs one of its own.
 */
export const WS_SIDECAR_OFFSET = 1000;

export interface WebProxyPorts {
  /** Port the app server (Next.js child / Vite) binds. */
  appPort: number;
  /** Port the Bun WebSocket server binds — the proxy port, or the sidecar. */
  wsPort: number;
  /** True when the built-in Bun proxy is opted out of. */
  disableProxy: boolean;
}

/**
 * Resolve the port layout for `port` (the port the user asked for).
 *
 * A build without a realtime transport substitutes
 * `{ appPort: port, wsPort: port, disableProxy: true }` — the app server takes
 * the public port directly and every `disableProxy` branch downstream folds to
 * the no-proxy side, which is exactly the shape those branches already had.
 */
export async function resolveWebProxyPorts(
  port: number,
): Promise<WebProxyPorts> {
  const { NEXT_PORT_OFFSET } = await import("../../realtime/server/server");
  const disableProxy = serverSystemEnv.VIBE_DISABLE_PROXY;
  return {
    appPort: disableProxy ? port : port + NEXT_PORT_OFFSET,
    wsPort: disableProxy ? port + WS_SIDECAR_OFFSET : port,
    disableProxy,
  };
}

export interface WebProxyHandle {
  /** Stop the Bun server. */
  stop: () => void;
  /** Open /ws sockets (deploy drain status). */
  clientCount: () => { clients: number; connectors: number };
  /** Close every /ws socket with 1012 so clients reconnect (deploy drain). */
  closeClients: () => number;
}

/**
 * ioredis internals in dependency order (leaves first). One `import("ioredis")`
 * evaluates all of them in a single synchronous require chain: 94-142 ms of
 * main-thread CPU at 15-41 s uptime on prod (2026-11-25..27, hot frames
 * ioredis/built/{utils/lodash,DataHandler,Redis}.js under bound require).
 * Importing the pieces one by one with a yield in between caps each slice
 * (~15 ms locally instead of 40-67 ms for the whole chain). Paths that a
 * future ioredis release moves are skipped; the final import then pays for
 * whatever is left.
 */
export const IOREDIS_WARM_STEPS = [
  "ioredis/built/utils/lodash.js",
  "ioredis/built/utils/debug.js",
  "ioredis/built/utils/index.js",
  "ioredis/built/Command.js",
  "ioredis/built/errors/index.js",
  "ioredis/built/DataHandler.js",
  "ioredis/built/redis/event_handler.js",
  "ioredis/built/connectors/index.js",
  "ioredis/built/Pipeline.js",
  "ioredis/built/transaction.js",
  "ioredis/built/cluster/index.js",
  "ioredis/built/Redis.js",
  "ioredis",
] as const;

let realtimeWarmup: Promise<void> | undefined;

function yieldToLoop(): Promise<void> {
  return new Promise((resolve) => {
    setImmediate(resolve);
  });
}

/**
 * Load the realtime server and its Redis client before the proxy binds its
 * port, in slices that let the event loop run in between. Memoized: boot
 * starts it early (overlapping the Next.js child startup) and
 * startWebProxy awaits the same promise right before Bun.serve.
 */
export function warmRealtimeModules(logger: EndpointLogger): Promise<void> {
  realtimeWarmup ??= (async (): Promise<void> => {
    if (realtimeEnv.WS_PUBSUB_TYPE === "redis" && realtimeEnv.REDIS_URL) {
      const skipped: string[] = [];
      for (const step of IOREDIS_WARM_STEPS) {
        await import(step).catch(() => {
          skipped.push(step);
        });
        await yieldToLoop();
      }
      if (skipped.length > 0) {
        logger.warn(
          "[Proxy] ioredis warm-up paths not found - the remaining module load runs in one slice",
          { skipped: skipped.join(", ") },
        );
      }
    }
    await import("../../realtime/server/server");
    await yieldToLoop();
  })();
  return realtimeWarmup;
}

/**
 * Start the Bun proxy + WebSocket server on `port`.
 *
 * Returns `undefined` in a build with no realtime transport; every caller
 * already stores the result optionally and stops it with `?.stop()`.
 */
export async function startWebProxy({
  port,
  appPort,
  isRendererReady,
  reusePort,
  logger,
}: {
  port: number;
  appPort?: number;
  isRendererReady?: () => boolean;
  reusePort?: boolean;
  logger: EndpointLogger;
}): Promise<WebProxyHandle | undefined> {
  await warmRealtimeModules(logger);
  const { startWebSocketServer } = await import("../../realtime/server/server");
  return startWebSocketServer({
    port,
    appPort,
    isRendererReady,
    reusePort,
    logger,
  });
}
