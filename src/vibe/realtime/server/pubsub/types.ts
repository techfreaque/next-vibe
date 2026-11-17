/**
 * Pub/Sub Adapter Interface
 *
 * Abstracts the broadcasting mechanism for WebSocket events.
 * - "local" adapter: in-process broadcasting (default, single instance)
 * - "redis" adapter: Redis PUBLISH/SUBSCRIBE (multi-instance)
 */

import type { AnyEndpointEventEnvelope } from "../../core/structured-events";
import type { ReplayPrepareResult } from "../replay-buffer";

/**
 * Handler called when a message is received from the pub/sub layer.
 * The handler should deliver the event to local WebSocket connections.
 */
export type PubSubMessageHandler<
  TPubSubMessageData extends AnyEndpointEventEnvelope =
    AnyEndpointEventEnvelope,
> = (event: string, data: TPubSubMessageData, seq: number) => void;

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
   * Publish an event to all instances subscribed to this channel. Assigns the
   * event's replay seq and records it in the replay buffer when the channel
   * has replay state (see replay-buffer.ts).
   */
  publish(channel: string, event: string, data: AnyEndpointEventEnvelope): void;

  /** Subscribe to a channel. Handler is called for every received message. */
  subscribe<T extends AnyEndpointEventEnvelope>(
    channel: string,
    handler: PubSubMessageHandler<T>,
  ): void;

  /**
   * Resolves once a subscribe() is actually active (Redis acked SUBSCRIBE).
   * The replay read must start after it, or events published in between
   * would be in neither the replay nor the live stream.
   */
  whenSubscribed(channel: string): Promise<void>;

  /** Unsubscribe from a channel when there are no more local subscribers. */
  unsubscribe(channel: string): void;

  /**
   * A replay-aware client (re)subscribed: create the channel's replay state
   * if missing and return what it missed after `since`.
   */
  prepareReplay(
    channel: string,
    since: number | undefined,
  ): Promise<ReplayPrepareResult>;

  /** Keep replay state alive for channels that have (or just lost) subscribers. */
  touchReplay(channels: readonly string[]): void;

  /**
   * True when an emit for this channel must be published even with zero
   * local sockets: the channel has replay state, or (Redis) another node may
   * hold its subscribers.
   */
  mustPublish(channel: string): boolean;
}
