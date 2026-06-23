/**
 * Pub/Sub Adapter Interface
 *
 * Abstracts the broadcasting mechanism for WebSocket events.
 * - "local" adapter: in-process broadcasting (default, single instance)
 * - "redis" adapter: Redis PUBLISH/SUBSCRIBE (multi-instance)
 */

import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";

/**
 * Handler called when a message is received from the pub/sub layer.
 * The handler should deliver the event to local WebSocket connections.
 */
export type PubSubMessageHandler<TPubSubMessageData extends WidgetData> = (
  event: string,
  data: TPubSubMessageData,
) => void;

/**
 * Pub/Sub adapter for cross-instance WebSocket event broadcasting.
 */
export interface PubSubAdapter {
  /**
   * Publish an event to all instances subscribed to this channel.
   * Generic over the payload so the emitter's inferred event type threads
   * through verbatim; `WidgetData` is only the default for untyped callers.
   */
  publish<T extends WidgetData>(channel: string, event: string, data: T): void;

  /** Subscribe to a channel. Handler is called for every received message. */
  subscribe<T extends WidgetData>(
    channel: string,
    handler: PubSubMessageHandler<T>,
  ): void;

  /** Unsubscribe from a channel when there are no more local subscribers. */
  unsubscribe(channel: string): void;
}
