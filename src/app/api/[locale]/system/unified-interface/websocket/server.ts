/**
 * WebSocket + HTTP Proxy Server
 *
 * Single Bun.serve() on the main port that:
 *   1. Handles WebSocket upgrades at /ws in-process (no sidecar)
 *   2. Proxies all other HTTP traffic to Next.js on an internal port (main + 1)
 *
 * Architecture:
 *   Browser → Bun proxy (port 3000/3001) for HTTP + WS
 *   Bun proxy → Next.js (port 3001/3002, internal) for HTTP
 *
 * Auth uses httpOnly cookies (token + lead_id), sent automatically
 * because cookies are scoped by domain+path, not port.
 *
 * NOTE: This file runs only in Bun CLI context (dynamically imported
 * from dev/repository.ts and start/repository.ts).
 */

/// <reference types="bun-types" />

import http from "node:http";

import type { ServerWebSocket } from "bun";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  AUTH_TOKEN_COOKIE_NAME,
  LEAD_ID_COOKIE_NAME,
} from "@/config/constants";

import type { PubSubAdapter } from "./pubsub/types";
import type { WsClientMessage, WsConnectionData, WsWireMessage } from "./types";

/** Type for the lazy-required pubsub module to avoid inline import() annotations */
interface PubSubModule {
  getPubSubAdapter: () => PubSubAdapter;
}

// ============================================================================
// CHANNEL REGISTRY (singleton)
// ============================================================================

/** All active /ws connections, keyed by channel → set of sockets */
const channels = new Map<string, Set<ServerWebSocket<WsConnectionData>>>();

/** Global sequence counter for event ordering */
let globalSeq = 0;

/** Set to true during shutdown to suppress expected proxy errors */
let shuttingDown = false;

/**
 * Broadcast an event to LOCAL subscribers of a channel (this process only).
 * Called directly by the emitter (same process - no HTTP POST needed).
 */
export function broadcastLocal(
  channel: string,
  event: string,
  data: WsWireMessage["data"],
): void {
  const subscribers = channels.get(channel);
  if (!subscribers || subscribers.size === 0) {
    return;
  }

  globalSeq++;
  const message: WsWireMessage = {
    channel,
    event,
    data,
    seq: globalSeq,
  };

  const payload = JSON.stringify(message);
  for (const ws of subscribers) {
    try {
      ws.send(payload);
    } catch {
      // Socket may be closing - silently skip
    }
  }
}

/**
 * Publish an event through the pub/sub adapter.
 * NOTE: Route handlers should use createEmitter() from emitter.ts instead.
 */
export function publish(
  channel: string,
  event: string,
  data: WsWireMessage["data"],
): void {
  // Lazy import to avoid circular dependency at module load time
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getPubSubAdapter } = require("./pubsub") as PubSubModule;
  getPubSubAdapter().publish(channel, event, data);
}

/**
 * Get the number of active connections on a channel.
 */
export function getChannelSize(channel: string): number {
  return channels.get(channel)?.size ?? 0;
}

// ============================================================================
// CONNECTION MANAGEMENT
// ============================================================================

function subscribeToChannel(
  ws: ServerWebSocket<WsConnectionData>,
  channel: string,
): void {
  let set = channels.get(channel);
  const isNewChannel = !set;
  if (!set) {
    set = new Set();
    channels.set(channel, set);
  }
  set.add(ws);
  ws.data.channels.add(channel);

  if (isNewChannel) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getPubSubAdapter } = require("./pubsub") as PubSubModule;
    getPubSubAdapter().subscribe(channel, (event, data) => {
      broadcastLocal(channel, event, data);
    });
  }
}

function unsubscribeFromChannel(
  ws: ServerWebSocket<WsConnectionData>,
  channel: string,
): void {
  const set = channels.get(channel);
  if (set) {
    set.delete(ws);
    if (set.size === 0) {
      channels.delete(channel);
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getPubSubAdapter } = require("./pubsub") as PubSubModule;
      getPubSubAdapter().unsubscribe(channel);
    }
  }
  ws.data.channels.delete(channel);
}

function unsubscribeFromAll(ws: ServerWebSocket<WsConnectionData>): void {
  for (const channel of ws.data.channels) {
    const set = channels.get(channel);
    if (set) {
      set.delete(ws);
      if (set.size === 0) {
        channels.delete(channel);
      }
    }
  }
  ws.data.channels.clear();
}

// ============================================================================
// AUTH
// ============================================================================

/** Parse a single cookie value from a Cookie header string */
function parseCookieValue(
  cookieHeader: string,
  name: string,
): string | undefined {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match?.[1];
}

/** Verify JWT from cookie and return userId + leadId */
async function authenticateFromCookies(
  req: Request,
  logger: EndpointLogger,
): Promise<{ userId: string | null; leadId: string | null }> {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const token = parseCookieValue(cookieHeader, AUTH_TOKEN_COOKIE_NAME);
  const leadId = parseCookieValue(cookieHeader, LEAD_ID_COOKIE_NAME) ?? null;

  if (!token) {
    return { userId: null, leadId };
  }

  try {
    const { AuthRepository } =
      await import("@/app/api/[locale]/user/auth/repository");
    const result = await AuthRepository.verifyJwt(token, logger, "en-US");

    if (result.success) {
      return { userId: result.data.id, leadId: result.data.leadId ?? leadId };
    }
  } catch {
    logger.debug("[WS] JWT verification failed during upgrade");
  }

  return { userId: null, leadId };
}

// ============================================================================
// SERVER FACTORY
// ============================================================================

/** Extended connection data for proxied WS connections (e.g. Next.js HMR) */
interface WsConnectionDataWithProxy extends WsConnectionData {
  proxyWs?: WebSocket;
}

/**
 * Next.js runs on this offset above the main port (internal only).
 * Main port 3000 → Next.js on 3100 (internal, vibe dev)
 * Main port 3001 → Next.js on 3101 (internal, vibe start)
 * Large offset avoids collision between dev and start running simultaneously.
 */
export const NEXT_PORT_OFFSET = 100;

export interface WebSocketServerOptions {
  /** Main public-facing port */
  port: number;
  logger: EndpointLogger;
  /** Optional hostname (default: "0.0.0.0") */
  hostname?: string;
}

export interface WebSocketServerHandle {
  /** Stop the Bun server */
  stop: () => void;
  /** Internal Next.js port (main port + NEXT_PORT_OFFSET) */
  nextPort: number;
}

/**
 * Start the Bun proxy + WebSocket server on the main port.
 * WebSocket upgrades to /ws are handled in-process.
 * All other requests are proxied to Next.js on port + NEXT_PORT_OFFSET.
 *
 * IMPORTANT: This function must only be called in Bun runtime context.
 */
export function startWebSocketServer(
  options: WebSocketServerOptions,
): WebSocketServerHandle {
  // Default to "::" which binds both IPv4 and IPv6 on Linux
  // so Chrome's localhost→[::1] resolution works alongside IPv4 curl/fetch.
  const { port, logger, hostname = "::" } = options;
  const nextPort = port + NEXT_PORT_OFFSET;

  const server = Bun.serve<WsConnectionDataWithProxy>({
    port,
    hostname,
    reusePort: true, // allow re-binding after restart without waiting for TIME_WAIT
    idleTimeout: 0, // 0 = no idle timeout; SSR renders can take >10s on cold start

    async fetch(req, bunServer): Promise<Response> {
      // Disable per-request idle timeout so long SSR renders (cold module
      // evaluation, slow DB queries) don't get killed mid-flight.
      // The server-level idleTimeout only covers WebSocket connections;
      // HTTP requests use a separate 10s default that must be reset here.
      bunServer.timeout(req, 0);

      const url = new URL(req.url);

      // ── Internal broadcast endpoint - called by Next.js to emit WS events ──
      // Next.js runs in a separate process and can't call broadcastLocal() directly,
      // so it POSTs here and the proxy calls broadcastLocal() in-process.
      if (url.pathname === "/ws/broadcast" && req.method === "POST") {
        try {
          const body = (await req.json()) as {
            channel: string;
            event: string;
            data: WsWireMessage["data"];
          };
          broadcastLocal(body.channel, body.event, body.data);
          return new Response("ok", { status: 200 });
        } catch {
          return new Response("Bad Request", { status: 400 });
        }
      }

      // ── Proxy non-/ws WebSocket upgrades to internal Next.js (e.g. HMR) ──
      if (
        url.pathname !== "/ws" &&
        req.headers.get("upgrade")?.toLowerCase() === "websocket"
      ) {
        const targetUrl = `ws://127.0.0.1:${String(nextPort)}${url.pathname}${url.search}`;
        // Open upstream WS connection, then upgrade the browser connection.
        // Messages are bridged in the websocket handlers below.
        // Forward the subprotocol (e.g. "vite-hmr") so Vite accepts the connection.
        const subprotocol =
          req.headers.get("sec-websocket-protocol") ?? undefined;
        const upstream = new WebSocket(
          targetUrl,
          subprotocol ? [subprotocol] : undefined,
        );
        const upgraded = bunServer.upgrade(req, {
          data: {
            userId: null,
            leadId: "__proxy__",
            channels: new Set<string>(),
            connectedAt: Date.now(),
            proxyWs: upstream,
          } satisfies WsConnectionDataWithProxy,
        });
        if (!upgraded) {
          upstream.close();
          return new Response("WebSocket upgrade failed", { status: 426 });
        }
        return new Response(null, { status: 101 });
      }

      // ── WebSocket upgrade at /ws ──────────────────────────────────────────
      if (
        url.pathname === "/ws" &&
        req.headers.get("upgrade")?.toLowerCase() === "websocket"
      ) {
        const channel = url.searchParams.get("channel");

        const { userId, leadId } = await authenticateFromCookies(req, logger);

        if (!leadId) {
          logger.warn("[WS] Rejected upgrade - missing lead_id cookie");
          return new Response("Missing lead_id cookie", { status: 401 });
        }

        const upgraded = bunServer.upgrade(req, {
          data: {
            userId,
            leadId,
            channels: new Set(channel ? [channel] : []),
            connectedAt: Date.now(),
          },
        });

        if (!upgraded) {
          return new Response("WebSocket upgrade failed", { status: 426 });
        }

        // Unreachable after successful upgrade
        return new Response(null, { status: 101 });
      }

      // ── Proxy everything else to Next.js ─────────────────────────────────
      // Use a raw Node http pipe instead of fetch() - Bun's fetch auto-decompresses
      // responses which breaks streaming SSR and compressed assets.
      // On ECONNREFUSED (Next.js restarting), retry with backoff so the browser
      // gets a real response once Next.js recovers instead of a hard 502.
      const clientIp =
        req.headers.get("x-forwarded-for") ??
        req.headers.get("x-real-ip") ??
        "127.0.0.1";
      const outHeaders: Record<string, string> = {};
      req.headers.forEach((value, key) => {
        outHeaders[key] = value;
      });
      outHeaders["host"] = `127.0.0.1:${String(nextPort)}`;
      outHeaders["x-forwarded-for"] = clientIp;
      outHeaders["x-forwarded-proto"] = url.protocol.replace(":", "");
      // Forward the original public host so Nitro builds redirect URLs using
      // the proxy port (e.g. 3000) rather than the internal Vite port (3100).
      outHeaders["x-forwarded-host"] = req.headers.get("host") ?? url.host;

      // Read body once before retry loop (body can only be consumed once)
      const bodyBuffer =
        req.body && req.method !== "GET" && req.method !== "HEAD"
          ? Buffer.from(await req.arrayBuffer())
          : null;

      const PROXY_RETRY_DELAYS = [500, 1000, 2000, 4000, 8000];
      let lastProxyError = "Unknown error";

      for (let attempt = 0; attempt <= PROXY_RETRY_DELAYS.length; attempt++) {
        const proxyResult = await new Promise<Response | null>((resolve) => {
          const proxyReq = http.request(
            {
              hostname: "127.0.0.1",
              port: nextPort,
              path: `${url.pathname}${url.search}`,
              method: req.method,
              headers: outHeaders,
            },
            (proxyRes) => {
              // Use Headers so Set-Cookie entries are appended individually
              // (joining multiple Set-Cookie with ", " breaks them)
              const resHeaders = new Headers();
              for (const [key, value] of Object.entries(proxyRes.headers)) {
                if (value === undefined) {
                  continue;
                }
                if (Array.isArray(value)) {
                  for (const v of value) {
                    resHeaders.append(key, v);
                  }
                } else {
                  resHeaders.set(key, value);
                }
              }

              // Stream the raw (possibly compressed) body straight to the browser
              const stream = new ReadableStream({
                start(controller): void {
                  proxyRes.on("data", (chunk: Buffer) => {
                    controller.enqueue(chunk);
                  });
                  proxyRes.on("end", () => {
                    controller.close();
                  });
                  proxyRes.on("error", (err) => {
                    controller.error(err);
                  });
                },
              });

              resolve(
                new Response(stream, {
                  status: proxyRes.statusCode ?? 200,
                  headers: resHeaders,
                }),
              );
            },
          );

          proxyReq.on("error", (err) => {
            const isConnRefused =
              (err as NodeJS.ErrnoException).code === "ECONNREFUSED";
            // On ECONNREFUSED while running - signal retry via null.
            // While shutting down - return 502 immediately, no retry.
            if (isConnRefused && !shuttingDown) {
              lastProxyError = err.message;
              resolve(null); // null = retry
              return;
            }
            if (!shuttingDown) {
              logger.error("[Proxy] Server unreachable", {
                error: err.message,
                path: url.pathname,
              });
            }
            resolve(new Response("Bad Gateway", { status: 502 }));
          });

          // Write buffered body
          if (bodyBuffer) {
            proxyReq.write(bodyBuffer);
          }
          proxyReq.end();
        });

        if (proxyResult !== null) {
          return proxyResult;
        }

        // Next.js not ready yet - wait before retrying (skip delay if shutting down)
        if (shuttingDown) {
          break;
        }
        const delay = PROXY_RETRY_DELAYS[attempt] ?? 8000;
        logger.warn("[Proxy] Server not ready, retrying", {
          attempt: attempt + 1,
          delayMs: delay,
          path: url.pathname,
        });
        await new Promise<void>((resolve) => {
          setTimeout(resolve, delay);
        });
      }

      return new Response(`Bad Gateway: ${lastProxyError}`, { status: 502 });
    },

    websocket: {
      open(ws): void {
        // Proxy connection - wire up upstream → browser bridging
        if (ws.data.proxyWs) {
          const upstream = ws.data.proxyWs;
          upstream.addEventListener("message", (event): void => {
            try {
              ws.send(
                typeof event.data === "string"
                  ? event.data
                  : (event.data as ArrayBuffer),
              );
            } catch {
              // Socket may be closing - silently skip
            }
          });
          upstream.addEventListener("close", (): void => {
            ws.close();
          });
          upstream.addEventListener("error", (): void => {
            ws.close();
          });
          return;
        }
        // Normal /ws connection
        for (const channel of ws.data.channels) {
          let set = channels.get(channel);
          if (!set) {
            set = new Set();
            channels.set(channel, set);
          }
          set.add(ws as ServerWebSocket<WsConnectionData>);
        }
        logger.debug(
          `[WS] Connection opened (channels: ${[...ws.data.channels].join(", ") || "none"})`,
        );
      },

      message(ws, raw): void {
        // Proxy connection - forward browser → upstream
        if (ws.data.proxyWs) {
          try {
            ws.data.proxyWs.send(raw as string | ArrayBuffer);
          } catch {
            // Upstream socket may be closing - silently skip
          }
          return;
        }
        // Normal /ws connection
        try {
          const msg = JSON.parse(
            typeof raw === "string" ? raw : new TextDecoder().decode(raw),
          ) as WsClientMessage;

          if (msg.type === "subscribe") {
            subscribeToChannel(
              ws as ServerWebSocket<WsConnectionData>,
              msg.channel,
            );
            logger.debug(`[WS] Subscribed to ${msg.channel}`);
          } else if (msg.type === "unsubscribe") {
            unsubscribeFromChannel(
              ws as ServerWebSocket<WsConnectionData>,
              msg.channel,
            );
            logger.debug(`[WS] Unsubscribed from ${msg.channel}`);
          }
        } catch {
          logger.warn("[WS] Invalid message received");
        }
      },

      close(ws): void {
        // Proxy connection - close upstream
        if (ws.data.proxyWs) {
          ws.data.proxyWs.close();
          return;
        }
        unsubscribeFromAll(ws as ServerWebSocket<WsConnectionData>);
        logger.debug("[WS] Connection closed");
      },
    },
  });

  logger.debug(`[WS] Proxy server started on :${port}`);

  return {
    stop: (): void => {
      shuttingDown = true;
      server.stop(true);
    },
    nextPort,
  };
}
