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

import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "../../../user/auth/types";
import type { AnyEndpointEventEnvelope } from "./structured-events";

// ============================================================================
// WIRE PROTOCOL
// ============================================================================

/**
 * Message sent over the WebSocket wire (JSON serialized).
 * `data` is the typed event payload, or an `EndpointEventEnvelope` when the
 * event name is `"__event__"` (endpoint events routed via the user channel).
 */
export interface WsWireMessage<T extends AnyEndpointEventEnvelope> {
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
export interface WsWireBatch {
  readonly type: "batch";
  readonly events: ReadonlyArray<WsBatchEvent & { readonly seq: number }>;
}

/**
 * Any frame that can arrive over the WebSocket wire.
 */
export type WsWireFrame = WsWireMessage | WsWireBatch;

/**
 * Client→server subscribe/unsubscribe messages.
 */
export interface WsSubscribeMessage {
  readonly type: "subscribe";
  readonly channel: string;
  readonly locale: CountryLanguage;
}

export interface WsUnsubscribeMessage {
  readonly type: "unsubscribe";
  readonly channel: string;
}

/**
 * All possible client→server message types.
 */
export type WsClientMessage = WsSubscribeMessage | WsUnsubscribeMessage;

// ============================================================================
// SERVER-SIDE TYPES
// ============================================================================

/**
 * Extract the identity key for matching WS connections.
 * userId takes priority; leadId is the fallback for anonymous users.
 * Single source of truth for the matching logic - never inline this elsewhere.
 */
export function wsIdentityKey(user: JwtPayloadType): string {
  return user.isPublic ? user.leadId : user.id;
}

/**
 * Data attached to each WebSocket connection (Bun's ws.data).
 */
export interface WsConnectionData {
  user: JwtPayloadType;
  /** Set of channels this connection is subscribed to */
  channels: Set<string>;
  /** Connection timestamp */
  connectedAt: number;
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
