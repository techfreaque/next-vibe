import { expect, it } from "bun:test";

import { PGlite } from "@electric-sql/pglite";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

import {
  enablePgResultDiagnostics,
  pgDiagnosticQueryLogger,
  summarizePgResultDecodes,
} from "./pg-result-diagnostics";
import { startPgliteServer } from "./pglite-server";
import { createStandardPool } from "./pool";

it("attributes a decoded result to its query and counts rows without recording values", async () => {
  const pg = new PGlite();
  await pg.exec(`
    CREATE TABLE cron_tasks (id int);
    INSERT INTO cron_tasks SELECT * FROM generate_series(1, 5000);
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
      sql`SELECT id, 'from error_logs fixture-sql-literal'::text AS fixture FROM cron_tasks`,
    );
    expect(response.rowCount).toBe(5_000);
    const summary = summarizePgResultDecodes(startedAt, Date.now());
    expect(summary).toEqual([
      expect.objectContaining({
        queryName: "SELECT cron_tasks",
        queryId: expect.stringMatching(/^[0-9a-f]{16}$/),
        relationOids: [expect.any(Number)],
        rowCount: 5_000,
        complete: true,
      }),
    ]);
    expect(JSON.stringify(summary)).not.toContain("fixture-sql-literal");
    expect(summarizePgResultDecodes(startedAt - 500, startedAt - 1)).toBeUndefined();
  } finally {
    await pool.end();
    server.close();
    await pg.close();
  }
});
