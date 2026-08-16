/**
 * WebSocket server (+ HTTP-proxy composition).
 *
 * Single Bun.serve() on the main port that:
 *   1. Owns all WebSocket concerns in-process: the /ws upgrade, channel
 *      registry, subscribe/unsubscribe, broadcast, and the /ws/broadcast sink.
 *   2. Delegates every non-WS HTTP request to handleHttpProxy (http-proxy.ts),
 *      which reverse-proxies to Next.js on an internal port (main + offset).
 *
 * The WS concern and the web-proxy concern are separate modules; this file only
 * composes them — WS first, proxy as the fallback.
 *
 * Auth uses httpOnly cookies (token + lead_id), sent automatically because
 * cookies are scoped by domain+path, not port.
 *
 * NOTE: Bun CLI context only (dynamically imported from dev/start repositories).
 */

/// <reference types="bun-types" />

// Side-effect import: claims the emitter's relay slot (core/relay-hook). The
// emitter no longer reaches for the bridge itself, so SOMETHING in a process that
// can relay has to load it — and "runs the WS server" is exactly the set of
// processes that have a database and peers. A CLI/MCP process never imports this
// module, which is the point: no bridge, no DB, relay simply off.
import "../remote-event-bridge/repository";

import type { ServerWebSocket } from "bun";
import { z } from "zod";

import type { CountryLanguage } from "../../core/i18n/core/config";
import { CountryLanguageValues } from "../../core/i18n/core/config";
import type { JwtPayloadType } from "../../identity/auth/types";
import { UserPermissionRole } from "../../identity/roles/enum";
import type { EndpointLogger } from "../../logger/types";
import {
  clearLocalBroadcast,
  registerLocalBroadcast,
} from "../core/local-broadcast";
import type { AnyEndpointEventEnvelope } from "../core/structured-events";
import type {
  WsBatchEvent,
  WsConnectionData,
  WsWireMessage,
} from "../core/types";
import { parseWsClientMessage } from "../core/types";
import { handleHttpProxy } from "./http-proxy";
import { getPubSubAdapter } from "./pubsub/index";
import { authenticateWsRequest, authorizeWsChannel } from "./ws-channel-auth";

// ============================================================================
// CHANNEL REGISTRY (singleton)
// ============================================================================

/** All active /ws connections, keyed by channel → set of sockets */
const channels = new Map<string, Set<ServerWebSocket<WsConnectionData>>>();

/**
 * Reverse-ws connector sockets, keyed by connectorInstanceId.
 * Populated on upgrade when the ?connectorInstanceId= param is present.
 * Lets disconnect close the inbound socket immediately without waiting
 * for the remote side to close its outbound connector first.
 */
const connectorSockets = new Map<string, ServerWebSocket<WsConnectionData>>();

function closeConnectorSocket(instanceId: string): void {
  const ws = connectorSockets.get(instanceId);
  if (!ws) {
    return;
  }
  connectorSockets.delete(instanceId);
  try {
    ws.close();
  } catch {
    /* already closing */
  }
}

/**
 * True for every spelling of the loopback address. The proxy listens on "::",
 * so an IPv4 loopback peer is reported as the IPv4-mapped form
 * "::ffff:127.0.0.1"; plain "127.0.0.1" and IPv6 "::1" also occur.
 */
function isLoopbackAddress(addr: string): boolean {
  return (
    addr === "127.0.0.1" ||
    addr === "::1" ||
    addr === "::ffff:127.0.0.1" ||
    addr.startsWith("127.")
  );
}

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

  // The relay subscription re-broadcasts events that arrive FROM the pub/sub
  // layer (another process/instance). The local adapter's publish() already
  // broadcasts to this process's sockets itself — registering the relay there
  // would deliver every published event twice to every socket.
  const adapter = getPubSubAdapter();
  if (isNewChannel && !adapter.deliversToLocalSockets) {
    adapter.subscribe<AnyEndpointEventEnvelope>(channel, (event, data) => {
      broadcastLocalToAll(channel, event, data);
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
      // Symmetric to subscribeToChannel: no relay subscription was registered
      // for a locally-delivering adapter, so don't tear one down either (it
      // could remove an unrelated server-side handler on the same channel).
      const adapter = getPubSubAdapter();
      if (!adapter.deliversToLocalSockets) {
        adapter.unsubscribe(channel);
      }
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

interface WebSocketServerOptions {
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
      // Restricted to loopback — only this machine's app process may POST here.
      // The server listens on "::", so a v4 loopback peer arrives as the
      // IPv4-mapped form "::ffff:127.0.0.1"; accept all loopback spellings.
      if (url.pathname === "/ws/broadcast" && req.method === "POST") {
        const remoteIp = bunServer.requestIP(req)?.address ?? "";
        if (!isLoopbackAddress(remoteIp)) {
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
            // Publish through the pub/sub adapter (NOT broadcastLocalToAll
            // directly): the adapter fans out to WS sockets AND fires any
            // in-process server-side subscribers (KeyedRemoteSignal). This makes
            // the hub the authoritative cross-process bus — a loopback POST from
            // another process reaches BOTH WS-client subscribers and in-hub
            // inline subscribers, so publish/subscribe co-locate freely.
            getPubSubAdapter().publish(
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
        const localeParse = z
          .enum(CountryLanguageValues)
          .safeParse(localeParam);
        const upgradeLocale: CountryLanguage | null = localeParse.success
          ? localeParse.data
          : null;

        const user = await authenticateWsRequest(req, logger);

        if (!user) {
          const cookieHeader = req.headers.get("cookie") ?? "";
          logger.warn("[WS] Rejected upgrade - missing lead_id cookie", {
            userAgent: req.headers.get("user-agent") ?? undefined,
            origin: req.headers.get("origin") ?? undefined,
            ip:
              req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
              bunServer.requestIP(req)?.address ??
              undefined,
            hasCookieHeader: cookieHeader.length > 0,
            cookieNames: cookieHeader
              ? cookieHeader
                  .split(";")
                  .map((c) => c.trim().split("=")[0])
                  .filter(Boolean)
              : [],
          });
          return new Response("Missing lead_id cookie", { status: 401 });
        }

        if (channel) {
          if (!upgradeLocale) {
            return new Response("Missing locale", { status: 400 });
          }
          // Upgrade-time channels are only user/ (connector + server-to-server).
          // Endpoint (ws-*) channels are always subscribed via the post-upgrade
          // message protocol, where the structured descriptor travels — so no
          // descriptor is available (or needed) here.
          if (
            !(await authorizeWsChannel(
              user,
              channel,
              undefined,
              logger,
              upgradeLocale,
            ))
          ) {
            return new Response("Forbidden", { status: 403 });
          }
        }

        const connectorInstanceId =
          url.searchParams.get("connectorInstanceId") ?? undefined;

        const upgraded = bunServer.upgrade(req, {
          data: {
            user,
            channels: new Set(channel ? [channel] : []),
            connectedAt: Date.now(),
            connectorInstanceId,
          } satisfies WsConnectionData,
        });

        if (!upgraded) {
          return new Response("WebSocket upgrade failed", { status: 426 });
        }

        // Unreachable after successful upgrade
        return new Response(null, { status: 101 });
      }

      // ── Everything else → the HTTP proxy to Next.js ──────────────────────
      // Pure web-proxy concern (retry/backoff, streaming) lives in http-proxy.ts.
      return handleHttpProxy(req, {
        nextPort,
        logger,
        isShuttingDown: () => shuttingDown,
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
        if (ws.data.connectorInstanceId) {
          connectorSockets.set(
            ws.data.connectorInstanceId,
            ws as ServerWebSocket<WsConnectionData>,
          );
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
          const msg = parseWsClientMessage(rawStr);
          if (!msg) {
            logger.warn("[WS] Ignored malformed client message", {
              rawPreview: rawStr.slice(0, 200),
            });
            return;
          }

          if (msg.type === "subscribe") {
            if (
              !(await authorizeWsChannel(
                ws.data.user,
                msg.channel,
                msg.descriptor,
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
        if (ws.data.connectorInstanceId) {
          connectorSockets.delete(ws.data.connectorInstanceId);
        }
        unsubscribeFromAll(ws as ServerWebSocket<WsConnectionData>);
        logger.debug("[WS] Connection closed");
      },
    },
  });

  logger.debug(`[WS] Proxy server started on :${port}`);

  // Expose direct in-process delivery so emits originating in THIS process skip
  // the loopback /ws/broadcast POST. Separate-process callers still POST.
  registerLocalBroadcast({
    broadcastToAll: broadcastLocalToAll,
    broadcastBatch: broadcastLocalBatch,
    getChannelSize,
    closeConnectorSocket,
  });

  return {
    stop: (): void => {
      shuttingDown = true;
      clearLocalBroadcast();
      server.stop(true);
    },
    nextPort,
  };
}
