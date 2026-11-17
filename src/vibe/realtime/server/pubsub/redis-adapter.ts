/**
 * Redis Pub/Sub Adapter
 *
 * Uses Redis PUBLISH/SUBSCRIBE for cross-instance WebSocket event broadcasting.
 * Requires two Redis connections: one for publishing, one for subscribing
 * (Redis requires a dedicated connection in subscribe mode).
 *
 * Replay buffer: every publish runs one Lua script that assigns the event's
 * sequence id (global, time-based), records it in the channel's replay list
 * when the channel has replay state, and PUBLISHes it — atomically, so seq
 * order IS publish order on every node. Both HA nodes share the buffer, so a
 * client that reconnects to the other node resumes where it left off. Same
 * rules as the in-memory store, see ../replay-buffer.ts.
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
import { z } from "zod";

import type { AnyEndpointEventEnvelope } from "../../core/structured-events";
import {
  DEFAULT_REPLAY_LIMITS,
  type ReplayBufferLimits,
  type ReplayEntry,
  type ReplayPrepareResult,
} from "../replay-buffer";
import type { PubSubAdapter, PubSubMessageHandler } from "./types";

interface RedisWireMessage {
  /** Replay seq; absent on messages published by an older build. */
  readonly seq?: number;
  readonly event: string;
  readonly data: AnyEndpointEventEnvelope;
}

const SEQ_KEY = "vibe:ws:rb:seq";
const eventsKey = (channel: string): string => `vibe:ws:rb:ev:${channel}`;
const stateKey = (channel: string): string => `vibe:ws:rb:st:${channel}`;

/**
 * KEYS: seq, events(zset seq -> message), state(hash ev/last)
 * ARGV: channel, message JSON minus its leading "{", windowMs, maxEvents, stateTtlMs
 * Returns the assigned seq. The stored and published message is the same
 * string with "seq" prepended.
 */
const PUBLISH_SCRIPT = `
local t = redis.call('TIME')
local nowMs = tonumber(t[1]) * 1000 + math.floor(tonumber(t[2]) / 1000)
local last = tonumber(redis.call('GET', KEYS[1]) or '0')
local seq = nowMs * 1000
if seq <= last then seq = last + 1 end
local seqStr = string.format('%.0f', seq)
redis.call('SET', KEYS[1], seqStr)
local msg = '{"seq":' .. seqStr .. ',' .. ARGV[2]
if redis.call('EXISTS', KEYS[3]) == 1 then
  local evicted = tonumber(redis.call('HGET', KEYS[3], 'ev') or '0')
  if redis.call('EXISTS', KEYS[2]) == 0 then
    local stLast = tonumber(redis.call('HGET', KEYS[3], 'last') or '0')
    if stLast > evicted then evicted = stLast end
  end
  redis.call('ZADD', KEYS[2], seq, msg)
  local cutoff = '(' .. string.format('%.0f', (nowMs - tonumber(ARGV[3])) * 1000)
  local top = redis.call('ZREVRANGEBYSCORE', KEYS[2], cutoff, '-inf', 'WITHSCORES', 'LIMIT', 0, 1)
  if #top == 2 then
    local s = tonumber(top[2])
    if s > evicted then evicted = s end
    redis.call('ZREMRANGEBYSCORE', KEYS[2], '-inf', cutoff)
  end
  local over = redis.call('ZCARD', KEYS[2]) - tonumber(ARGV[4])
  if over > 0 then
    local r = redis.call('ZRANGE', KEYS[2], over - 1, over - 1, 'WITHSCORES')
    local s = tonumber(r[2])
    if s > evicted then evicted = s end
    redis.call('ZREMRANGEBYRANK', KEYS[2], 0, over - 1)
  end
  redis.call('HSET', KEYS[3], 'ev', string.format('%.0f', evicted), 'last', seqStr)
  redis.call('PEXPIRE', KEYS[3], ARGV[5])
  redis.call('PEXPIRE', KEYS[2], ARGV[3])
end
redis.call('PUBLISH', ARGV[1], msg)
return seqStr
`;

/**
 * KEYS: seq, events, state   ARGV: since ('' = first subscribe), stateTtlMs
 * Returns { cursor, complete(0|1), messages[] }.
 */
const PREPARE_SCRIPT = `
local cursorStr = redis.call('GET', KEYS[1]) or '0'
if redis.call('EXISTS', KEYS[3]) == 0 then
  redis.call('HSET', KEYS[3], 'ev', cursorStr, 'last', cursorStr)
  redis.call('PEXPIRE', KEYS[3], ARGV[2])
  if ARGV[1] == '' then return {cursorStr, 1, {}} end
  return {cursorStr, 0, {}}
end
redis.call('PEXPIRE', KEYS[3], ARGV[2])
if ARGV[1] == '' then return {cursorStr, 1, {}} end
local since = tonumber(ARGV[1])
local evicted = tonumber(redis.call('HGET', KEYS[3], 'ev') or '0')
if redis.call('EXISTS', KEYS[2]) == 0 then
  local last = tonumber(redis.call('HGET', KEYS[3], 'last') or '0')
  if last > evicted then evicted = last end
end
if since < evicted then return {cursorStr, 0, {}} end
return {cursorStr, 1, redis.call('ZRANGEBYSCORE', KEYS[2], '(' .. ARGV[1], '+inf')}
`;

const prepareReplySchema = z.tuple([
  z.string(),
  z.number(),
  z.array(z.string()),
]);

/** Parse one Redis wire message (pub/sub frame or replay entry). */
function parseRedisWireMessage(raw: string): RedisWireMessage | null {
  try {
    const parsed = JSON.parse(raw) as RedisWireMessage;
    if (
      parsed === null ||
      typeof parsed !== "object" ||
      typeof parsed.event !== "string"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
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
  /** Per channel: resolves once Redis acked the SUBSCRIBE. */
  private subscribed = new Map<string, Promise<void>>();
  private connecting: Promise<void> | null = null;

  constructor(
    private readonly redisUrl: string,
    private readonly replayLimits: ReplayBufferLimits = DEFAULT_REPLAY_LIMITS,
  ) {}

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

        const parsed = parseRedisWireMessage(message);
        if (!parsed) {
          return; // Malformed message - skip
        }
        handler(parsed.event, parsed.data, parsed.seq ?? 0);
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
    // `{"event":…,"data":…}` minus the leading "{": the script prepends the
    // seq it assigns, so the stored and the published message are one string.
    const body = JSON.stringify({ event, data }).slice(1);
    // Rejected only while Redis is unreachable; the watch() line reports it.
    this.publisher
      .eval(
        PUBLISH_SCRIPT,
        3,
        SEQ_KEY,
        eventsKey(channel),
        stateKey(channel),
        channel,
        body,
        this.replayLimits.windowMs,
        this.replayLimits.maxEvents,
        this.replayLimits.stateTtlMs,
      )
      .catch(() => undefined);
  }

  subscribe<T extends AnyEndpointEventEnvelope>(
    channel: string,
    handler: PubSubMessageHandler<T>,
  ): void {
    this.handlers.set(channel, handler as PubSubMessageHandler);

    // Never rejects: a SUBSCRIBE that fails during an outage is re-issued on
    // the next `ready` (resubscribeAll); a waiting replay just proceeds.
    const done = this.ensureConnected()
      .then(() => this.subscriber?.subscribe(channel))
      .then(
        () => undefined,
        () => undefined,
      );
    this.subscribed.set(channel, done);
  }

  whenSubscribed(channel: string): Promise<void> {
    return this.subscribed.get(channel) ?? Promise.resolve();
  }

  unsubscribe(channel: string): void {
    this.handlers.delete(channel);
    this.subscribed.delete(channel);

    if (this.subscriber) {
      this.subscriber.unsubscribe(channel).catch(() => undefined);
    }
  }

  async prepareReplay(
    channel: string,
    since: number | undefined,
  ): Promise<ReplayPrepareResult> {
    await this.ensureConnected();
    if (!this.publisher) {
      return { cursor: 0, complete: since === undefined, events: [] };
    }
    const reply = prepareReplySchema.safeParse(
      await this.publisher.eval(
        PREPARE_SCRIPT,
        3,
        SEQ_KEY,
        eventsKey(channel),
        stateKey(channel),
        since === undefined ? "" : String(since),
        this.replayLimits.stateTtlMs,
      ),
    );
    if (!reply.success) {
      return { cursor: 0, complete: since === undefined, events: [] };
    }
    const [cursor, complete, messages] = reply.data;
    const events: ReplayEntry[] = [];
    for (const raw of messages) {
      const parsed = parseRedisWireMessage(raw);
      if (parsed?.seq !== undefined) {
        events.push({
          seq: parsed.seq,
          event: parsed.event,
          data: parsed.data,
        });
      }
    }
    return { cursor: Number(cursor), complete: complete === 1, events };
  }

  touchReplay(channels: readonly string[]): void {
    if (!this.publisher || channels.length === 0) {
      return;
    }
    const pipeline = this.publisher.pipeline();
    for (const channel of channels) {
      pipeline.pexpire(stateKey(channel), this.replayLimits.stateTtlMs);
    }
    pipeline.exec().catch(() => undefined);
  }

  mustPublish(): boolean {
    // Another node may hold this channel's subscribers; the replay state
    // lives in Redis too. Always publish.
    return true;
  }
}
