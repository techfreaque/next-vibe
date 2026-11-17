/**
 * WS replay buffer — bounded per-channel event history for catch-up after a
 * reconnect (network blip, deploy drain 1012, S1 <-> S2 switch).
 *
 * Every published event gets a sequence id that is strictly increasing per
 * channel. A client that resubscribes sends the last seq it saw (`since`); the
 * server answers with the events after it, or `complete: false` when part of
 * the gap was already evicted, in which case the client refetches.
 *
 * Correctness rule: a channel's history is only trusted while the channel has
 * replay STATE. State is created when a replay-aware client subscribes and kept
 * while anyone is subscribed (periodic touch) plus `stateTtlMs` after. While
 * state exists, EVERY event on the channel is recorded; whatever leaves the
 * buffer raises `evictedMax`. So `since >= evictedMax` proves nothing after
 * `since` was lost. No state = nothing is known = incomplete.
 *
 * Sequence ids are time-based (`max(last + 1, nowMs * 1000)`), so they keep
 * increasing across process restarts and Redis restarts. That keeps a client's
 * `since` from an earlier server life from masking newer events.
 *
 * This file holds the in-memory store (WS_PUBSUB_TYPE=local). The Redis store
 * (WS_PUBSUB_TYPE=redis, shared by both HA nodes) mirrors the same rules in Lua
 * — see pubsub/redis-adapter.ts.
 */

import type { AnyEndpointEventEnvelope } from "../core/structured-events";

/** One buffered event, as replayed to a resubscribing client. */
export interface ReplayEntry {
  readonly seq: number;
  readonly event: string;
  readonly data: AnyEndpointEventEnvelope;
}

/** Answer to a (re)subscribe: what the client missed, or that it must refetch. */
export interface ReplayPrepareResult {
  /** Highest seq assigned so far; the client is caught up to it after replay. */
  readonly cursor: number;
  /** False when events after `since` were evicted (or are unknown). */
  readonly complete: boolean;
  /** Events with seq > since, ascending. Empty when incomplete. */
  readonly events: readonly ReplayEntry[];
}

export interface ReplayBufferLimits {
  /** Events older than this leave the buffer. */
  readonly windowMs: number;
  /** Hard cap per channel (long AI streams emit many deltas per second). */
  readonly maxEvents: number;
  /** Channel state outlives its last subscriber/event by this long. */
  readonly stateTtlMs: number;
}

export const DEFAULT_REPLAY_LIMITS: ReplayBufferLimits = {
  windowMs: 120_000,
  maxEvents: 4_000,
  stateTtlMs: 60 * 60_000,
};

/**
 * How often the WS server refreshes replay state of channels that still have
 * subscribers. Well below `stateTtlMs`.
 */
export const REPLAY_TOUCH_INTERVAL_MS = 5 * 60_000;

/** Next sequence id: strictly increasing, and never behind the wall clock. */
export function nextReplaySeq(lastSeq: number, nowMs: number): number {
  return Math.max(lastSeq + 1, Math.floor(nowMs) * 1000);
}

interface BufferedEvent extends ReplayEntry {
  readonly at: number;
}

interface ChannelReplayState {
  events: BufferedEvent[];
  /** Highest seq that left the buffer (or was unknown when state began). */
  evictedMax: number;
  /** Last subscribe/event/touch; state expires `stateTtlMs` after it. */
  touchedAt: number;
}

/** Sweep expired state at most this often (lazily, on append/prepare). */
const SWEEP_INTERVAL_MS = 30_000;

export class MemoryReplayBuffer {
  private lastSeq = 0;
  private lastSweepAt = 0;
  private readonly states = new Map<string, ChannelReplayState>();

  constructor(
    private readonly limits: ReplayBufferLimits = DEFAULT_REPLAY_LIMITS,
    private readonly now: () => number = Date.now,
  ) {}

  /** Highest seq assigned so far. */
  get cursor(): number {
    return this.lastSeq;
  }

  /** True while the channel's history is tracked (deliver even with 0 sockets). */
  hasState(channel: string): boolean {
    return this.states.has(channel);
  }

  /**
   * Assign the next seq to an event and record it when the channel has
   * replay state. Returns the seq to put on the wire.
   */
  append(
    channel: string,
    event: string,
    data: AnyEndpointEventEnvelope,
  ): number {
    const now = this.now();
    this.lastSeq = nextReplaySeq(this.lastSeq, now);
    const seq = this.lastSeq;
    const state = this.states.get(channel);
    if (state) {
      state.events.push({ seq, event, data, at: now });
      state.touchedAt = now;
      this.trim(state, now);
    }
    this.maybeSweep(now);
    return seq;
  }

  /**
   * Called when a replay-aware client (re)subscribes. Creates the channel's
   * state if it has none, then answers what happened after `since`.
   * `since` undefined = first subscribe: just hand out the cursor.
   */
  prepare(channel: string, since: number | undefined): ReplayPrepareResult {
    const now = this.now();
    this.maybeSweep(now);
    const cursor = this.lastSeq;
    const existing = this.states.get(channel);
    if (!existing) {
      this.states.set(channel, {
        events: [],
        evictedMax: cursor,
        touchedAt: now,
      });
      return { cursor, complete: since === undefined, events: [] };
    }
    existing.touchedAt = now;
    this.trim(existing, now);
    if (since === undefined) {
      return { cursor, complete: true, events: [] };
    }
    if (since < existing.evictedMax) {
      return { cursor, complete: false, events: [] };
    }
    const events: ReplayEntry[] = [];
    for (const entry of existing.events) {
      if (entry.seq > since) {
        events.push({ seq: entry.seq, event: entry.event, data: entry.data });
      }
    }
    return { cursor, complete: true, events };
  }

  /** Keep the state of channels that still have (or just lost) subscribers. */
  touch(channels: readonly string[]): void {
    const now = this.now();
    for (const channel of channels) {
      const state = this.states.get(channel);
      if (state) {
        state.touchedAt = now;
      }
    }
  }

  /** Drop events past the window/cap and state past its TTL. */
  sweep(): void {
    const now = this.now();
    this.lastSweepAt = now;
    for (const [channel, state] of this.states) {
      if (now - state.touchedAt > this.limits.stateTtlMs) {
        this.states.delete(channel);
        continue;
      }
      this.trim(state, now);
    }
  }

  private maybeSweep(now: number): void {
    if (now - this.lastSweepAt >= SWEEP_INTERVAL_MS) {
      this.sweep();
    }
  }

  private trim(state: ChannelReplayState, now: number): void {
    const cutoff = now - this.limits.windowMs;
    let drop = 0;
    while (
      drop < state.events.length &&
      (state.events.length - drop > this.limits.maxEvents ||
        (state.events[drop]?.at ?? now) < cutoff)
    ) {
      drop++;
    }
    if (drop === 0) {
      return;
    }
    const lastDropped = state.events[drop - 1];
    if (lastDropped) {
      state.evictedMax = Math.max(state.evictedMax, lastDropped.seq);
    }
    state.events.splice(0, drop);
  }
}
