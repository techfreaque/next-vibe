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

import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { CountryLanguageValues } from "@/i18n/core/config";

import { clearLocalBroadcast, registerLocalBroadcast } from "./local-broadcast";
import { PROXY_LOADING_HTML } from "./proxy-loading-page";
import { getPubSubAdapter } from "./pubsub";
import type { AnyEndpointEventEnvelope } from "./structured-events";
import type {
  WsBatchEvent,
  WsClientMessage,
  WsConnectionData,
  WsWireMessage,
} from "./types";
import { authenticateWsRequest, authorizeWsChannel } from "./ws-channel-auth";

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
 * Broadcast to all subscribers on a channel (no user filter).
 * Used by pub/sub adapters that relay events from other processes.
 */
export function broadcastLocalToAll(
  channel: string,
  event: string,
  data: AnyEndpointEventEnvelope,
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
 * Broadcast multiple events to LOCAL subscribers in a single WS frame per socket.
 * More efficient than calling broadcastLocalToAll() N times when emitting a batch.
 * Access control is enforced at subscribe time (not at broadcast time).
 */
export function broadcastLocalBatch(events: WsBatchEvent[]): void {
  if (events.length === 0) {
    return;
  }

  // Collect union of all channels referenced
  const channelNames = [...new Set(events.map((e) => e.channel))];

  // Find all sockets subscribed to at least one of those channels
  const socketsToSend = new Set<ServerWebSocket<WsConnectionData>>();
  for (const ch of channelNames) {
    const subs = channels.get(ch);
    if (!subs) {
      continue;
    }
    for (const ws of subs) {
      socketsToSend.add(ws);
    }
  }

  if (socketsToSend.size === 0) {
    return;
  }

  // Assign seq numbers and build batch payload
  const eventsWithSeq = events.map((e) => {
    globalSeq++;
    return { ...e, seq: globalSeq };
  });
  const payload = JSON.stringify({ type: "batch", events: eventsWithSeq });

  for (const ws of socketsToSend) {
    try {
      ws.send(payload);
    } catch {
      // Socket may be closing - silently skip
    }
  }
}

/**
 * Publish an event through the pub/sub adapter.
 * NOTE: Route handlers should use createEndpointEmitter() from emitter.ts instead.
 */
export function publish(
  channel: string,
  event: string,
  data: AnyEndpointEventEnvelope,
): void {
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
    getPubSubAdapter().subscribe<AnyEndpointEventEnvelope>(
      channel,
      (event, data) => {
        broadcastLocalToAll(channel, event, data);
      },
    );
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
      getPubSubAdapter().unsubscribe(channel);
    }
  }
  ws.data.channels.delete(channel);
}

function unsubscribeFromAll(ws: ServerWebSocket<WsConnectionData>): void {
  for (const channel of ws.data.channels) {
    unsubscribeFromChannel(ws, channel);
  }
}

// ============================================================================
// RECENT REQUEST TRACKER - used to diagnose Next.js crashes
// ============================================================================

interface RecentRequest {
  method: string;
  path: string;
  ts: number; // Date.now() when request arrived
}

/** Rolling log of last 20 proxied requests - dumped when Next.js first goes ECONNREFUSED */
const recentRequests: RecentRequest[] = [];
const RECENT_REQUESTS_MAX = 20;

function trackRequest(method: string, path: string): void {
  recentRequests.push({ method, path, ts: Date.now() });
  if (recentRequests.length > RECENT_REQUESTS_MAX) {
    recentRequests.shift();
  }
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
    // Use max value (255s) instead of 0 - Bun 1.3.x ignores idleTimeout: 0
    // and falls back to the 10s uWS default, killing slow SSR cold-starts.
    // 255s covers even the slowest first-load (full dep pre-bundle ~30-60s).
    idleTimeout: 255,

    async fetch(req, bunServer): Promise<Response> {
      // Bun 1.3.x ignores timeout(req, 0) (same bug as idleTimeout: 0 being
      // ignored at the server level). Use 255 — the uWS max — to keep slow
      // SSR cold-starts and long-running SSE streams alive.
      bunServer.timeout(req, 255);

      const url = new URL(req.url);

      // ── Internal broadcast endpoint - called by Next.js to emit WS events ──
      // Next.js runs in a separate process and can't call broadcastLocal() directly,
      // so it POSTs here and the proxy calls broadcastLocal() in-process.
      // Restricted to loopback — only this machine's Next.js process may POST here.
      if (url.pathname === "/ws/broadcast" && req.method === "POST") {
        const remoteIp = bunServer.requestIP(req)?.address ?? "";
        if (remoteIp !== "127.0.0.1" && remoteIp !== "::1") {
          return new Response("Forbidden", { status: 403 });
        }
        try {
          const body = await req.json();
          if (
            body !== null &&
            typeof body === "object" &&
            "type" in body &&
            (body as { type: string }).type === "batch"
          ) {
            const batchBody = body as {
              type: "batch";
              events: WsBatchEvent[];
            };
            broadcastLocalBatch(batchBody.events);
          } else {
            const singleBody = body as {
              channel: string;
              event: string;
              data: WsWireMessage["data"];
            };
            broadcastLocalToAll(
              singleBody.channel,
              singleBody.event,
              singleBody.data,
            );
          }
          return new Response("ok", { status: 200 });
        } catch (err) {
          logger.error("[WS] /ws/broadcast POST failed to parse body", {
            error: err instanceof Error ? err.message : String(err),
          });
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
            user: {
              isPublic: true,
              leadId: "__proxy__",
              roles: [UserPermissionRole.PUBLIC],
            } satisfies JwtPayloadType,
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
        const localeParam = url.searchParams.get("locale");
        const upgradeLocale: CountryLanguage | null =
          localeParam !== null &&
          Object.values(CountryLanguageValues).includes(
            localeParam as CountryLanguage,
          )
            ? (localeParam as CountryLanguage)
            : null;

        const user = await authenticateWsRequest(req, logger);

        if (!user) {
          logger.warn("[WS] Rejected upgrade - missing lead_id cookie");
          return new Response("Missing lead_id cookie", { status: 401 });
        }

        if (channel) {
          if (!upgradeLocale) {
            return new Response("Missing locale", { status: 400 });
          }
          if (
            !(await authorizeWsChannel(user, channel, logger, upgradeLocale))
          ) {
            return new Response("Forbidden", { status: 403 });
          }
        }

        const upgraded = bunServer.upgrade(req, {
          data: {
            user,
            channels: new Set(channel ? [channel] : []),
            connectedAt: Date.now(),
          } satisfies WsConnectionData,
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
      // On ECONNREFUSED (Next.js restarting), retry with backoff for idempotent methods.
      // Non-idempotent methods (POST/PUT/PATCH/DELETE) cannot be safely retried and
      // their bodies must not be buffered in memory - return 503 immediately if Next.js
      // is down so bodies are never held across the retry window.
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

      // Only idempotent methods get retry logic. Non-idempotent methods are
      // proxied fire-and-forget (no body buffering, no retry on ECONNREFUSED).
      const isIdempotent =
        req.method === "GET" ||
        req.method === "HEAD" ||
        req.method === "OPTIONS";

      const PROXY_RETRY_DELAYS = isIdempotent
        ? [500, 1000, 2000, 4000, 8000]
        : [];
      // Proxy timeout is always high — timeout enforcement belongs on the app server
      // side via endpoint definition's timeoutMs, not here. The proxy must not cut
      // off long-running requests (SSR cold-start, media generation, execute-tool, etc.)
      // before the app server's own deadline fires.
      const PROXY_REQUEST_TIMEOUT_MS = 600_000;
      let lastProxyError = "Unknown error";
      const proxyStartMs = Date.now();
      trackRequest(req.method, url.pathname);

      // Bun's internal idle timeout can fire mid-stream and truncate the body
      // before all bytes reach the proxy. Buffer multipart (file uploads) and
      // JSON bodies (large sync payloads) upfront so Bun fully receives them
      // before we open the proxy connection. This is safe for non-idempotent
      // POSTs (no retry).
      let bufferedBody: Buffer | null = null;
      const contentType = req.headers.get("content-type") ?? "";
      const shouldBufferBody =
        contentType.includes("multipart/form-data") ||
        contentType.includes("application/json");
      if (!isIdempotent && shouldBufferBody && req.body) {
        try {
          bufferedBody = Buffer.from(await req.arrayBuffer());
        } catch {
          return new Response("Request body read failed", { status: 400 });
        }
      }

      for (let attempt = 0; attempt <= PROXY_RETRY_DELAYS.length; attempt++) {
        const proxyResult = await new Promise<Response | null>((resolve) => {
          let settled = false;
          // settle() wraps resolve() with a guard so the timeout and the
          // normal response path can't both resolve the Promise.
          const settle = (result: Response | null): void => {
            if (settled) {
              return;
            }
            settled = true;
            clearTimeout(timeoutHandle);
            // oxlint-disable-next-line promise/no-multiple-resolved -- `settled` guard prevents double-resolve; static analysis can't track it
            resolve(result);
          };
          const timeoutHandle = setTimeout(() => {
            proxyReq.destroy(new Error("upstream timeout"));
            settle(
              new Response(
                "Gateway Timeout: Vite dev server is not responding",
                { status: 504 },
              ),
            );
          }, PROXY_REQUEST_TIMEOUT_MS);
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

              settle(
                new Response(stream, {
                  status: proxyRes.statusCode ?? 200,
                  headers: resHeaders,
                }),
              );
            },
          );

          proxyReq.on("error", (err) => {
            const nodeErr = err as NodeJS.ErrnoException;
            const isConnRefused = nodeErr.code === "ECONNREFUSED";
            // On ECONNREFUSED while running - signal retry via null (idempotent only).
            // Non-idempotent methods and shutdown: return 502/503 immediately, no retry.
            if (isConnRefused && !shuttingDown && isIdempotent) {
              lastProxyError = nodeErr.code ?? err.message;
              // On first ECONNREFUSED, dump recent request history so we know what was running before crash
              if (attempt === 0) {
                logger.error(
                  "[Proxy] Next.js went down - recent requests before crash",
                  {
                    path: url.pathname,
                    method: req.method,
                    recentRequests: recentRequests.map((r) => ({
                      method: r.method,
                      path: r.path,
                      agoMs: Date.now() - r.ts,
                    })),
                  },
                );
              }
              settle(null); // null = retry
              return;
            }
            if (isConnRefused && !shuttingDown && !isIdempotent) {
              // Non-idempotent method, server not ready - return 503 immediately
              // so the body is never buffered and caller can retry on their own.
              settle(
                new Response("Service Unavailable", {
                  status: 503,
                  headers: { "retry-after": "5" },
                }),
              );
              return;
            }
            if (!shuttingDown) {
              logger.error("[Proxy] Server unreachable", {
                errorCode: nodeErr.code ?? "UNKNOWN",
                error: err.message,
                path: url.pathname,
                method: req.method,
                elapsedMs: Date.now() - proxyStartMs,
              });
            }
            settle(new Response("Bad Gateway", { status: 502 }));
          });

          // Send the request body to the upstream proxy.
          // Multipart and JSON bodies are pre-buffered above to avoid Bun's
          // idle timeout truncating large bodies mid-stream. All other
          // non-idempotent requests are streamed directly (no retry means
          // single-use is safe).
          if (bufferedBody !== null) {
            // Pre-buffered body - write all at once
            proxyReq.end(bufferedBody);
          } else if (req.body && !isIdempotent) {
            const reader = req.body.getReader();
            const pumpBody = (): void => {
              reader
                .read()
                .then(({ done, value }) => {
                  if (done) {
                    proxyReq.end();
                    return undefined;
                  }
                  if (!proxyReq.write(value)) {
                    // Backpressure: wait for drain before reading more
                    proxyReq.once("drain", pumpBody);
                  } else {
                    pumpBody();
                  }
                  return undefined;
                })
                .catch(() => {
                  proxyReq.destroy();
                });
            };
            pumpBody();
          } else {
            proxyReq.end();
          }
        });

        if (proxyResult !== null) {
          return proxyResult;
        }

        // Next.js not ready yet - wait before retrying (skip delay if shutting down)
        if (shuttingDown) {
          break;
        }
        const delay = PROXY_RETRY_DELAYS[attempt] ?? 8000;
        const mem = process.memoryUsage();
        logger.warn("[Proxy] Server not ready, retrying", {
          path: url.pathname,
          method: req.method,
          attempt: attempt + 1,
          delayMs: delay,
          elapsedMs: Date.now() - proxyStartMs,
          lastErrorCode: lastProxyError,
          uptime: Math.floor(process.uptime()),
          heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
          rssMb: Math.round(mem.rss / 1024 / 1024),
          targetPort: nextPort,
        });
        await new Promise<void>((resolve) => {
          setTimeout(resolve, delay);
        });
      }

      const mem = process.memoryUsage();
      logger.error("[Proxy] All retries exhausted - returning 502", {
        path: url.pathname,
        method: req.method,
        totalElapsedMs: Date.now() - proxyStartMs,
        lastErrorCode: lastProxyError,
        uptime: Math.floor(process.uptime()),
        heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
        rssMb: Math.round(mem.rss / 1024 / 1024),
        targetPort: nextPort,
      });
      // Loading page served when upstream Next.js is unreachable — see proxy-loading-page.ts
      return new Response(PROXY_LOADING_HTML, {
        status: 503,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "retry-after": "15",
          "cache-control": "no-store",
        },
      });
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
        // Normal /ws connection - register initial channels from query param
        const initialChannels = [...ws.data.channels];
        // Clear first since subscribeToChannel() re-adds them
        ws.data.channels.clear();
        for (const channel of initialChannels) {
          subscribeToChannel(ws, channel);
        }
        logger.debug(
          `[WS] Connection opened (channels: ${initialChannels.join(", ") || "none"})`,
        );
      },

      async message(ws, raw): Promise<void> {
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
          const rawStr =
            typeof raw === "string" ? raw : new TextDecoder().decode(raw);
          const msg = JSON.parse(rawStr) as WsClientMessage;

          if (msg.type === "subscribe") {
            if (
              !(await authorizeWsChannel(
                ws.data.user,
                msg.channel,
                logger,
                msg.locale,
              ))
            ) {
              return;
            }
            subscribeToChannel(
              ws as ServerWebSocket<WsConnectionData>,
              msg.channel,
            );
          } else if (msg.type === "unsubscribe") {
            unsubscribeFromChannel(
              ws as ServerWebSocket<WsConnectionData>,
              msg.channel,
            );
            logger.debug(`[WS] Unsubscribed from ${msg.channel}`);
          }
          // Unknown frame types are silently dropped.
        } catch (err) {
          const rawStr =
            typeof raw === "string" ? raw : new TextDecoder().decode(raw);
          logger.error("[WS] Failed to process client message", {
            error: err instanceof Error ? err.message : String(err),
            rawPreview: rawStr.slice(0, 500),
            subscribedChannels: [...ws.data.channels],
          });
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
