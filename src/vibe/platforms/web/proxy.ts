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
}

/**
 * Start the Bun proxy + WebSocket server on `port`.
 *
 * Returns `undefined` in a build with no realtime transport; every caller
 * already stores the result optionally and stops it with `?.stop()`.
 */
export async function startWebProxy({
  port,
  logger,
}: {
  port: number;
  logger: EndpointLogger;
}): Promise<WebProxyHandle | undefined> {
  const { startWebSocketServer } = await import("../../realtime/server/server");
  return startWebSocketServer({ port, logger });
}
