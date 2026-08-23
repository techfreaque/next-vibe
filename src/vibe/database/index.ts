import "server-only";

import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";

import { parseError } from "../core/utils/parse-error";
import type { EndpointLogger } from "../logger/types";
import { isPglite, onPgliteReopen, pool, recreatePool } from "./client";

export { getLivePgliteClient, isPglite, pgliteClient } from "./client";
export { jsonbBool, supportsAdvancedSql } from "./compat";

/**
 * Default database client — registered with NO schema.
 *
 * In both standard (pg) and PGlite modes, `pool` is a pg.Pool:
 *  - Standard: pool → DATABASE_URL postgres
 *  - PGlite: pool → Unix socket served by pglite-server.ts
 *
 * This means `db` is always just drizzle(pool) — no Proxy needed.
 */

/**
 * PGlite shim that satisfies the Pool interface used by ping/health.
 */
interface RawPoolShim {
  query(sql: string): Promise<void>;
  totalCount: number;
  idleCount: number;
  waitingCount: number;
  ending: boolean;
  ended: boolean;
  end(): Promise<void>;
}

// pool is non-null at this point: isPglite initialises pool in client.ts,
// standard mode initialises pool in client.ts.
export let db: NodePgDatabase<Record<string, never>> = drizzle(pool as Pool);

export let rawPool: RawPoolShim = pool as Pool;

// In PGlite mode, after reopenPgliteAfterMigrations() the server restarts on
// the new instance. The socket pool continues to work unchanged — no rebuild needed.
// We still register a no-op so that relational.ts and other listeners remain in
// the callback set.
if (isPglite) {
  onPgliteReopen(() => {
    // Intentional no-op — socket pool connects to the restarted server automatically.
  });
}

let databaseClosed = false;

export async function closeDatabase(logger: EndpointLogger): Promise<void> {
  if (databaseClosed) {
    return;
  }
  if (rawPool.ending || rawPool.ended) {
    databaseClosed = true;
    return;
  }
  try {
    databaseClosed = true;
    await rawPool.end();
  } catch (error) {
    logger.error("Database pool close failed", parseError(error));
  }
}

export function reopenDatabase(): void {
  if (isPglite) {
    return;
  }
  const newPool = recreatePool();
  db = drizzle(newPool as Pool);
  rawPool = newPool as Pool;
  databaseClosed = false;
}
