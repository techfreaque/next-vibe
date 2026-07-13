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

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import { Methods } from "next-vibe/core/definition/enums";
import {
  type CountryLanguage,
  CountryLanguageValues,
} from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type {
  CacheKeyParamValue,
  CacheKeyRequestInput,
} from "next-vibe/platforms/react/hooks/query-key-builder";
import { z } from "zod";

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
  /** Monotonic sequence ID for ordering / resumability */
  readonly seq: number;
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
  /**
   * Set only for reverse-ws connector sockets (local → cloud outbound WS).
   * Identifies which remoteConnections row opened this socket so the server
   * can forcibly close it on disconnect without waiting for the client side.
   */
  connectorInstanceId?: string;
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
