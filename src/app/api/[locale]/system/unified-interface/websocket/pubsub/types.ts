/**
 * Pub/Sub Adapter Interface
 *
 * Abstracts the broadcasting mechanism for WebSocket events.
 * - "local" adapter: in-process broadcasting (default, single instance)
 * - "redis" adapter: Redis PUBLISH/SUBSCRIBE (multi-instance)
 */

import type { WsWireMessage } from "../types";

/** The payload type flowing through the pub/sub layer (matches WsWireMessage["data"]) */
export type PubSubMessageData = WsWireMessage["data"];

/**
 * Handler called when a message is received from the pub/sub layer.
 * The handler should deliver the event to local WebSocket connections.
 */
export type PubSubMessageHandler = (
  event: string,
  data: PubSubMessageData,
) => void;

/**
 * Pub/Sub adapter for cross-instance WebSocket event broadcasting.
 */
export interface PubSubAdapter {
  /** Publish an event to all instances subscribed to this channel */
  publish(channel: string, event: string, data: PubSubMessageData): void;

  /** Subscribe to a channel. Handler is called for every received message. */
  subscribe(channel: string, handler: PubSubMessageHandler): void;

  /** Unsubscribe from a channel when there are no more local subscribers. */
  unsubscribe(channel: string): void;
}
