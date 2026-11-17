/**
 * Redis Pub/Sub Adapter
 *
 * Uses Redis PUBLISH/SUBSCRIBE for cross-instance WebSocket event broadcasting.
 * Requires two Redis connections: one for publishing, one for subscribing
 * (Redis requires a dedicated connection in subscribe mode).
 *
 * Self-healing (HA S2 reaches S1's Redis over WireGuard, which can drop for
 * minutes): both clients connect eagerly and reconnect forever with capped
 * backoff, TCP keepalive detects silently dropped links, and the subscriber
 * re-issues every registered channel on each `ready` so a SUBSCRIBE that
 * failed during an outage is never lost. Publishes during an outage fail fast
 * (realtime events go stale; nothing is queued for minutes).
 *
 * NOTE: This adapter is only loaded when WS_PUBSUB_TYPE=redis.
 * The `ioredis` package must be installed: `bun add ioredis`
 */

import type { Redis, RedisOptions } from "ioredis";

import type { AnyEndpointEventEnvelope } from "../../core/structured-events";
import type { PubSubAdapter, PubSubMessageHandler } from "./types";

interface RedisWireMessage {
  readonly event: string;
  readonly data: AnyEndpointEventEnvelope;
}

/** Reconnect backoff: 200 ms doubling, capped at 5 s, never gives up. */
export function redisRetryDelay(times: number): number {
  return Math.min(5_000, 200 * 2 ** Math.min(Math.max(times - 1, 0), 5));
}

const BASE_OPTIONS: RedisOptions = {
  connectTimeout: 10_000,
  keepAlive: 10_000,
  retryStrategy: redisRetryDelay,
};

export class RedisPubSubAdapter implements PubSubAdapter {
  // A Redis publish reaches local sockets ONLY via the relay subscription —
  // the WS server must register its per-channel handler.
  readonly deliversToLocalSockets = false;

  private publisher: Redis | null = null;
  private subscriber: Redis | null = null;
  private handlers = new Map<string, PubSubMessageHandler>();
  private connecting: Promise<void> | null = null;

  constructor(private readonly redisUrl: string) {}

  /**
   * One error line per outage and role (not one per reconnect attempt), and
   * one line when the link is back.
   */
  private watch(client: Redis, role: "publisher" | "subscriber"): void {
    let failing = false;
    client.on("error", (error: Error) => {
      if (failing) {
        return;
      }
      failing = true;
      // eslint-disable-next-line no-console
      console.error(
        `[PubSub] Redis ${role} connection error, reconnecting: ${error.message}`,
      );
    });
    client.on("ready", () => {
      if (failing) {
        failing = false;
        // eslint-disable-next-line no-console
        console.error(`[PubSub] Redis ${role} reconnected`);
      }
    });
  }

  private resubscribeAll(): void {
    const channels = [...this.handlers.keys()];
    if (!this.subscriber || channels.length === 0) {
      return;
    }
    this.subscriber.subscribe(...channels).catch(() => undefined);
  }

  private ensureConnected(): Promise<void> {
    if (this.connecting) {
      return this.connecting;
    }
    this.connecting = (async (): Promise<void> => {
      // Dynamic import so ioredis is only loaded when redis adapter is actually used
      const { default: RedisClient } = await import("ioredis");

      const publisher = new RedisClient(this.redisUrl, {
        ...BASE_OPTIONS,
        // A publish waits for at most one reconnect, then fails (caught).
        maxRetriesPerRequest: 1,
      });
      const subscriber = new RedisClient(this.redisUrl, {
        ...BASE_OPTIONS,
        // SUBSCRIBE waits for the link instead of being dropped.
        maxRetriesPerRequest: null,
      });
      this.watch(publisher, "publisher");
      this.watch(subscriber, "subscriber");

      // Route incoming messages to the appropriate handler
      subscriber.on("message", (channel: string, message: string) => {
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
      // autoResubscribe restores channels that were active at the drop; this
      // also restores any SUBSCRIBE that was rejected while the link was down.
      subscriber.on("ready", () => {
        this.resubscribeAll();
      });

      this.publisher = publisher;
      this.subscriber = subscriber;
    })().catch((error: Error) => {
      // Import failed: let the next call try again instead of caching it.
      this.connecting = null;
      // eslint-disable-next-line no-console
      console.error(`[PubSub] Redis adapter setup failed: ${error.message}`);
    });
    return this.connecting;
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
    // Rejected only while Redis is unreachable; the watch() line reports it.
    this.publisher
      .publish(channel, JSON.stringify(message))
      .catch(() => undefined);
  }

  subscribe<T extends AnyEndpointEventEnvelope>(
    channel: string,
    handler: PubSubMessageHandler<T>,
  ): void {
    this.handlers.set(channel, handler as PubSubMessageHandler);

    if (!this.subscriber) {
      void this.ensureConnected().then(() => {
        this.subscriber?.subscribe(channel).catch(() => undefined);
        return undefined;
      });
      return;
    }
    this.subscriber.subscribe(channel).catch(() => undefined);
  }

  unsubscribe(channel: string): void {
    this.handlers.delete(channel);

    if (this.subscriber) {
      this.subscriber.unsubscribe(channel).catch(() => undefined);
    }
  }
}
