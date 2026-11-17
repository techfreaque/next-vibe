/**
 * Redis pub/sub adapter: recovers by itself after the link to Redis drops
 * (HA S2 reaches S1's Redis over WireGuard).
 *
 * Needs a Redis at VIBE_TEST_REDIS_URL (default redis://127.0.0.1:6379);
 * no-op when unreachable. Goes through a TCP proxy that can go down hard
 * (open sockets reset, listener closed = ECONNREFUSED).
 */

import { connect, createServer, type Server, type Socket } from "node:net";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { AnyEndpointEventEnvelope } from "../../core/structured-events";
import { RedisPubSubAdapter, redisRetryDelay } from "./redis-adapter";

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

async function freePort(): Promise<number> {
  const probe = createServer();
  await new Promise<void>((resolve) => {
    probe.listen(0, "127.0.0.1", resolve);
  });
  const address = probe.address();
  const port = address && typeof address === "object" ? address.port : 0;
  await new Promise<void>((resolve) => {
    probe.close(() => resolve());
  });
  return port;
}

interface OutageProxy {
  url: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

async function startProxy(): Promise<OutageProxy> {
  const port = await freePort();
  const sockets = new Set<Socket>();
  let server: Server | null = null;
  const up = async (): Promise<void> => {
    if (server) {
      return;
    }
    const s = createServer((downstream) => {
      const upstream = connect(
        Number(REDIS_URL.port || 6379),
        REDIS_URL.hostname,
      );
      sockets.add(downstream);
      sockets.add(upstream);
      downstream.pipe(upstream);
      upstream.pipe(downstream);
      const drop = (): void => {
        downstream.destroy();
        upstream.destroy();
        sockets.delete(downstream);
        sockets.delete(upstream);
      };
      for (const sock of [downstream, upstream]) {
        sock.on("close", drop);
        sock.on("error", drop);
      }
    });
    server = s;
    await new Promise<void>((resolve) => {
      s.listen(port, "127.0.0.1", resolve);
    });
  };
  const down = async (): Promise<void> => {
    const s = server;
    server = null;
    for (const sock of sockets) {
      sock.resetAndDestroy();
    }
    sockets.clear();
    if (s) {
      await new Promise<void>((resolve) => {
        s.close(() => resolve());
      });
    }
  };
  await up();
  return { url: `redis://127.0.0.1:${String(port)}`, up, down };
}

async function waitFor(check: () => boolean, timeoutMs: number): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (check()) {
      return true;
    }
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 50);
    });
  }
  return check();
}

function envelope(n: number): AnyEndpointEventEnvelope {
  return {
    endpointPath: ["test"],
    endpointMethod: "GET",
    eventName: "e",
    responseData: { n },
    requestData: {},
    urlPathParams: {},
    payload: { n },
  };
}

describe("redisRetryDelay", () => {
  it("backs off from 200 ms to a 5 s cap and never gives up", () => {
    expect([1, 2, 3, 4, 5, 6, 7, 50].map(redisRetryDelay)).toEqual([
      200, 400, 800, 1_600, 3_200, 5_000, 5_000, 5_000,
    ]);
  });
});

describe("RedisPubSubAdapter reconnect (real Redis)", () => {
  let ok = false;
  let proxy: OutageProxy | null = null;

  beforeAll(async () => {
    ok = await reachable();
    if (ok) {
      proxy = await startProxy();
    }
  });

  afterAll(async () => {
    await proxy?.down();
  });

  it("delivers again after an outage, including channels subscribed while down", async () => {
    if (!ok || !proxy) {
      return;
    }
    const adapter = new RedisPubSubAdapter(proxy.url);
    // Separate publisher straight to Redis (the other box's adapter).
    const other = new RedisPubSubAdapter(REDIS_URL.href);
    const got: string[] = [];
    try {
      adapter.subscribe("t:before", (event, data) => {
        got.push(`${event}:before:${JSON.stringify(data)}`);
      });
      // Wait until the subscription is live.
      expect(
        await waitFor(() => {
          other.publish("t:before", "e", envelope(0));
          return got.length > 0;
        }, 5_000),
      ).toBe(true);
      got.length = 0;

      await proxy.down();
      // Subscribed while the link is down.
      adapter.subscribe("t:during", (event, data) => {
        got.push(`${event}:during:${JSON.stringify(data)}`);
      });
      // Publishing while down must not throw or reject unhandled.
      adapter.publish("t:before", "e", envelope(99));
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 3_000);
      });
      await proxy.up();

      expect(
        await waitFor(() => {
          other.publish("t:before", "e", envelope(1));
          other.publish("t:during", "e", envelope(2));
          return (
            got.some((g) => g.includes(":before:")) &&
            got.some((g) => g.includes(":during:"))
          );
        }, 15_000),
      ).toBe(true);
    } finally {
      adapter.unsubscribe("t:before");
      adapter.unsubscribe("t:during");
    }
  }, 30_000);
});
