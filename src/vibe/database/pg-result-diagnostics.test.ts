import { expect, it } from "bun:test";

import { PGlite } from "@electric-sql/pglite";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

import {
  enablePgResultDiagnostics,
  largePgDispatchesDuring,
  pgDiagnosticQueryLogger,
  summarizePgResultDecodes,
} from "./pg-result-diagnostics";
import { startPgliteServer } from "./pglite-server";
import { createStandardPool, describePgPoolCheckouts } from "./pool";

it("attributes decoded results and pool checkouts without recording query values", async () => {
  const pg = new PGlite();
  await pg.exec(`
    CREATE TABLE cron_tasks (id int, metadata text);
    INSERT INTO cron_tasks
      SELECT id, 'fixture-row-value' FROM generate_series(1, 5000) AS id;
  `);
  const server = startPgliteServer(pg, { port: 0 });
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  const port = address && typeof address === "object" ? address.port : 0;
  const pool = createStandardPool({
    connectionString: `postgres://postgres@127.0.0.1:${String(port)}/postgres`,
    max: 1,
    statementTimeoutMs: 0,
  });
  try {
    enablePgResultDiagnostics();
    const db = drizzle(pool, { logger: pgDiagnosticQueryLogger });
    const startedAt = Date.now();
    const response = await db.execute(
      sql`SELECT id, metadata, 'from error_logs fixture-sql-literal'::text AS fixture FROM cron_tasks`,
    );
    expect(response.rowCount).toBe(5_000);
    const summary = summarizePgResultDecodes(startedAt, Date.now());
    expect(summary).toEqual([
      expect.objectContaining({
        queryName: "SELECT cron_tasks",
        queryId: expect.stringMatching(/^[0-9a-f]{16}$/),
        relationOids: [expect.any(Number)],
        columnCount: 3,
        payloadColumns: ["metadata"],
        decodedPacketBytes: expect.any(Number),
        rowCount: 5_000,
        complete: true,
      }),
    ]);
    expect(JSON.stringify(summary)).not.toContain("fixture-sql-literal");
    expect(JSON.stringify(summary)).not.toContain("fixture-row-value");
    expect(summarizePgResultDecodes(startedAt - 500, startedAt - 1)).toBeUndefined();

    const client = await pool.connect();
    try {
      expect(describePgPoolCheckouts(pool)).toEqual([
        { heldMs: expect.any(Number), query: null },
      ]);
      const reading = client.query(
        "SELECT id FROM cron_tasks WHERE metadata = $1",
        ["fixture-row-value"],
      );
      try {
        expect(describePgPoolCheckouts(pool)).toEqual([
          { heldMs: expect.any(Number), query: "SELECT cron_tasks" },
        ]);
      } finally {
        await reading;
      }
    } finally {
      client.release();
    }
    expect(describePgPoolCheckouts(pool)).toEqual([]);
  } finally {
    await pool.end();
    server.close();
    await pg.close();
  }
});

it("identifies large statement dispatches inside the timer interval without SQL or values", () => {
  enablePgResultDiagnostics();
  const start = Date.now();
  const statement = "UPDATE leads SET metadata = 'fixture-private-value'";
  pgDiagnosticQueryLogger.logQuery(statement, { length: 2 });
  pgDiagnosticQueryLogger.logQuery(statement, { length: 350 });
  const dispatches = largePgDispatchesDuring(start, Date.now());
  expect(dispatches).toEqual([
    expect.objectContaining({
      queryName: "UPDATE leads",
      parameterCount: 350,
      sqlChars: statement.length,
    }),
  ]);
  expect(JSON.stringify(dispatches)).not.toContain("fixture-private-value");
  expect(largePgDispatchesDuring(start - 1, start - 1)).toBeUndefined();
});
