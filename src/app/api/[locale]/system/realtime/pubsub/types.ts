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
   * True when publish() itself already delivers to THIS process's WebSocket
   * sockets (local adapter). The WS server then must NOT also register its
   * per-channel relay subscription — publish → broadcast + relay-handler →
   * broadcast delivered every event TWICE to every socket (streamed-token
   * duplication "The The"). Remote adapters (Redis) return false: there a
   * publish only reaches local sockets via the relay subscription.
   */
  readonly deliversToLocalSockets: boolean;

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
