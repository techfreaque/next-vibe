/**
 * Server-side Event Emitter
 *
 * Creates a typed emit() function for route handlers.
 * The emitter validates payloads against Zod schemas before broadcasting.
 *
 * Next.js runs in a separate process from the Bun proxy. To broadcast WS events,
 * route handlers POST to the proxy's internal /ws/broadcast endpoint which calls
 * broadcastLocal() in-process where the WS connections live.
 */

import "server-only";

import type { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type {
  EventSchemas,
  TypedEmit,
  WsBatchEvent,
  WsWireMessage,
} from "./types";

/**
 * Derive the proxy's internal broadcast URL.
 * In proxy mode (default): proxy is on NEXT_PUBLIC_APP_URL's port.
 * In direct mode (VIBE_DISABLE_PROXY): WS sidecar is on main port + 1000.
 */
function getBroadcastUrl(): string {
  const appUrl = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";
  try {
    const parsed = new URL(appUrl);
    const mainPort = parsed.port ? parseInt(parsed.port, 10) : 3000;
    const disableProxy = process.env["VIBE_DISABLE_PROXY"] === "true";
    const wsPort = disableProxy ? mainPort + 1000 : mainPort;
    return `http://127.0.0.1:${wsPort}/ws/broadcast`;
  } catch {
    return "http://127.0.0.1:3000/ws/broadcast";
  }
}

/**
 * Publish a WS event - POST to the Bun proxy's internal broadcast endpoint.
 * Fire-and-forget: errors are logged but not thrown.
 * Only the connection matching the user's identity receives the event.
 */
export function publishWsEvent<T>(
  msg: Omit<WsWireMessage<T>, "seq">,
  logger: EndpointLogger,
  user: JwtPayloadType,
): void {
  const url = getBroadcastUrl();
  fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...msg, user }),
  }).catch((err) => {
    if (!shuttingDown) {
      logger.warn("[WS Emitter] Failed to broadcast event", {
        error: err instanceof Error ? err.message : String(err),
        channel: msg.channel,
        event: msg.event,
      });
    }
  });
}

/**
 * Publish a WS event to multiple channels simultaneously.
 * Calls publishWsEvent once per channel - fire-and-forget.
 * Only the connection matching the user's identity receives events on each channel.
 */
export function publishWsEventToChannels<T>(
  channels: string[],
  msg: Omit<WsWireMessage<T>, "seq" | "channel">,
  logger: EndpointLogger,
  user: JwtPayloadType,
): void {
  for (const channel of channels) {
    publishWsEvent(
      { ...msg, channel } as Omit<WsWireMessage<T>, "seq">,
      logger,
      user,
    );
  }
}

/**
 * Publish multiple WS events in a single HTTP POST to the proxy.
 * The proxy unpacks and broadcasts each event individually,
 * but packs them into a single WS frame per socket (WsWireBatch).
 * Use this instead of multiple publishWsEvent() calls when emitting
 * related events together (e.g. stream-finished + sidebar updates).
 */
export function publishWsEventBatch(
  events: WsBatchEvent[],
  logger: EndpointLogger,
  user: JwtPayloadType,
): void {
  if (events.length === 0) {
    return;
  }
  if (events.length === 1) {
    // Single event - use the simpler path
    publishWsEvent(
      {
        channel: events[0]!.channel,
        event: events[0]!.event,
        data: events[0]!.data,
      },
      logger,
      user,
    );
    return;
  }
  const url = getBroadcastUrl();
  fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "batch", events, user }),
  }).catch((err) => {
    if (!shuttingDown) {
      logger.warn("[WS Emitter] Failed to broadcast batch", {
        error: err instanceof Error ? err.message : String(err),
        count: events.length,
      });
    }
  });
}

/**
 * Create a batching emitter that accumulates events and flushes them in a single
 * HTTP POST to the proxy (which packs them into one WS frame per socket).
 *
 * Use this for high-frequency event streams (e.g. content-delta during LLM streaming)
 * where sending a separate HTTP POST for every chunk would be wasteful.
 *
 * @param logger - Endpoint logger for error reporting
 * @param user - Authenticated user (determines which WS connection receives events)
 * @param flushMs - Flush interval in milliseconds (default: 16ms ≈ one animation frame)
 */
export function createBatchingEmitter(
  logger: EndpointLogger,
  user: JwtPayloadType,
  flushMs = 16,
): {
  emit: (channel: string, event: string, data: WsWireMessage["data"]) => void;
  flush: () => void;
} {
  const queue: WsBatchEvent[] = [];
  let timer: ReturnType<typeof setTimeout> | null = null;

  function flush(): void {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    if (queue.length === 0) {
      return;
    }
    publishWsEventBatch([...queue], logger, user);
    queue.length = 0;
  }

  function emit(
    channel: string,
    event: string,
    data: WsWireMessage["data"],
  ): void {
    queue.push({ channel, event, data });
    if (timer === null) {
      timer = setTimeout(flush, flushMs);
    }
    // Safety cap: flush immediately if queue is large
    if (queue.length >= 50) {
      flush();
    }
  }

  return { emit, flush };
}

/** Set to true during shutdown to suppress expected broadcast errors */
let shuttingDown = false;
export function setShuttingDown(): void {
  shuttingDown = true;
}

/**
 * Create a typed emit function scoped to a specific channel.
 *
 * @param channel - The channel to broadcast events on
 * @param eventSchemas - Record of event name → Zod schema (from definition.events)
 * @param logger - Endpoint logger for error reporting
 * @returns A typed emit function that validates and broadcasts events
 */
export function createEmitter<TEvents extends EventSchemas | never>(
  channel: string,
  eventSchemas: TEvents,
  logger: EndpointLogger,
  user: JwtPayloadType,
): TypedEmit<TEvents> {
  return (<K extends keyof TEvents & string>(
    event: K,
    data: z.input<TEvents[K]>,
  ): void => {
    const schema = eventSchemas[event];
    if (!schema) {
      logger.warn(
        `[WS Emitter] Unknown event "${event}" for channel "${channel}"`,
      );
      return;
    }

    // Validate payload against schema
    const result = schema.safeParse(data);
    if (!result.success) {
      logger.warn(
        `[WS Emitter] Invalid payload for event "${event}" on channel "${channel}"`,
        {
          errors: result.error.flatten().fieldErrors,
        },
      );
      return;
    }

    publishWsEvent(
      {
        channel,
        event,
        data: result.data,
      },
      logger,
      user,
    );
  }) as TypedEmit<TEvents>;
}
