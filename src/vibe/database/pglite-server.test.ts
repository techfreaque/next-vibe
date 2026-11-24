/**
 * PGlite wire-proxy INSERT…RETURNING encoding.
 *
 * Regression: a jsonb `true` in a RETURNING row was re-encoded as the boolean
 * text "t", so node-postgres' JSON.parse failed ("Unexpected identifier t")
 * and every first chat-settings save with a toggle on returned 500.
 */

import { connect, type Server, type Socket } from "node:net";

import { PGlite } from "@electric-sql/pglite";
import { Client } from "pg";
import { serialize } from "pg-protocol";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { startPgliteServer } from "./pglite-server";

describe("pglite-server", () => {
  let pg: PGlite;
  let client: Client;
  let server: Server;
  let port: number;

  beforeAll(async () => {
    pg = new PGlite();
    await pg.exec(
      "CREATE TABLE t (id serial PRIMARY KEY, b jsonb, s jsonb, a jsonb, o jsonb, n jsonb, flag boolean)",
    );
    server = startPgliteServer(pg, { port: 0 });
    await new Promise<void>((resolve) => {
      server.once("listening", () => resolve());
    });
    const address = server.address();
    port = address && typeof address === "object" ? address.port : 0;
    client = new Client({ host: "127.0.0.1", port, user: "postgres" });
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
    server.close();
    await pg.close();
  });

  it("returns jsonb scalars, arrays and objects as JSON, booleans as booleans", async () => {
    const res = await client.query<{
      b: boolean;
      s: string;
      a: string[];
      o: { k: number };
      n: null;
      flag: boolean;
    }>(
      "INSERT INTO t (b, s, a, o, n, flag) VALUES ($1, $2, $3, $4, $5, $6) RETURNING b, s, a, o, n, flag",
      ["true", '"thea-dreamer"', '["x","y"]', '{"k":1}', null, true],
    );
    expect(res.rows[0]).toEqual({
      b: true,
      s: "thea-dreamer",
      a: ["x", "y"],
      o: { k: 1 },
      n: null,
      flag: true,
    });
  });

  it("keeps other clients out of a failed transaction until rollback", async () => {
    const other = new Client({ host: "127.0.0.1", port, user: "postgres" });
    await other.connect();
    try {
      await client.query("BEGIN");
      await expect(client.query("SELECT 1 / 0")).rejects.toMatchObject({
        code: "22012",
      });
      const reading = other.query<{ value: number }>("SELECT 73 AS value");
      const next = await Promise.race([
        reading.then(() => "query finished", () => "query failed"),
        Bun.sleep(40).then(() => "query waiting"),
      ]);
      await client.query("ROLLBACK");
      expect(next).toBe("query waiting");
      expect((await reading).rows).toEqual([{ value: 73 }]);
    } finally {
      await other.end();
    }
  });

  it("rolls back uncommitted work when the owning client disconnects", async () => {
    const owner = new Client({ host: "127.0.0.1", port, user: "postgres" });
    await owner.connect();
    try {
      await owner.query("BEGIN");
      await owner.query("INSERT INTO t(flag) VALUES (false) RETURNING id");
    } finally {
      await owner.end();
    }
    const result = await client.query("SELECT id FROM t WHERE flag = false");
    expect(result.rows).toEqual([]);
  });

  it("flushes an extended query when a partial frame is completed in the same turn", async () => {
    const accepted = new Promise<Socket>((resolve) => {
      server.once("connection", resolve);
    });
    const peer = connect(port, "127.0.0.1");
    try {
      const startup = new Promise<Buffer>((resolve) => {
        peer.once("data", resolve);
      });
      peer.write(serialize.startup({ user: "postgres", database: "postgres" }));
      const wire = await accepted;
      await startup;
      const reply = new Promise<Buffer>((resolve) => {
        peer.once("data", resolve);
      });
      const batch = Buffer.concat([
        serialize.parse({ text: "SELECT $1::int AS value" }),
        serialize.bind({ values: ["73"] }),
        serialize.describe({ type: "P" }),
        serialize.execute({}),
        serialize.sync(),
      ]);
      wire.emit("data", batch.subarray(0, 2));
      wire.emit("data", batch.subarray(2));
      const result = await Promise.race([reply, Bun.sleep(500)]);
      expect(result instanceof Buffer && result.includes("73")).toBe(true);
    } finally {
      peer.destroy();
    }
  });
});
