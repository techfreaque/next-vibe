/**
 * WebSocket Wire & Server Types
 *
 * Wire-protocol frames and server-side connection types shared by the socket
 * server, the browser client, and the emitter.
 *
 * Event PAYLOAD types are NOT here — they are derived per-endpoint from the
 * field-spec `events` declaration via `structured-events.ts`
 * (`ComputeEventPayloads` → `definition.types.EventPayloads`). That is the single
 * event type system; there is no Zod-schema event variant.
 */

import { z } from "zod";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import { Methods } from "../../core/definition/enums";
import {
  type CountryLanguage,
  CountryLanguageValues,
} from "../../core/i18n/core/config";
import type { JwtPayloadType } from "../../identity/auth/types";
import type {
  CacheKeyParamValue,
  CacheKeyRequestInput,
} from "../../unified-ui/hooks/query-key-builder";
import type { AnyEndpointEventEnvelope } from "./structured-events";

// ============================================================================
// WIRE PROTOCOL
// ============================================================================

/**
 * Message sent over the WebSocket wire (JSON serialized).
 * `data` is always an `EndpointEventEnvelope` — the single wire payload type.
 */
export interface WsWireMessage<
  T extends AnyEndpointEventEnvelope = AnyEndpointEventEnvelope,
> {
  /** Channel this event belongs to */
  readonly channel: string;
  /** Event name (matches a key in the endpoint's events record, or "__event__") */
  readonly event: string;
  /** Event payload */
  readonly data: T;
  /**
   * Replay sequence id. Strictly increasing per channel and shared by every
   * server on the same pub/sub bus (time-based, so it also keeps increasing
   * across restarts). A client resubscribing after a drop sends the last seq
   * it saw as `since` and the server replays what it missed. 0 = unsequenced
   * (published by an older build): deliver, never dedupe.
   */
  readonly seq: number;
}

/**
 * Server → client acknowledgement of a `replay: true` subscribe. Sent after
 * the replayed events (if any) for that channel. `cursor` is the seq the client
 * is now caught up to; `complete: false` means the requested gap is older than
 * the server's replay buffer, so the client must refetch the channel's data.
 */
export interface WsSubscribedFrame {
  readonly type: "subscribed";
  readonly channel: string;
  readonly cursor: number;
  readonly complete: boolean;
}

/**
 * A single event entry inside a batch frame.
 * Same as WsWireMessage but without seq (assigned by broadcastLocalBatch).
 */
export interface WsBatchEvent {
  readonly channel: string;
  readonly event: string;
  readonly data: AnyEndpointEventEnvelope;
}

/**
 * Batch frame: multiple events packed into a single WS message.
 * Sent by publishWsEventBatch / broadcastLocalBatch for efficiency.
 */
interface WsWireBatch {
  readonly type: "batch";
  readonly events: ReadonlyArray<WsBatchEvent & { readonly seq: number }>;
}

/**
 * Any frame that can arrive over the WebSocket wire.
 */
type WsWireFrame = WsWireMessage | WsWireBatch;

/**
 * Parse and structurally validate a raw WS wire frame string.
 * Returns null on malformed JSON or unrecognized frame shape — callers skip silently.
 */
export function parseWsFrame(raw: string): WsWireFrame | null {
  try {
    const frame = JSON.parse(raw) as WsWireFrame;
    if (frame === null || typeof frame !== "object" || Array.isArray(frame)) {
      return null;
    }
    if (
      "type" in frame &&
      frame.type === "batch" &&
      Array.isArray(frame.events)
    ) {
      return frame;
    }
    if (
      "channel" in frame &&
      typeof frame.channel === "string" &&
      "event" in frame &&
      typeof frame.event === "string"
    ) {
      return frame;
    }
    return null;
  } catch {
    return null;
  }
}

const subscribedFrameSchema = z.object({
  type: z.literal("subscribed"),
  channel: z.string(),
  cursor: z.number(),
  complete: z.boolean(),
});

const guestIdentityChangedFrameSchema = z.object({
  type: z.literal("guest-identity-changed"),
});

export type WsGuestIdentityChangedFrame = z.infer<
  typeof guestIdentityChangedFrameSchema
>;

/**
 * Browser-side frame parser: event/batch frames plus the subscribe ack, which
 * only a client that asked for replay (`replay: true`) ever receives. Server
 * consumers (connector, keyed-signal) keep using `parseWsFrame`.
 */
export function parseWsClientFrame(
  raw: string,
): WsWireFrame | WsSubscribedFrame | WsGuestIdentityChangedFrame | null {
  if (raw.startsWith('{"type":"subscribed"')) {
    try {
      const result = subscribedFrameSchema.safeParse(JSON.parse(raw));
      return result.success ? result.data : null;
    } catch {
      return null;
    }
  }
  if (raw.startsWith('{"type":"guest-identity-changed"')) {
    try {
      const result = guestIdentityChangedFrameSchema.safeParse(JSON.parse(raw));
      return result.success ? result.data : null;
    } catch {
      return null;
    }
  }
  return parseWsFrame(raw);
}

/**
 * Structured descriptor for an ENDPOINT channel subscription. The client sends
 * this instead of trusting a raw channel string: the server rebuilds the
 * canonical channel via buildWsChannel (so a client cannot spoof one) and hands
 * the typed urlPathParams/requestData straight to the route's resolveChannel —
 * no parsing structured data back out of a stringly-typed channel name.
 *
 * Generic over the endpoint so `urlPathParams` and `requestData` carry the exact
 * inferred types buildWsChannel and resolveChannel expect — the descriptor flows
 * straight into both with no casts. At the type-erased server boundary the
 * endpoint is `CreateApiEndpointAny`, where these resolve to their widest shapes.
 */
export interface WsChannelDescriptor<
  TEndpoint extends CreateApiEndpointAny = CreateApiEndpointAny,
> {
  readonly endpointPath: readonly string[];
  readonly method: Methods;
  readonly urlPathParams: TEndpoint["types"]["UrlVariablesOutput"];
  // Exactly the input buildWsChannel accepts — the endpoint's cache-key fields,
  // or the flat record at the type-erased boundary. Flows into buildWsChannel and
  // resolveChannel with no cast.
  readonly requestData: CacheKeyRequestInput<TEndpoint>;
}

/**
 * Client→server subscribe/unsubscribe messages.
 *
 * `descriptor` is present for endpoint (ws-*) channels — the server rebuilds and
 * authorizes from it. `user/` and `system/` channels carry only the string
 * (they are already identity-scoped, authorized by exact match).
 */
interface WsSubscribeMessage {
  readonly type: "subscribe";
  readonly channel: string;
  readonly locale: CountryLanguage;
  readonly descriptor?: WsChannelDescriptor;
  /**
   * The client understands replay: the server answers with a `subscribed`
   * ack (and replays missed events when `since` is set). Absent for older
   * clients and server-side sockets, which get the plain live stream.
   */
  readonly replay?: boolean;
  /** Last seq the client saw on this channel before its socket dropped. */
  readonly since?: number;
  /** The browser built this user channel from its rendered guest identity. */
  readonly refreshGuestIdentity?: true;
}

interface WsUnsubscribeMessage {
  readonly type: "unsubscribe";
  readonly channel: string;
}

/**
 * All possible client→server message types.
 */
export type WsClientMessage = WsSubscribeMessage | WsUnsubscribeMessage;

// A cache-key scalar (or array/null) as it arrives on the wire.
const cacheKeyValueSchema: z.ZodType<CacheKeyParamValue> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.array(z.union([z.string(), z.number(), z.boolean()])),
]);

const descriptorSchema: z.ZodType<WsChannelDescriptor> = z.object({
  endpointPath: z.array(z.string()),
  method: z.enum(Methods),
  urlPathParams: z.record(z.string(), z.string()),
  requestData: z.record(z.string(), cacheKeyValueSchema),
});

const clientMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("subscribe"),
    channel: z.string(),
    locale: z.enum(CountryLanguageValues),
    descriptor: descriptorSchema.optional(),
    replay: z.boolean().optional(),
    since: z.number().int().nonnegative().optional(),
    refreshGuestIdentity: z.literal(true).optional(),
  }),
  z.object({
    type: z.literal("unsubscribe"),
    channel: z.string(),
  }),
]);

/**
 * Parse and validate a raw client→server message string. Returns null on
 * malformed JSON or an unrecognised shape — the server skips it silently. This is
 * the trust boundary for inbound frames: the descriptor (used to rebuild +
 * authorize endpoint channels) is structurally validated here, not cast.
 */
export function parseWsClientMessage(raw: string): WsClientMessage | null {
  try {
    const result = clientMessageSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

// ============================================================================
// SERVER-SIDE TYPES
// ============================================================================

/**
 * Data attached to each WebSocket connection (Bun's ws.data).
 */
export interface WsConnectionData {
  user: JwtPayloadType;
  /** Set of channels this connection is subscribed to */
  channels: Set<string>;
  /** Connection timestamp */
  connectedAt: number;
  /** Browser-generated id used only to correlate client and server logs. */
  requestId?: string;
  /**
   * Last time the client proved it was alive: a message or a pong to the
   * server's keepalive ping. The close log reports the silence before a drop,
   * which separates "client stopped answering pings" from a cut mid-traffic.
   */
  lastInboundAt: number;
  lastInboundFrame?: WsClientMessage["type"] | "ping" | "pong" | "malformed";
  /** Pongs received on this socket (0 = no ping was ever answered). */
  pongCount: number;
  pingCount?: number;
  lastPingAt?: number;
  lastPingBackpressured?: boolean;
  lastPongAt?: number;
  /**
   * Set only for reverse-ws connector sockets (local → cloud outbound WS).
   * Identifies which remoteConnections row opened this socket so the server
   * can forcibly close it on disconnect without waiting for the client side.
   */
  connectorInstanceId?: string;
  /**
   * Channels whose subscribe ack is still being prepared (replay read in
   * flight). Live events for such a channel are held here and flushed after
   * the replayed events, so the socket sees one gap-free, ordered sequence.
   */
  replayQueues?: Map<string, WsWireMessage[]>;
}

// ============================================================================
// CLIENT-SIDE TYPES
// ============================================================================

/**
 * Generic event handler callback. Receives the wire `data` for an event.
 * Consumers (e.g. useEndpointSubscription) narrow `T` to the endpoint's
 * computed `types.EventPayloads[eventName]`.
 */
export type EventHandler<T> = (data: T) => void;
