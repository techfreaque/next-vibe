/**
 * Replay buffer: sequence ids, catch-up after a reconnect, and the
 * "gap too old" answer that makes the client refetch instead.
 */

import { describe, expect, it } from "vitest";

import type { AnyEndpointEventEnvelope } from "../core/structured-events";
import {
  MemoryReplayBuffer,
  nextReplaySeq,
  type ReplayBufferLimits,
} from "./replay-buffer";

const CH = "user/lead-1/ws-test";

function envelope(token: string): AnyEndpointEventEnvelope {
  return {
    endpointPath: ["test"],
    endpointMethod: "GET",
    eventName: "content-delta",
    responseData: undefined,
    requestData: undefined,
    urlPathParams: {},
    payload: { token },
    channel: CH,
  };
}

function tokenOf(data: AnyEndpointEventEnvelope): string {
  const payload = data.payload;
  return typeof payload === "object" &&
    payload !== null &&
    "token" in payload &&
    typeof payload.token === "string"
    ? payload.token
    : "";
}

function makeBuffer(limits: Partial<ReplayBufferLimits> = {}): {
  buffer: MemoryReplayBuffer;
  clock: { now: number };
} {
  const clock = { now: 1_800_000_000_000 };
  const buffer = new MemoryReplayBuffer(
    { windowMs: 60_000, maxEvents: 100, stateTtlMs: 600_000, ...limits },
    () => clock.now,
  );
  return { buffer, clock };
}

describe("nextReplaySeq", () => {
  it("RB-SEQ-1: strictly increasing within one millisecond", () => {
    const a = nextReplaySeq(0, 1000);
    const b = nextReplaySeq(a, 1000);
    const c = nextReplaySeq(b, 1000);
    expect(a).toBe(1_000_000);
    expect(b).toBe(a + 1);
    expect(c).toBe(b + 1);
  });

  it("RB-SEQ-2: jumps to the clock, so a restarted process never reuses old ids", () => {
    const beforeRestart = nextReplaySeq(0, 5000);
    // A new process starts from 0 but a later wall clock.
    const afterRestart = nextReplaySeq(0, 5001);
    expect(afterRestart).toBeGreaterThan(beforeRestart);
  });
});

describe("MemoryReplayBuffer", () => {
  it("RB-1: events on a channel without replay state are numbered but not kept", () => {
    const { buffer } = makeBuffer();
    const seq = buffer.append(CH, "__event__", envelope("a"));
    expect(seq).toBeGreaterThan(0);
    expect(buffer.hasState(CH)).toBe(false);
    // A later resubscribe cannot prove anything about that gap.
    expect(buffer.prepare(CH, seq - 1).complete).toBe(false);
  });

  it("RB-2: first subscribe creates state and returns the cursor", () => {
    const { buffer } = makeBuffer();
    const pre = buffer.append(CH, "__event__", envelope("pre"));
    const first = buffer.prepare(CH, undefined);
    expect(first).toEqual({ cursor: pre, complete: true, events: [] });
    expect(buffer.hasState(CH)).toBe(true);
  });

  it("RB-3: resubscribe replays exactly the events after `since`, in order", () => {
    const { buffer, clock } = makeBuffer();
    const { cursor } = buffer.prepare(CH, undefined);
    const seen: number[] = [];
    for (const t of ["a", "b", "c"]) {
      seen.push(buffer.append(CH, "__event__", envelope(t)));
      clock.now += 5;
    }
    // Client saw "a", then dropped; "b" and "c" happened in the gap.
    const result = buffer.prepare(CH, seen[0]);
    expect(result.complete).toBe(true);
    expect(result.events.map((e) => tokenOf(e.data))).toEqual(["b", "c"]);
    expect(result.events.map((e) => e.seq)).toEqual([seen[1], seen[2]]);
    expect(result.cursor).toBe(seen[2]);
    // Resuming from the first-subscribe cursor replays everything.
    expect(buffer.prepare(CH, cursor).events).toHaveLength(3);
  });

  it("RB-4: other channels never leak into a replay", () => {
    const { buffer } = makeBuffer();
    const { cursor } = buffer.prepare(CH, undefined);
    buffer.prepare("user/lead-2/ws-test", undefined);
    buffer.append("user/lead-2/ws-test", "__event__", envelope("other"));
    buffer.append(CH, "__event__", envelope("mine"));
    const result = buffer.prepare(CH, cursor);
    expect(result.events.map((e) => tokenOf(e.data))).toEqual(["mine"]);
  });

  it("RB-5: count cap evicts the oldest; a gap reaching into them is incomplete", () => {
    const { buffer } = makeBuffer({ maxEvents: 3 });
    const { cursor } = buffer.prepare(CH, undefined);
    const seqs = ["a", "b", "c", "d", "e"].map((t) =>
      buffer.append(CH, "__event__", envelope(t)),
    );
    // "a" and "b" were evicted: resuming before them cannot be served.
    const tooOld = buffer.prepare(CH, cursor);
    expect(tooOld.complete).toBe(false);
    expect(tooOld.events).toEqual([]);
    // Resuming from "b" (the newest evicted) is still complete.
    const fromB = buffer.prepare(CH, seqs[1]);
    expect(fromB.complete).toBe(true);
    expect(fromB.events.map((e) => tokenOf(e.data))).toEqual(["c", "d", "e"]);
  });

  it("RB-6: time window evicts old events; resuming before them is incomplete", () => {
    const { buffer, clock } = makeBuffer({ windowMs: 1_000 });
    const { cursor } = buffer.prepare(CH, undefined);
    const old = buffer.append(CH, "__event__", envelope("old"));
    clock.now += 2_000;
    buffer.append(CH, "__event__", envelope("new"));
    expect(buffer.prepare(CH, cursor).complete).toBe(false);
    const fromOld = buffer.prepare(CH, old);
    expect(fromOld.complete).toBe(true);
    expect(fromOld.events.map((e) => tokenOf(e.data))).toEqual(["new"]);
  });

  it("RB-7: state expires after its TTL unless touched", () => {
    const { buffer, clock } = makeBuffer({ stateTtlMs: 10_000 });
    const { cursor } = buffer.prepare(CH, undefined);
    clock.now += 6_000;
    buffer.touch([CH]);
    clock.now += 6_000;
    buffer.sweep();
    expect(buffer.hasState(CH)).toBe(true);
    clock.now += 11_000;
    buffer.sweep();
    expect(buffer.hasState(CH)).toBe(false);
    // Nothing is known about the gap any more: refetch.
    expect(buffer.prepare(CH, cursor).complete).toBe(false);
  });

  it("RB-8: `since` from a previous process life is never complete on a fresh one", () => {
    const { buffer: before, clock } = makeBuffer();
    before.prepare(CH, undefined);
    const seen = before.append(CH, "__event__", envelope("a"));
    clock.now += 1_000;
    const { buffer: after } = makeBuffer();
    expect(after.prepare(CH, seen).complete).toBe(false);
  });
});
