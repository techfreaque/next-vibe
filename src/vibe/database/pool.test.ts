/**
 * Pool self-healing tests (real Postgres, never PGlite).
 *
 * Reproduces the HA incident: a black-holed connection used to hold a pooled
 * client forever and wedge the pool. Covers:
 *  - a query past statement_timeout fails fast with a clear error and the
 *    pool stays usable,
 *  - a query whose answer never arrives (black-holed link) fails at the client
 *    read timeout, inside a drizzle transaction too, and the wedged client is
 *    dropped instead of being handed to the next caller,
 *  - a connect that never completes fails at connectionTimeoutMillis.
 *
 * Needs the Hermes docker Postgres (docker-compose.preview.yml, port 5433) or
 * VIBE_TEST_PG_URL. Tests no-op when it is unreachable.
 */

import { createServer, type Server, type Socket, connect } from "node:net";

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createStandardPool } from "./pool";

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
 * TCP proxy in front of Postgres that can be switched to black-hole mode:
 * sockets stay open but every byte in both directions is silently dropped,
 * exactly like a WireGuard MTU black hole.
 */
interface BlackHoleProxy {
  url: string;
  setBlackHole: (on: boolean) => void;
  close: () => Promise<void>;
}

async function startProxy(target: URL): Promise<BlackHoleProxy> {
  let blackHole = false;
  const sockets = new Set<Socket>();
  const server: Server = createServer((downstream) => {
    const upstream = connect(Number(target.port), target.hostname);
    sockets.add(downstream);
    sockets.add(upstream);
    downstream.on("data", (chunk) => {
      if (!blackHole) {
        upstream.write(chunk);
      }
    });
    upstream.on("data", (chunk) => {
      if (!blackHole) {
        downstream.write(chunk);
      }
    });
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
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  const port = address && typeof address === "object" ? address.port : 0;
  const proxied = new URL(target.href);
  proxied.hostname = "127.0.0.1";
  proxied.port = String(port);
  return {
    url: proxied.href,
    setBlackHole: (on) => {
      blackHole = on;
    },
    close: async () => {
      for (const s of sockets) {
        s.destroy();
      }
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
    },
  };
}

async function elapsed<T>(
  fn: () => Promise<T>,
): Promise<{ ms: number; error: Error | null }> {
  const start = Date.now();
  try {
    await fn();
    return { ms: Date.now() - start, error: null };
  } catch (error) {
    return {
      ms: Date.now() - start,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

describe("pool self-healing (real Postgres)", () => {
  let proxy: BlackHoleProxy;
  let reachable = false;

  beforeAll(async () => {
    reachable = await isReachable(PG_URL);
    proxy = await startProxy(new URL(PG_URL));
  });

  afterAll(async () => {
    await proxy.close();
  });

  it("statement_timeout cancels a slow query fast and the pool stays usable", async () => {
    if (!reachable) {
      return;
    }
    const pool = createStandardPool({
      connectionString: PG_URL,
      max: 1,
      statementTimeoutMs: 500,
    });
    try {
      const slow = await elapsed(() => pool.query("SELECT pg_sleep(5)"));
      expect(slow.error?.message).toContain("statement timeout");
      expect(slow.ms).toBeLessThan(3_000);

      // Same single connection is still healthy (server cancel, no wedge).
      const ok = await pool.query<{ one: number }>("SELECT 1 AS one");
      expect(ok.rows[0]?.one).toBe(1);
      expect(pool.totalCount).toBe(1);

      const settings = await pool.query<{
        statement_timeout: string;
        idle_in_transaction_session_timeout: string;
      }>(
        "SELECT current_setting('statement_timeout') AS statement_timeout, current_setting('idle_in_transaction_session_timeout') AS idle_in_transaction_session_timeout",
      );
      expect(settings.rows[0]?.statement_timeout).toBe("500ms");
      expect(settings.rows[0]?.idle_in_transaction_session_timeout).not.toBe(
        "0",
      );
    } finally {
      await pool.end();
    }
  });

  it("a black-holed query fails at the client read timeout and the wedged client is dropped", async () => {
    if (!reachable) {
      return;
    }
    const pool = createStandardPool({
      connectionString: proxy.url,
      max: 1,
      statementTimeoutMs: 0,
      queryTimeoutMs: 800,
      connectionTimeoutMs: 2_000,
    });
    try {
      await pool.query("SELECT 1");
      expect(pool.totalCount).toBe(1);

      proxy.setBlackHole(true);
      const hung = await elapsed(() => pool.query("SELECT 1"));
      expect(hung.error?.message).toBe("Query read timeout");
      expect(hung.ms).toBeLessThan(3_000);
      proxy.setBlackHole(false);

      // max=1: if the wedged client were reused this would hang/time out.
      const ok = await pool.query<{ one: number }>("SELECT 1 AS one");
      expect(ok.rows[0]?.one).toBe(1);
    } finally {
      proxy.setBlackHole(false);
      await pool.end();
    }
  });

  it("a black-holed query inside a drizzle transaction does not poison the pool", async () => {
    if (!reachable) {
      return;
    }
    const pool = createStandardPool({
      connectionString: proxy.url,
      max: 1,
      statementTimeoutMs: 0,
      queryTimeoutMs: 800,
      connectionTimeoutMs: 2_000,
    });
    const db = drizzle(pool);
    try {
      await db.execute(sql`SELECT 1`);

      const hung = await elapsed(() =>
        db.transaction(async (tx) => {
          await tx.execute(sql`SELECT 1`);
          proxy.setBlackHole(true);
          await tx.execute(sql`SELECT 2`);
        }),
      );
      expect(hung.error).not.toBeNull();
      // Query + ROLLBACK each hit the read timeout.
      expect(hung.ms).toBeLessThan(5_000);
      proxy.setBlackHole(false);

      // drizzle released the client without an error; the guard must still
      // have dropped it, otherwise this queues behind the hung query.
      const ok = await elapsed(() => db.execute(sql`SELECT 1 AS one`));
      expect(ok.error).toBeNull();
      expect(ok.ms).toBeLessThan(2_000);
    } finally {
      proxy.setBlackHole(false);
      await pool.end();
    }
  });

  it("a connect that never completes fails at connectionTimeoutMillis", async () => {
    if (!reachable) {
      return;
    }
    proxy.setBlackHole(true);
    const pool = createStandardPool({
      connectionString: proxy.url,
      max: 1,
      statementTimeoutMs: 0,
      connectionTimeoutMs: 700,
    });
    try {
      const attempt = await elapsed(() => pool.query("SELECT 1"));
      expect(attempt.error?.message).toContain("timeout");
      expect(attempt.ms).toBeLessThan(3_000);
    } finally {
      proxy.setBlackHole(false);
      await pool.end().catch(() => undefined);
    }
  });
});
