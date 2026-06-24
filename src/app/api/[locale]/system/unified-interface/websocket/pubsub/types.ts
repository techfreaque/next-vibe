/**
 * Pub/Sub Adapter Interface
 *
 * Abstracts the broadcasting mechanism for WebSocket events.
 * - "local" adapter: in-process broadcasting (default, single instance)
 * - "redis" adapter: Redis PUBLISH/SUBSCRIBE (multi-instance)
 */

import type { AnyEndpointEventEnvelope } from "../structured-events";

/**
 * Handler called when a message is received from the pub/sub layer.
 * The handler should deliver the event to local WebSocket connections.
 */
export type PubSubMessageHandler<
  TPubSubMessageData extends AnyEndpointEventEnvelope =
    AnyEndpointEventEnvelope,
> = (event: string, data: TPubSubMessageData) => void;

/**
 * Pub/Sub adapter for cross-instance WebSocket event broadcasting.
 */
export interface PubSubAdapter {
  /**
   * Publish an event to all instances subscribed to this channel.
   */
  publish(channel: string, event: string, data: AnyEndpointEventEnvelope): void;

  /** Subscribe to a channel. Handler is called for every received message. */
  subscribe<T extends AnyEndpointEventEnvelope>(
    channel: string,
    handler: PubSubMessageHandler<T>,
  ): void;

  /** Unsubscribe from a channel when there are no more local subscribers. */
  unsubscribe(channel: string): void;
}
