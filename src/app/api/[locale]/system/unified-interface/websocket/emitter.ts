/**
 * Unified WS Event Emitter
 *
 * Single source of truth for all event broadcasting — local and remote:
 *   - Local delivery:   the WS proxy's socket registry (in-process when the
 *     proxy shares this process, else a loopback POST to /ws/broadcast)
 *   - Reverse-WS peers: published on the remote-event channel (peers subscribe)
 *   - Direct-http peers: relayed to each peer's remote-event-bridge
 *
 * The proxy owns the live sockets. When it runs in this same process it
 * registers its broadcast fns (see local-broadcast.ts) and we deliver directly;
 * otherwise (Next.js / proxy in separate processes) we POST to the proxy's
 * internal /ws/broadcast endpoint, which calls broadcastLocal() where the
 * sockets live.
 */

import "server-only";

import type { SyncDomain } from "@/app/api/[locale]/remote-connection/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "@/app/api/[locale]/user/auth/types";

import type { CacheKeyRequestData } from "../react/hooks/query-key-builder";
import type { CreateApiEndpointAny } from "../shared/types/endpoint-base";
import {
  buildRemoteEventChannel,
  buildUserChannel,
  buildWsChannel,
  REMOTE_EVENT_NAME,
} from "./channel";
import { getLocalBroadcast } from "./local-broadcast";
import type {
  AnyEndpointEventEnvelope,
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

// ─── Low-level broadcast primitives ───────────────────────────────────────────

/**
 * Deliver a single WS event. Only the connection matching the user's identity
 * receives the event. In-process when the proxy shares this process; otherwise a
 * fire-and-forget loopback POST to the proxy.
 */
function publishWsEvent<T extends AnyEndpointEventEnvelope>(
  msg: Omit<WsWireMessage<T>, "seq">,
  logger: EndpointLogger,
  user: JwtPayloadType,
): void {
  const local = getLocalBroadcast();
  if (local) {
    local.broadcastToAll(msg.channel, msg.event, msg.data);
    return;
  }
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
 * Deliver multiple events as a single WS frame per socket. In-process when the
 * proxy shares this process; otherwise one loopback POST the proxy unpacks.
 * Use for related events emitted together (e.g. stream-finished + sidebar update).
 */
function publishWsEventBatch(
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
  const local = getLocalBroadcast();
  if (local) {
    local.broadcastBatch(events);
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

// ─── Remote-event hub broadcast (local → reverse-WS peers on the remote-event channel) ───

/**
 * Generic remote-event relay payload. One relay shape for every cross-instance
 * remote event. Identifies the target route + event and carries that event's own
 * envelope (all 4 fields together): endpointPath, endpointMethod, eventName,
 * urlPathParams, responseData, requestData, and payload — no duplication.
 */
export interface RemoteEventRelayPayload<TPayload = AnyEndpointEventEnvelope> {
  userId: string;
  logger: EndpointLogger;
  syncDomain?: SyncDomain;
  envelope: TPayload;
}

/**
 * Hub publish for the reverse-ws relay path. Publishes a `remote-event` frame on
 * the local remote-event channel; the peer's connector, subscribed to that
 * channel, delivers it to the bridge. Used by RemoteEventBridgeRepository
 * .pushRemoteEvent after it has resolved which connections should receive it.
 *
 * Uses the private internal userId — not the public leadId — so the channel is
 * not guessable from external data (users can have multiple leads). The payload
 * is wrapped as AnyEndpointEventEnvelope so the wire type stays consistent;
 * receivers read the routing info from data.payload (a RemoteEventWirePayload).
 */
export function publishRemoteEventToHub<TPayload>(
  remoteUserId: string,
  payload: RemoteEventWirePayload<TPayload>,
  logger: EndpointLogger,
): void {
  const envelope: AnyEndpointEventEnvelope = {
    endpointPath: ["remote-connection", "remote-event-bridge"],
    endpointMethod: "POST",
    eventName: REMOTE_EVENT_NAME,
    responseData: payload,
    requestData: payload,
    urlPathParams: {},
    payload,
  };
  const channel = buildRemoteEventChannel(remoteUserId);

  const local = getLocalBroadcast();
  if (local) {
    local.broadcastToAll(channel, REMOTE_EVENT_NAME, envelope);
    return;
  }
  const url = getBroadcastUrl();
  fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ channel, event: REMOTE_EVENT_NAME, data: envelope }),
  }).catch((err) => {
    if (!shuttingDown) {
      logger.warn(`[WS Emitter] Failed to broadcast ${REMOTE_EVENT_NAME}`, {
        error: err instanceof Error ? err.message : String(err),
        userId: remoteUserId,
      });
    }
  });
}

/**
 * Wire body of a relayed remote-event (what the bridge receives).
 * The envelope carries all 4 event fields (responseData, requestData,
 * urlPathParams, payload) plus endpointPath, endpointMethod, eventName.
 * No duplication of routing fields at the wire level.
 */
export interface RemoteEventWirePayload<TPayload = AnyEndpointEventEnvelope> {
  originInstanceId: string;
  syncDomain?: SyncDomain;
  envelope: TPayload;
}

/**
 * Create a typed emit function for an endpoint's channel.
 * All 4 payload fields (responseData, requestData, urlPathParams, payload) are
 * always together in EmitData — types fully inferred from the endpoint's types bag.
 *
 * Channel is built at emit time from data.urlPathParams (routing) + the
 * includeInCacheKey request fields in data.requestData (scope disambiguation).
 * This mirrors the React Query cache key so server and client always match.
 *
 * Each emit delivers on all three paths simultaneously:
 *   1. Local WS (user channel — in-process or loopback to the proxy)
 *   2. Reverse-WS peers (the remote-event channel; peers subscribe)
 *   3. Direct-HTTP peers (relayed to each peer's remote-event-bridge)
 */
export function createEndpointEmitter<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
  logger: EndpointLogger,
  user: JwtPayloadType,
  options?: {
    /** When provided, local delivery goes through the batcher instead of direct publish. */
    batcher?: {
      emit: (
        channel: string,
        event: string,
        data: WsWireMessage["data"],
      ) => void;
    };
    /** Set false to suppress remote relay (e.g. connector replaying a peer stream). Default true. */
    fanOut?: boolean;
  },
): EmitEventNamed<
  TEndpoint["types"]["EventResponsePayloads"],
  TEndpoint["types"]["EventRequestPayloads"],
  TEndpoint["types"]["EventEmitUrlPayloads"],
  TEndpoint["types"]["EventPayloadTypes"]
> {
  const userId = user.isPublic ? user.leadId : user.id;
  const userChannel = buildUserChannel(userId);

  return ((
    eventName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>,
  ) => {
    const urlParams: Record<string, string> = data.urlPathParams ?? {};
    const pathChannel = buildWsChannel(
      endpoint,
      urlParams,
      data.requestData as CacheKeyRequestData<TEndpoint>,
      logger,
    );

    const envelope: AnyEndpointEventEnvelope = {
      endpointPath: endpoint.path,
      endpointMethod: endpoint.method,
      eventName,
      responseData: data.responseData,
      requestData: data.requestData,
      urlPathParams: urlParams,
      payload: data.payload,
      channel: pathChannel,
    };

    // 1. Local delivery — every event reaches this instance's own clients.
    if (options?.batcher) {
      options.batcher.emit(userChannel, "__event__", envelope);
    } else {
      publishWsEvent(
        { channel: userChannel, event: "__event__", data: envelope },
        logger,
        user,
      );
    }

    // 2. Cross-instance relay — ONLY remoteEvents cross the wire.
    if (!user.isPublic && options?.fanOut !== false) {
      const eventsMap = endpoint.events;
      const eventDecl = eventsMap?.[eventName];
      if (eventDecl?.remoteEvent === true) {
        const privateUser = user as JwtPrivatePayloadType;
        const remoteEvent: RemoteEventRelayPayload<AnyEndpointEventEnvelope> = {
          userId: privateUser.id,
          logger,
          syncDomain: eventDecl.syncDomain,
          envelope,
        };
        void import("@/app/api/[locale]/system/unified-interface/websocket/remote-event-bridge/repository").then(
          ({ RemoteEventBridgeRepository }) =>
            RemoteEventBridgeRepository.pushRemoteEvent(remoteEvent),
        );
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as EmitEventNamed<any, any, any, any> as EmitEventNamed<
    TEndpoint["types"]["EventResponsePayloads"],
    TEndpoint["types"]["EventRequestPayloads"],
    TEndpoint["types"]["EventEmitUrlPayloads"],
    TEndpoint["types"]["EventPayloadTypes"]
  >;
}
