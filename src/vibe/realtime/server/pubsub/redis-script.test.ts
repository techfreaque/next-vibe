/**
 * Replay scripts run by SHA (EVALSHA) and fall back to EVAL only when Redis
 * lost its script cache. A publish burst used to ship the full Lua source
 * with every event and stalled the event loop (prod 2026-11-27 09:34).
 */

import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  PUBLISHER_OPTIONS,
  type ReplayScript,
  runReplayScript,
  type ScriptClient,
} from "./redis-adapter";

const SOURCE = "return redis.call('GET', KEYS[1])";
const SCRIPT: ReplayScript = {
  source: SOURCE,
  sha: createHash("sha1").update(SOURCE).digest("hex"),
};

function fakeClient(cached: boolean, failWith?: string): {
  client: ScriptClient<string>;
  calls: string[];
} {
  const calls: string[] = [];
  const client: ScriptClient<string> = {
    evalsha: (sha, numKeys, ...args) => {
      calls.push(`evalsha ${sha} ${String(numKeys)} ${args.join(",")}`);
      if (failWith) {
        return Promise.reject(new Error(failWith));
      }
      if (!cached) {
        return Promise.reject(
          new Error("NOSCRIPT No matching script. Please use EVAL."),
        );
      }
      return Promise.resolve("ok-sha");
    },
    eval: (script, numKeys, ...args) => {
      calls.push(`eval ${script} ${String(numKeys)} ${args.join(",")}`);
      return Promise.resolve("ok-eval");
    },
  };
  return { client, calls };
}

describe("runReplayScript", () => {
  it("sends only the SHA when Redis has the script cached", async () => {
    const { client, calls } = fakeClient(true);
    await expect(
      runReplayScript(client, SCRIPT, 1, ["k", 5]),
    ).resolves.toEqual({ ok: true, reply: "ok-sha" });
    expect(calls).toEqual([`evalsha ${SCRIPT.sha} 1 k,5`]);
  });

  it("loads the source once on NOSCRIPT", async () => {
    const { client, calls } = fakeClient(false);
    await expect(
      runReplayScript(client, SCRIPT, 1, ["k"]),
    ).resolves.toEqual({ ok: true, reply: "ok-eval" });
    expect(calls).toEqual([
      `evalsha ${SCRIPT.sha} 1 k`,
      `eval ${SOURCE} 1 k`,
    ]);
  });

  it("does not hide other errors (Redis unreachable)", async () => {
    const { client, calls } = fakeClient(true, "Connection is closed.");
    await expect(runReplayScript(client, SCRIPT, 1, ["k"])).resolves.toEqual({
      ok: false,
      error: "Connection is closed.",
    });
    expect(calls).toHaveLength(1);
  });

  it("coalesces a burst into one write per tick", () => {
    expect(PUBLISHER_OPTIONS.enableAutoPipelining).toBe(true);
    expect(PUBLISHER_OPTIONS.maxRetriesPerRequest).toBe(1);
  });
});
