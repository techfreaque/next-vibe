/**
 * WebSocket Types
 * Shared type definitions for the typed WebSocket event system.
 * Used by server (emitter), client (hooks), and endpoint definitions.
 */

import type { z } from "zod";

// ============================================================================
// EVENT TYPE INFERENCE
// ============================================================================

/**
 * Infer output types from a record of Zod schemas.
 * Used to derive the typed event payloads from definition.events.
 *
 * Example:
 *   events: { contentDelta: z.object({ delta: z.string() }) }
 *   → EventMap = { contentDelta: { delta: string } }
 */
export type EventMap<T extends Record<string, z.ZodType>> = {
  [K in keyof T]: z.output<T[K]>;
};

/**
 * Constraint type for event schema records.
 * Endpoints declare events as Record<string, z.ZodType>.
 */
export type EventSchemas = Record<string, z.ZodType>;

// ============================================================================
// WIRE PROTOCOL
// ============================================================================

/**
 * Message sent over the WebSocket wire (JSON serialized).
 * Generic T defaults to the widest Zod output for untyped contexts.
 */
export interface WsWireMessage<T = z.infer<z.ZodType>> {
  /** Channel this event belongs to */
  readonly channel: string;
  /** Event name (matches a key in the endpoint's events record) */
  readonly event: string;
  /** Event payload (validated against the Zod schema on emit) */
  readonly data: T;
  /** Monotonic sequence ID for ordering / resumability */
  readonly seq: number;
}

/**
 * Client→server subscribe/unsubscribe messages.
 */
export interface WsSubscribeMessage {
  readonly type: "subscribe";
  readonly channel: string;
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
 * Data attached to each WebSocket connection (Bun's ws.data).
 */
export interface WsConnectionData {
  /** Authenticated user ID (null if public/unauthenticated) */
  userId: string | null;
  /** Lead ID for anonymous tracking (from lead_id cookie) */
  leadId: string;
  /** Set of channels this connection is subscribed to */
  channels: Set<string>;
  /** Connection timestamp */
  connectedAt: number;
}

/**
 * Typed emit function - derived from an endpoint's events record.
 * Handlers call emit("eventName", payload) with full type safety.
 */
export type TypedEmit<TEvents extends EventSchemas | never> =
  TEvents extends EventSchemas
    ? <K extends keyof TEvents>(event: K, data: z.input<TEvents[K]>) => void
    : () => void;

// ============================================================================
// CLIENT-SIDE TYPES
// ============================================================================

/**
 * Generic event handler callback.
 * T is narrowed by useWidgetEvents to the specific Zod output type.
 * At the low-level useWebSocket, T is z.infer<z.ZodType> (widest).
 */
export type EventHandler<T> = (data: T) => void;

/**
 * Return type for useWidgetEvents hook.
 */
export interface UseWidgetEventsReturn<TEvents extends EventSchemas | never> {
  /** Subscribe to a specific event type */
  on: <K extends keyof TEvents & string>(
    event: K,
    handler: EventHandler<z.output<TEvents[K]>>,
  ) => () => void;
  /** Whether the WebSocket connection is active */
  connected: boolean;
  /** Last event received (any type) */
  lastEvent: WsWireMessage | null;
}
