/**
 * WebSocket Sidecar Server
 *
 * Standalone Bun.serve() that handles ONLY WebSocket connections.
 * Runs on a separate port (Next.js port + 1000):
 *   - Dev:  Next.js on 3000, WS on 4000
 *   - Prod: Next.js on 3001, WS on 4001
 *
 * Architecture:
 *   Browser → Next.js (port 3000/3001) for HTTP
 *   Browser → WS sidecar (port 4000/4001) for WebSocket
 *
 * Auth uses httpOnly cookies (token + lead_id), which are sent
 * automatically because cookies are scoped by domain+path (not port).
 *
 * NOTE: This file runs only in Bun CLI context (dynamically imported
 * from dev/repository.ts and start/repository.ts).
 */

/// <reference types="bun-types" />

/* eslint-disable i18next/no-literal-string */

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

/** All active connections, keyed by channel → set of sockets */
const channels = new Map<string, Set<ServerWebSocket<WsConnectionData>>>();

/** Global sequence counter for event ordering */
let globalSeq = 0;

/**
 * Broadcast an event to LOCAL subscribers of a channel (this process only).
 * For single-instance deployments, this is the only broadcast path.
 * For multi-instance, the pub/sub adapter calls this after receiving from Redis.
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
    ws.send(payload);
  }
}

/**
 * Publish an event through the pub/sub adapter.
 * NOTE: Route handlers should use createEmitter() from emitter.ts instead.
 * This function is for the WS sidecar context only.
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

  // When the first local subscriber joins a channel, register with the pub/sub adapter
  // so cross-instance messages are routed to broadcastLocal()
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
      // Last local subscriber left — unsubscribe from the pub/sub adapter
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

/** WS sidecar port = Next.js port + 1000 (3000→4000, 3001→4001) */
export const WS_PORT_OFFSET = 1000;

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

export interface WebSocketServerOptions {
  /** WebSocket port (typically Next.js port + 1000) */
  port: number;
  logger: EndpointLogger;
  /** Optional hostname (default: "0.0.0.0") */
  hostname?: string;
}

export interface WebSocketServerHandle {
  /** Stop the Bun WebSocket server */
  stop: () => void;
}

/**
 * Start the WebSocket sidecar server.
 * Uses Bun.serve() for native WebSocket support — WS only, no HTTP proxy.
 *
 * IMPORTANT: This function must only be called in Bun runtime context.
 */
export function startWebSocketServer(
  options: WebSocketServerOptions,
): WebSocketServerHandle {
  const { port, logger, hostname = "0.0.0.0" } = options;

  const server = Bun.serve<WsConnectionData>({
    port,
    hostname,

    async fetch(req, bunServer): Promise<Response> {
      // Only handle WebSocket upgrades
      if (req.headers.get("upgrade")?.toLowerCase() === "websocket") {
        const url = new URL(req.url);
        const channel = url.searchParams.get("channel");

        // Authenticate from httpOnly cookies
        const { userId, leadId } = await authenticateFromCookies(req, logger);

        if (!leadId) {
          logger.warn("[WS] Rejected upgrade — missing lead_id cookie");
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

      // Internal publish API — Next.js process sends events here
      if (req.method === "POST") {
        const url = new URL(req.url);
        if (url.pathname === "/publish") {
          try {
            const body = (await req.json()) as {
              channel: string;
              event: string;
              data: WsWireMessage["data"];
            };
            broadcastLocal(body.channel, body.event, body.data);
            return new Response("ok", { status: 200 });
          } catch {
            return new Response("Invalid JSON", { status: 400 });
          }
        }
      }

      // Not a recognized request — return 404
      return new Response("WebSocket server — use ws:// protocol", {
        status: 404,
      });
    },

    websocket: {
      open(ws): void {
        for (const channel of ws.data.channels) {
          let set = channels.get(channel);
          if (!set) {
            set = new Set();
            channels.set(channel, set);
          }
          set.add(ws);
        }
        logger.debug(
          `[WS] Connection opened (channels: ${[...ws.data.channels].join(", ") || "none"})`,
        );
      },

      message(ws, raw): void {
        try {
          const msg = JSON.parse(
            typeof raw === "string" ? raw : new TextDecoder().decode(raw),
          ) as WsClientMessage;

          if (msg.type === "subscribe") {
            subscribeToChannel(ws, msg.channel);
            logger.debug(`[WS] Subscribed to ${msg.channel}`);
          } else if (msg.type === "unsubscribe") {
            unsubscribeFromChannel(ws, msg.channel);
            logger.debug(`[WS] Unsubscribed from ${msg.channel}`);
          }
        } catch {
          logger.warn("[WS] Invalid message received");
        }
      },

      close(ws): void {
        unsubscribeFromAll(ws);
        logger.debug("[WS] Connection closed");
      },
    },
  });

  logger.info(`[WS] WebSocket sidecar listening on ${hostname}:${port}`);

  return {
    stop: (): void => {
      server.stop(true);
    },
  };
}
