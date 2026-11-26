import { randomUUID } from "node:crypto";
import { connect, createServer, type Socket } from "node:net";

import { afterAll, beforeAll, describe, expect, it, spyOn } from "bun:test";
import { sql } from "drizzle-orm";
import { Pool } from "pg";

import {
  withLeadDatabaseDeadline,
  withLeadLookupDeadline,
} from "./database-deadline";

const connectionString =
  process.env["VIBE_TEST_PG_URL"] ??
  "postgres://postgres:postgres@localhost:5433/hermes";
const observer = new Pool({
  connectionString,
  max: 1,
  connectionTimeoutMillis: 1000,
});
const table = `guest_lead_deadline_${randomUUID().replaceAll("-", "")}`;
const relation = sql.identifier(table);

describe("guest lead database deadline (local Postgres)", () => {
  afterAll(async () => {
    try {
      await observer.query(`DROP TABLE IF EXISTS ${table}`);
    } finally {
      await observer.end();
    }
  });
  beforeAll(async () => {
    await observer.query(`CREATE TABLE ${table} (id integer PRIMARY KEY)`);
  });

  it("releases a late checkout without ever starting its work", async () => {
    const pool = new Pool({ connectionString, max: 1 });
    const held = await pool.connect();
    let fixtureReleased = false;
    let started = false;
    try {
      const start = performance.now();
      await expect(
        withLeadDatabaseDeadline(pool, start + 100, async () => {
          started = true;
        }),
      ).rejects.toMatchObject({
        message: "Guest lead database deadline exceeded",
        phase: "checkout",
        poolTotal: 1,
        poolIdle: 0,
        poolWaiting: 1,
      });
      expect(performance.now() - start).toBeLessThan(1500);
      held.release();
      fixtureReleased = true;
      await pool.query("SELECT 1");
      expect(started).toBe(false);
      expect(pool.idleCount).toBe(1);
      expect(pool.waitingCount).toBe(0);
    } finally {
      if (!fixtureReleased) {
        held.release();
      }
      await pool.end();
    }
  });

  it("removes expired guest waiters before they enter pg-pool", async () => {
    const pool = new Pool({ connectionString, max: 1 });
    const held = await pool.connect();
    const checkout = spyOn(pool, "connect");
    let fixtureReleased = false;
    try {
      const expiredDeadline = performance.now() + 100;
      let expiredWorkStarted = false;
      const expiring = Array.from({ length: 8 }, () =>
        withLeadLookupDeadline(pool, expiredDeadline, () => {
          expiredWorkStarted = true;
          return Promise.resolve(false);
        }),
      );
      const expiration = Promise.allSettled(expiring);
      const live = withLeadLookupDeadline(
        pool,
        performance.now() + 1500,
        () => Promise.resolve(true),
      );
      expect(pool.waitingCount).toBe(1);
      expect((await expiration).map(({ status }) => status)).toEqual(
        Array.from({ length: 8 }, () => "rejected"),
      );
      expect(pool.waitingCount).toBe(1);
      held.release();
      fixtureReleased = true;
      expect(await live).toBe(true);
      expect(pool.waitingCount).toBe(0);
      expect(checkout).toHaveBeenCalledTimes(1);
      expect(expiredWorkStarted).toBe(false);
    } finally {
      checkout.mockRestore();
      if (!fixtureReleased) {
        held.release();
      }
      await pool.end();
    }
  });

  it("executes an existing lead lookup in a single round trip", async () => {
    const pool = new Pool({ connectionString, max: 1 });
    const held = await pool.connect();
    const query = spyOn(held, "query");
    held.release();
    try {
      await observer.query(`INSERT INTO ${table} VALUES (5)`);
      const rows = await withLeadLookupDeadline(
        pool,
        performance.now() + 1500,
        (db) =>
          db
            .select({ id: sql<number>`id` })
            .from(sql`${relation}`)
            .where(sql`id = 5`),
      );
      expect(rows).toEqual([{ id: 5 }]);
      expect(query).toHaveBeenCalledTimes(1);
      expect(pool.idleCount).toBe(1);
    } finally {
      query.mockRestore();
      await pool.end();
    }
  });

  it("bounds a read-only SELECT and releases pool capacity", async () => {
    const pool = new Pool({ connectionString, max: 1 });
    try {
      const start = performance.now();
      await expect(
        withLeadLookupDeadline(pool, start + 150, (db) =>
          db
            .select({ value: sql`pg_sleep(2)` })
            .from(sql`(VALUES (1)) AS fixture(id)`),
        ),
      ).rejects.toMatchObject({
        message: "Guest lead database deadline exceeded",
        phase: "lookup",
      });
      expect(performance.now() - start).toBeLessThan(1500);
      await pool.query("SELECT 1");
      expect(pool.idleCount).toBe(1);
    } finally {
      await pool.end();
    }
  });

  it("sets transaction-local server limits and commits successful work", async () => {
    const pool = new Pool({ connectionString });
    try {
      const result = await withLeadDatabaseDeadline(
        pool,
        performance.now() + 1500,
        async (db) => {
          const settings = await db.execute<{
            lock: number;
            statement: number;
          }>(sql`
          SELECT setting::int AS lock,
            (SELECT setting::int FROM pg_settings WHERE name = 'statement_timeout') AS statement
          FROM pg_settings WHERE name = 'lock_timeout'`);
          await db.execute(sql`INSERT INTO ${relation} VALUES (1)`);
          return settings.rows[0];
        },
      );
      expect(result?.lock).toBeGreaterThan(0);
      expect(result?.lock).toBeLessThan(result?.statement ?? 0);
      expect(result?.statement).toBeLessThanOrEqual(1500);
      expect(
        (await observer.query(`SELECT id FROM ${table} WHERE id=1`)).rowCount,
      ).toBe(1);
    } finally {
      await pool.end();
    }
  });

  it("rolls back an earlier write when a subsequent insert blocks on a lock", async () => {
    const pool = new Pool({ connectionString });
    const blocker = await observer.connect();
    try {
      await blocker.query("BEGIN");
      await blocker.query(`INSERT INTO ${table} VALUES (2)`);
      const start = performance.now();
      await expect(
        withLeadDatabaseDeadline(pool, start + 1500, async (db) => {
          await db.execute(sql`INSERT INTO ${relation} VALUES (3)`);
          // Give PostgreSQL a distinct deadline for this lock, so slow setup
          // or an earlier write cannot race its error against the client timer.
          await db.execute(sql`SET LOCAL lock_timeout = '50ms'`);
          await db.execute(sql`INSERT INTO ${relation} VALUES (2)`);
        }),
      ).rejects.toMatchObject({ cause: { code: "55P03" } });
      expect(performance.now() - start).toBeLessThan(1500);
      await blocker.query("ROLLBACK");
      expect(
        (await blocker.query(`SELECT id FROM ${table} WHERE id IN (2, 3)`))
          .rowCount,
      ).toBe(0);
      await pool.query("SELECT 1");
    } finally {
      await blocker.query("ROLLBACK");
      blocker.release();
      await pool.end();
    }
  });

  it("cancels a slow statement before the client deadline", async () => {
    const pool = new Pool({ connectionString });
    try {
      const start = performance.now();
      await expect(
        withLeadDatabaseDeadline(pool, start + 400, (db) =>
          db.execute(sql`SELECT pg_sleep(2)`),
        ),
      ).rejects.toMatchObject({ cause: { code: "57014" } });
      expect(performance.now() - start).toBeLessThan(1500);
    } finally {
      await pool.end();
    }
  });

  it("discards the client and rolls back the insert when an upstream reply never arrives", async () => {
    const target = new URL(connectionString);
    const sockets = new Set<Socket>();
    let dropReplies = false;
    const proxy = createServer((downstream) => {
      const upstream = connect(Number(target.port) || 5432, target.hostname);
      sockets.add(downstream);
      sockets.add(upstream);
      downstream.pipe(upstream);
      upstream.on("data", (data: Buffer) => {
        if (!dropReplies) {
          downstream.write(data);
        }
      });
      const close = (): void => {
        downstream.destroy();
        upstream.destroy();
      };
      downstream.on("close", close).on("error", close);
      upstream.on("close", close).on("error", close);
    });
    const pool = await new Promise<Pool>((resolve, reject) => {
      proxy.once("error", reject);
      proxy.listen(0, "127.0.0.1", () => {
        const address = proxy.address();
        if (!address || typeof address === "string") {
          reject(new Error("TCP fixture unavailable"));
          return;
        }
        const proxied = new URL(target);
        proxied.hostname = "127.0.0.1";
        proxied.port = String(address.port);
        resolve(
          new Pool({
            connectionString: proxied.href,
            max: 1,
            connectionTimeoutMillis: 950,
            query_timeout: 950,
          }),
        );
      });
    });
    try {
      const start = performance.now();
      await expect(
        withLeadDatabaseDeadline(pool, start + 400, async (db) => {
          await db.execute(sql`INSERT INTO ${relation} VALUES (4)`);
          dropReplies = true;
          await db.execute(sql`SELECT 1`);
        }),
      ).rejects.toThrow("Guest lead database deadline exceeded");
      expect(dropReplies).toBe(true);
      expect(performance.now() - start).toBeLessThan(1500);
      dropReplies = false;
      await pool.query("SELECT 1");
      expect(
        (await observer.query(`SELECT id FROM ${table} WHERE id=4`)).rowCount,
      ).toBe(0);
      expect(pool.idleCount).toBe(1);
    } finally {
      for (const socket of sockets) {
        socket.destroy();
      }
      await pool.end();
      await new Promise<void>((resolve) => {
        proxy.close(() => resolve());
      });
    }
  });
});
