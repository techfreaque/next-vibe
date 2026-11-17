/**
 * Redis replay buffer (WS_PUBSUB_TYPE=redis): both HA nodes share one Redis,
 * so a client that drops on S1 and reconnects to S2 resumes without a gap.
 * Two adapter instances play S1 and S2.
 *
 * Needs a Redis at VIBE_TEST_REDIS_URL (default redis://127.0.0.1:6379);
 * no-op when unreachable.
 */

import { connect } from "node:net";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { AnyEndpointEventEnvelope } from "../../core/structured-events";
import { RedisPubSubAdapter } from "./redis-adapter";

const REDIS_URL = new URL(
  process.env["VIBE_TEST_REDIS_URL"] ?? "redis://127.0.0.1:6379",
);

async function reachable(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const s = connect(Number(REDIS_URL.port || 6379), REDIS_URL.hostname);
    s.setTimeout(1_000);
    s.once("connect", () => {
      s.destroy();
      resolve(true);
    });
    s.once("error", () => resolve(false));
    s.once("timeout", () => {
      s.destroy();
      resolve(false);
    });
  });
}

function tokenEnvelope(token: number): AnyEndpointEventEnvelope {
  return {
    endpointPath: ["replay-test"],
    endpointMethod: "GET",
    eventName: "content-delta",
    responseData: undefined,
    requestData: undefined,
    urlPathParams: {},
    payload: { token },
  };
}

function tokenOf(data: AnyEndpointEventEnvelope): number {
  const payload = data.payload;
  return typeof payload === "object" &&
    payload !== null &&
    "token" in payload &&
    typeof payload.token === "number"
    ? payload.token
    : -1;
}

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const run = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const LIMITS = { windowMs: 60_000, maxEvents: 50, stateTtlMs: 60_000 };

describe("Redis replay buffer (shared by S1 and S2)", () => {
  let available = false;
  let s1: RedisPubSubAdapter;
  let s2: RedisPubSubAdapter;

  beforeAll(async () => {
    available = await reachable();
    s1 = new RedisPubSubAdapter(REDIS_URL.toString(), LIMITS);
    s2 = new RedisPubSubAdapter(REDIS_URL.toString(), LIMITS);
  });

  afterAll(() => {
    s1.unsubscribe(`ch-${run}-live`);
  });

  it("RR-1: events published on S1 while the client is away are replayed by S2, in order", async () => {
    if (!available) {
      return;
    }
    const channel = `ch-${run}-switch`;
    // Client subscribed on S1: S1 created the shared replay state.
    const first = await s1.prepareReplay(channel, undefined);
    expect(first.complete).toBe(true);

    // Client drops; S1 keeps streaming.
    for (let i = 0; i < 20; i++) {
      s1.publish(channel, "__event__", tokenEnvelope(i));
    }
    await delay(200);

    // Client reconnects to S2 with the cursor it got from S1.
    const resumed = await s2.prepareReplay(channel, first.cursor);
    expect(resumed.complete).toBe(true);
    expect(resumed.events.map((e) => tokenOf(e.data))).toEqual(
      [...Array.from({ length: 20 }).keys()],
    );
    const seqs = resumed.events.map((e) => e.seq);
    expect(seqs).toEqual(seqs.toSorted((a, b) => a - b));
    expect(new Set(seqs).size).toBe(20);
    expect(resumed.cursor).toBe(seqs[seqs.length - 1]);

    // Resuming mid-way replays only the rest.
    const mid = await s2.prepareReplay(channel, seqs[9]);
    expect(mid.events.map((e) => tokenOf(e.data))).toEqual(
      [...Array.from({ length: 10 }).keys()].map((i) => i + 10),
    );
  });

  it("RR-2: live delivery to the other node carries the same seq as the buffer", async () => {
    if (!available) {
      return;
    }
    const channel = `ch-${run}-live`;
    const live: Array<{ token: number; seq: number }> = [];
    s2.subscribe(channel, (event, data, seq) => {
      expect(event).toBe("__event__");
      live.push({ token: tokenOf(data), seq });
    });
    await s2.whenSubscribed(channel);
    const { cursor } = await s2.prepareReplay(channel, undefined);
    for (let i = 0; i < 5; i++) {
      s1.publish(channel, "__event__", tokenEnvelope(i));
    }
    await delay(200);
    expect(live.map((e) => e.token)).toEqual([0, 1, 2, 3, 4]);
    const replay = await s1.prepareReplay(channel, cursor);
    expect(replay.events.map((e) => e.seq)).toEqual(live.map((e) => e.seq));
  });

  it("RR-3: a gap past the cap, or a channel without state, is incomplete", async () => {
    if (!available) {
      return;
    }
    const channel = `ch-${run}-cap`;
    const { cursor } = await s1.prepareReplay(channel, undefined);
    for (let i = 0; i < LIMITS.maxEvents + 10; i++) {
      s1.publish(channel, "__event__", tokenEnvelope(i));
    }
    await delay(300);
    const tooOld = await s2.prepareReplay(channel, cursor);
    expect(tooOld.complete).toBe(false);
    expect(tooOld.events).toEqual([]);

    // A client that was barely behind still resumes from the buffer.
    const all = await s2.prepareReplay(channel, tooOld.cursor - 1);
    expect(all.complete).toBe(true);

    // Never-subscribed channel: nothing is known about the gap.
    const unknown = await s2.prepareReplay(`ch-${run}-unknown`, cursor);
    expect(unknown.complete).toBe(false);
  });
});
