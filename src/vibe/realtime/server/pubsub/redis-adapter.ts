/**
 * Redis Pub/Sub Adapter
 *
 * Uses Redis PUBLISH/SUBSCRIBE for cross-instance WebSocket event broadcasting.
 * Requires two Redis connections: one for publishing, one for subscribing
 * (Redis requires a dedicated connection in subscribe mode).
 *
 *
 * NOTE: This adapter is only loaded when WS_PUBSUB_TYPE=redis.
 * The `ioredis` package must be installed: `bun add ioredis`
 */

import type { Redis } from "ioredis";

import type { AnyEndpointEventEnvelope } from "../../core/structured-events";
import type { PubSubAdapter, PubSubMessageHandler } from "./types";

interface RedisWireMessage {
  readonly event: string;
  readonly data: AnyEndpointEventEnvelope;
}

export class RedisPubSubAdapter implements PubSubAdapter {
  // A Redis publish reaches local sockets ONLY via the relay subscription —
  // the WS server must register its per-channel handler.
  readonly deliversToLocalSockets = false;

  private publisher: Redis | null = null;
  private subscriber: Redis | null = null;
  private handlers = new Map<string, PubSubMessageHandler>();
  private initialized = false;

  constructor(private readonly redisUrl: string) {}

  private async ensureConnected(): Promise<void> {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    // Dynamic import so ioredis is only loaded when redis adapter is actually used
    const { default: RedisClient } = await import("ioredis");

    this.publisher = new RedisClient(this.redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    });
    this.subscriber = new RedisClient(this.redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    });

    await Promise.all([this.publisher.connect(), this.subscriber.connect()]);

    // Route incoming messages to the appropriate handler
    this.subscriber.on("message", (channel: string, message: string) => {
      const handler = this.handlers.get(channel);
      if (!handler) {
        return;
      }

      try {
        const parsed = JSON.parse(message) as RedisWireMessage;
        handler(parsed.event, parsed.data);
      } catch {
        // Malformed message - skip
      }
    });
  }

  publish(
    channel: string,
    event: string,
    data: AnyEndpointEventEnvelope,
  ): void {
    if (!this.publisher) {
      // Queue the connection setup, then publish
      void this.ensureConnected().then(() => {
        this.publishSync(channel, event, data);
        return undefined;
      });
      return;
    }
    this.publishSync(channel, event, data);
  }

  private publishSync(
    channel: string,
    event: string,
    data: AnyEndpointEventEnvelope,
  ): void {
    if (!this.publisher) {
      return;
    }
    const message: RedisWireMessage = { event, data };
    void this.publisher.publish(channel, JSON.stringify(message));
  }

  subscribe<T extends AnyEndpointEventEnvelope>(
    channel: string,
    handler: PubSubMessageHandler<T>,
  ): void {
    this.handlers.set(channel, handler as PubSubMessageHandler);

    if (!this.subscriber) {
      void this.ensureConnected().then(() => {
        void this.subscriber?.subscribe(channel);
        return undefined;
      });
      return;
    }
    void this.subscriber.subscribe(channel);
  }

  unsubscribe(channel: string): void {
    this.handlers.delete(channel);

    if (this.subscriber) {
      void this.subscriber.unsubscribe(channel);
    }
  }
}
