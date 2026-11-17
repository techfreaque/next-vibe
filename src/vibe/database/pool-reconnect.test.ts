/**
 * Pool reconnect tests: connections must recover by themselves once the
 * network returns (HA incident 2026-11-17: S2 lost WireGuard to S1's Postgres
 * for ~80 min).
 *
 * Pure part (no database): the connect-retry helper retries transient
 * failures (ECONNREFUSED, reset, server starting) with bounded backoff and
 * never retries real errors.
 *
 * Real-Postgres part (Hermes docker Postgres on 5433 or VIBE_TEST_PG_URL,
 * no-op when unreachable), through a TCP proxy that can go down hard
 * (listener closed = ECONNREFUSED, open sockets reset):
 *  - a pool whose first connect hits ECONNREFUSED connects as soon as the
 *    port is back, inside the retry budget;
 *  - a pool that lived through an outage (sockets reset, port refused)
 *    serves queries and transactions again after recovery, same instance,
 *    no restart.
 */

import { createServer, connect, type Server, type Socket } from "node:net";

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  type ConnectRetryOptions,
  createStandardPool,
  isTransientConnectError,
  retryTransientConnect,
} from "./pool";

function errorWithCode(code: string, message = code): Error {
  return Object.assign(new Error(message), { code });
}

function retryOpts(
  overrides: Partial<ConnectRetryOptions> = {},
): ConnectRetryOptions & { sleeps: number[] } {
  const sleeps: number[] = [];
  return {
    retries: 3,
    baseDelayMs: 100,
    maxDelayMs: 2_000,
    random: () => 1,
    sleep: async (ms) => {
      sleeps.push(ms);
    },
    sleeps,
    ...overrides,
  };
}

describe("retryTransientConnect", () => {
  it("retries ECONNREFUSED with growing backoff, then returns the connection", async () => {
    const opts = retryOpts();
    let calls = 0;
    const result = await retryTransientConnect(async () => {
      calls++;
      if (calls <= 2) {
        // eslint-disable-next-line restricted/restricted-syntax -- simulated connect failure
        throw errorWithCode("ECONNREFUSED", "connect ECONNREFUSED 10.88.0.1:5432");
      }
      return "client";
    }, opts);
    expect(result).toBe("client");
    expect(calls).toBe(3);
    expect(opts.sleeps).toEqual([100, 200]);
  });

  it("never retries a non-transient error (bad password)", async () => {
    const opts = retryOpts();
    let calls = 0;
    const attempt = retryTransientConnect(async () => {
      calls++;
      // eslint-disable-next-line restricted/restricted-syntax -- simulated auth failure
      throw errorWithCode("28P01", "password authentication failed");
    }, opts);
    await expect(attempt).rejects.toThrow("password authentication failed");
    expect(calls).toBe(1);
    expect(opts.sleeps).toEqual([]);
  });

  it("gives up after the retry budget with the last error", async () => {
    const opts = retryOpts({ retries: 2 });
    let calls = 0;
    const attempt = retryTransientConnect(async () => {
      calls++;
      // eslint-disable-next-line restricted/restricted-syntax -- simulated outage
      throw errorWithCode("ECONNREFUSED", `refused #${String(calls)}`);
    }, opts);
    await expect(attempt).rejects.toThrow("refused #3");
    expect(calls).toBe(3);
    expect(opts.sleeps).toEqual([100, 200]);
  });

  it("caps the backoff at maxDelayMs and applies jitter", async () => {
    const opts = retryOpts({
      retries: 6,
      baseDelayMs: 500,
      maxDelayMs: 1_000,
      random: () => 0,
    });
    let calls = 0;
    await retryTransientConnect(async () => {
      calls++;
      if (calls <= 4) {
        // eslint-disable-next-line restricted/restricted-syntax -- simulated outage
        throw errorWithCode("ECONNRESET");
      }
      return calls;
    }, opts);
    // random()=0 -> half of min(max, base*2^n)
    expect(opts.sleeps).toEqual([250, 500, 500, 500]);
  });

  it("reports each retry", async () => {
    const seen: string[] = [];
    let calls = 0;
    await retryTransientConnect(
      async () => {
        calls++;
        if (calls === 1) {
          // eslint-disable-next-line restricted/restricted-syntax -- simulated outage
          throw errorWithCode("EHOSTUNREACH");
        }
        return calls;
      },
      retryOpts({
        onRetry: (error, attempt, delayMs) => {
          seen.push(`${error.message}:${String(attempt)}:${String(delayMs)}`);
        },
      }),
    );
    expect(seen).toEqual(["EHOSTUNREACH:1:100"]);
  });
});

describe("isTransientConnectError", () => {
  it("classifies network and server-startup failures as transient", () => {
    for (const code of [
      "ECONNREFUSED",
      "ECONNRESET",
      "ETIMEDOUT",
      "EHOSTUNREACH",
      "ENETUNREACH",
      "EPIPE",
      "EAI_AGAIN",
      "57P03",
      "08006",
    ]) {
      expect(isTransientConnectError(errorWithCode(code))).toBe(true);
    }
    expect(
      isTransientConnectError(new Error("Connection terminated unexpectedly")),
    ).toBe(true);
  });

  it("does not retry auth, config or pool-slot timeouts", () => {
    expect(isTransientConnectError(errorWithCode("28P01"))).toBe(false);
    expect(isTransientConnectError(errorWithCode("3D000"))).toBe(false);
    expect(
      isTransientConnectError(
        new Error("timeout exceeded when trying to connect"),
      ),
    ).toBe(false);
    expect(
      isTransientConnectError(
        new Error("Cannot use a pool after calling end on the pool"),
      ),
    ).toBe(false);
  });
});

// ─── Real Postgres ───────────────────────────────────────────────────────────

const PG_URL =
  process.env["VIBE_TEST_PG_URL"] ??
  "postgres://postgres:postgres@localhost:5433/hermes";

async function isReachable(url: string): Promise<boolean> {
  const client = new Client({
    connectionString: url,
    connectionTimeoutMillis: 2_000,
  });
  try {
    await client.connect();
    await client.query("SELECT 1");
    return true;
  } catch {
    return false;
  } finally {
    await client.end().catch(() => undefined);
  }
}

/**
 * TCP proxy in front of Postgres on a FIXED port that can go down like a dead
 * link: `down()` resets every open socket and closes the listener (new
 * connects get ECONNREFUSED); `up()` listens again on the same port.
 */
interface OutageProxy {
  url: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
  close: () => Promise<void>;
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

async function startOutageProxy(
  target: URL,
  listenNow: boolean,
): Promise<OutageProxy> {
  const port = await freePort();
  const sockets = new Set<Socket>();
  let server: Server | null = null;

  const up = async (): Promise<void> => {
    if (server) {
      return;
    }
    const s = createServer((downstream) => {
      const upstream = connect(Number(target.port), target.hostname);
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
      downstream.on("close", drop);
      upstream.on("close", drop);
      downstream.on("error", drop);
      upstream.on("error", drop);
    });
    server = s;
    await new Promise<void>((resolve) => {
      s.listen(port, "127.0.0.1", resolve);
    });
  };

  const down = async (): Promise<void> => {
    const s = server;
    server = null;
    for (const socket of sockets) {
      socket.resetAndDestroy();
    }
    sockets.clear();
    if (s) {
      await new Promise<void>((resolve) => {
        s.close(() => resolve());
      });
    }
  };

  if (listenNow) {
    await up();
  }
  const proxied = new URL(target.href);
  proxied.hostname = "127.0.0.1";
  proxied.port = String(port);
  return { url: proxied.href, up, down, close: down };
}

describe("pool reconnect after an outage (real Postgres)", () => {
  let reachable = false;
  const proxies: OutageProxy[] = [];

  beforeAll(async () => {
    reachable = await isReachable(PG_URL);
  });

  afterAll(async () => {
    for (const p of proxies) {
      await p.close();
    }
  });

  it("first connect hits ECONNREFUSED, succeeds once the port is back", async () => {
    if (!reachable) {
      return;
    }
    const proxy = await startOutageProxy(new URL(PG_URL), false);
    proxies.push(proxy);
    const retries: string[] = [];
    const pool = createStandardPool({
      connectionString: proxy.url,
      max: 2,
      statementTimeoutMs: 0,
      connectionTimeoutMs: 2_000,
      connectRetry: {
        retries: 8,
        baseDelayMs: 100,
        onRetry: (error) => {
          retries.push("code" in error ? String(error.code) : error.message);
        },
      },
    });
    try {
      // The "link" comes back 400 ms into the query.
      setTimeout(() => {
        void proxy.up();
      }, 400);
      const res = await pool.query<{ one: number }>("SELECT 1 AS one");
      expect(res.rows[0]?.one).toBe(1);
      expect(retries.length).toBeGreaterThan(0);
      expect(retries.every((code) => code === "ECONNREFUSED")).toBe(true);
    } finally {
      await pool.end();
    }
  });

  it("a pool that lived through an outage serves queries and transactions again", async () => {
    if (!reachable) {
      return;
    }
    const proxy = await startOutageProxy(new URL(PG_URL), true);
    proxies.push(proxy);
    const pool = createStandardPool({
      connectionString: proxy.url,
      max: 3,
      statementTimeoutMs: 0,
      connectionTimeoutMs: 2_000,
      connectRetry: { retries: 1, baseDelayMs: 50 },
    });
    const db = drizzle(pool);
    try {
      // Warm the pool: several idle connections through the "link".
      await Promise.all([
        pool.query("SELECT 1"),
        pool.query("SELECT 2"),
        pool.query("SELECT 3"),
      ]);
      expect(pool.totalCount).toBeGreaterThan(0);

      // Outage: every open socket reset, the port refuses.
      await proxy.down();
      const during = await pool.query("SELECT 1").then(
        () => null,
        (error: Error) => error,
      );
      expect(during).not.toBeNull();

      // Network back: the same pool instance recovers on its own.
      await proxy.up();
      const ok = await pool.query<{ one: number }>("SELECT 1 AS one");
      expect(ok.rows[0]?.one).toBe(1);
      const tx = await db.transaction(async (t) => {
        const rows = await t.execute(sql`SELECT 7 AS seven`);
        return rows.rows[0];
      });
      expect(tx).toEqual({ seven: 7 });
      // Several concurrent checkouts too (no dead client handed out).
      const many = await Promise.all(
        [1, 2, 3, 4, 5].map((n) =>
          pool.query<{ n: number }>("SELECT $1::int AS n", [n]),
        ),
      );
      expect(many.map((r) => r.rows[0]?.n)).toEqual([1, 2, 3, 4, 5]);
    } finally {
      await pool.end();
    }
  });

  it("recycles connections at maxLifetimeSeconds", async () => {
    if (!reachable) {
      return;
    }
    const pool = createStandardPool({
      connectionString: PG_URL,
      max: 1,
      statementTimeoutMs: 0,
      maxLifetimeSeconds: 1,
    });
    try {
      const first = await pool.query<{ pid: number }>(
        "SELECT pg_backend_pid() AS pid",
      );
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1_300);
      });
      const second = await pool.query<{ pid: number }>(
        "SELECT pg_backend_pid() AS pid",
      );
      expect(second.rows[0]?.pid).not.toBe(first.rows[0]?.pid);
    } finally {
      await pool.end();
    }
  });
});
