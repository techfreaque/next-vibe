/**
 * PGlite wire-proxy INSERT…RETURNING encoding.
 *
 * Regression: a jsonb `true` in a RETURNING row was re-encoded as the boolean
 * text "t", so node-postgres' JSON.parse failed ("Unexpected identifier t")
 * and every first chat-settings save with a toggle on returned 500.
 */

import { PGlite } from "@electric-sql/pglite";
import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { startPgliteServer } from "./pglite-server";

describe("pglite-server INSERT…RETURNING", () => {
  let pg: PGlite;
  let client: Client;
  let close: () => void;

  beforeAll(async () => {
    pg = new PGlite();
    await pg.exec(
      "CREATE TABLE t (id serial PRIMARY KEY, b jsonb, s jsonb, a jsonb, o jsonb, n jsonb, flag boolean)",
    );
    const server = startPgliteServer(pg, { port: 0 });
    await new Promise<void>((resolve) => {
      server.once("listening", () => resolve());
    });
    close = (): void => {
      server.close();
    };
    const address = server.address();
    const port = address && typeof address === "object" ? address.port : 0;
    client = new Client({ host: "127.0.0.1", port, user: "postgres" });
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
    close();
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
});
