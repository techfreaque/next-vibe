/**
 * Unified WS Event Emitter
 *
 * Single source of truth for all event broadcasting — local and remote:
 *   - Local delivery:   POST to this instance's Bun proxy /ws/broadcast
 *   - Sync-channel:     POST to proxy on system/sync/{userId} (reverse-WS peers subscribe)
 *   - Direct-http peers: dispatched via dispatch.pushEndpointEventToPeers
 *
 * Covers all event types: typed endpoint events, live-message, sync-notify.
 *
 * Next.js and route handlers run in a separate process from the Bun proxy.
 * To broadcast WS events they POST to the proxy's internal /ws/broadcast
 * endpoint which calls broadcastLocal() in-process where WS connections live.
 */

import "server-only";

import type { SyncDomain } from "@/app/api/[locale]/remote-connection/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "@/app/api/[locale]/user/auth/types";

import type { CreateApiEndpointAny } from "../shared/types/endpoint-base";
import { buildUserChannel, buildWsChannel } from "./channel";
import type {
  AnyEndpointEventEnvelope,
  ComputeEventPayloads,
  EmitEventNamed,
} from "./structured-events";
import type { WsBatchEvent, WsWireMessage } from "./types";

// ─── Internal broadcast URL ───────────────────────────────────────────────────

function getBroadcastUrl(): string {
  const appUrl = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";
  try {
    const parsed = new URL(appUrl);
    const mainPort = parsed.port ? parseInt(parsed.port, 10) : 3000;
    const wsPort =
      process.env["VIBE_DISABLE_PROXY"] === "true" ? mainPort + 1000 : mainPort;
    return `http://127.0.0.1:${wsPort}/ws/broadcast`;
  } catch {
    return "http://127.0.0.1:3000/ws/broadcast";
  }
}

let shuttingDown = false;
export function setShuttingDown(): void {
  shuttingDown = true;
}

// ─── Low-level broadcast primitives ───────────────────────────────────────────

/**
 * POST a single WS event to the Bun proxy. Only the connection matching
 * the user's identity receives the event. Fire-and-forget.
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

/** POST same event to multiple channels simultaneously. Fire-and-forget. */
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
 * POST multiple events in a single HTTP call — proxy packs them into one WS frame.
 * Use for related events emitted together (e.g. stream-finished + sidebar update).
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
 * Accumulate high-frequency events and flush in a single HTTP POST.
 * Use for LLM content-delta streams to avoid per-chunk HTTP overhead.
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

/** The wire body of a relayed remote-event (what the bridge receives as `payload`). */
export interface RemoteEventWirePayload<TPayload = WidgetData> {
  originInstanceId: string;
  syncDomain?: SyncDomain;
  endpointPath: readonly string[];
  endpointMethod: string;
  urlPathParams: { readonly [K in string]: string };
  endpointEventName: string;
  endpointPayload: TPayload;
}

/**
 * Create a typed emit function for an endpoint's channel.
 *
 * The returned emit is typed by recomputing the payload map from the endpoint's
 * MATERIALISED stored types (ResponseOutput/Events/RequestOutput) rather than
 * reading the stored `types.EventPayloads` directly. The latter is DECLARED as a
 * deferred ComputeEventPayloads<InferRequestOutput<TFields>, …>; reading it back
 * re-evaluates that deep conditional and collapses to never on large field trees
 * (deeply nested discriminated-union arrays). The stored output types are already
 * materialised, so re-running ComputeEventPayloads over them here resolves
 * correctly. (Probe-verified.)
 *
 * Each call delivers the event on all three paths simultaneously:
 *   1. Local WS (POST to proxy user channel)
 *   2. Reverse-WS peers (POST to proxy system/sync/{userId})
 *   3. Direct-HTTP peers (POST to each peer's /ws/broadcast via dispatch)
 */
export function createEndpointEmitter<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
  logger: EndpointLogger,
  user: JwtPayloadType,
  urlPathParams: { readonly [K in string]: string } = {},
): EmitEventNamed<ComputeEventPayloads<TEndpoint>> {
  type TEventPayloads = ComputeEventPayloads<TEndpoint>;
  const pathChannel = buildWsChannel(endpoint.path, urlPathParams);
  const userId = user.isPublic ? user.leadId : user.id;
  const channel = buildUserChannel(userId);

  return ((
    eventName: keyof TEventPayloads & string,
    payload: TEventPayloads[typeof eventName] & WidgetData,
  ) => {
    const envelope: EndpointEventEnvelope<
      TEventPayloads[typeof eventName] & WidgetData
    > = {
      endpointPath: endpoint.path,
      endpointMethod: endpoint.method,
      eventName,
      payload,
      channel: pathChannel,
    };

    // 1. Local delivery — every event reaches this instance's own clients.
    publishWsEvent(
      { channel, event: "__event__", data: envelope },
      logger,
      user,
    );

    // 2. Cross-instance relay — ONLY remoteEvents cross the wire. A remoteEvent
    // has a route onRemoteEvent runner on the peer; a client-only event has
    // nothing to run remotely, so it never leaves this instance. It is relayed to
    // ALL the user's connected instances, each gated by its own
    // syncScope[syncDomain] at the sender (pushRemoteEvent).
    if (!user.isPublic) {
      const eventDecl =
        endpoint.events?.[eventName as keyof typeof endpoint.events];
      if (eventDecl?.remoteEvent === true) {
        const privateUser = user as JwtPrivatePayloadType;
        const remoteEvent: RemoteEventRelayPayload<
          TEventPayloads[typeof eventName]
        > = {
          userId: privateUser.id,
          logger,
          syncDomain: eventDecl.syncDomain,
          endpointPath: endpoint.path,
          endpointMethod: endpoint.method,
          urlPathParams,
          eventName,
          payload,
        };
        // originInstanceId is resolved inside pushRemoteEvent from the user's
        // configured self-instance-id (getLocalInstanceId) — never derived here.
        void import("@/app/api/[locale]/system/unified-interface/websocket/remote-event-bridge/transport/dispatch").then(
          ({ pushRemoteEvent }) => pushRemoteEvent(remoteEvent),
        );
      }
    }
  }) as EmitEventNamed<TEventPayloads>;
}
