import "server-only";

import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import type { Pool } from "pg";

import { parseError } from "../core/utils/parse-error";
import type { EndpointLogger } from "../logger/types";
import {
  isPglite,
  pgliteAsNodePg,
  pgliteClient,
  pool,
  recreatePool,
} from "./client";

export { isPglite, pgliteClient } from "./client";

/**
 * Default database client — registered with NO schema.
 *
 * `.select()/.insert()/.update()/.delete()/.execute()/.transaction()` do not
 * need a registered schema (table types come from the imported table objects),
 * so the vast majority of callers use this bare client with full type safety.
 *
 * The relational query API (`db.query.<table>...`) is NOT available here — it
 * lives on per-domain clients built via `./relational.ts` (`createRelationalDb`)
 * and exported from each domain's `db.ts`. This is deliberate: it keeps the
 * 20-domain schema fan-out out of this module, so importing `db` no longer
 * transitively references every domain's table definitions.
 */

/**
 * PGlite shim that satisfies the Pool interface used by ping/health.
 * Exposes the same .query(), .totalCount, .idleCount, .waitingCount surface
 * so callers need zero changes when running against an embedded DB.
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

/**
 * Drizzle ORM database client (no schema registered).
 * PGlite mode: embedded in-process Postgres stored at the file: path.
 * Standard mode: pg connection pool.
 */
export let db: NodePgDatabase<Record<string, never>> = (() => {
  if (isPglite) {
    return pgliteAsNodePg(
      drizzlePglite(pgliteClient as NonNullable<typeof pgliteClient>),
    );
  }
  return drizzle(pool as Pool);
})();

/**
 * Raw pool for direct queries (pool stats, health checks).
 * In PGlite mode this is a shim with the same surface — callers need no changes.
 */
export let rawPool: RawPoolShim = isPglite
  ? {
      query: (querySql: string) =>
        db.execute(querySql as never).then(() => undefined),
      totalCount: 1,
      idleCount: 1,
      waitingCount: 0,
      ending: false,
      ended: false,
      end: () => Promise.resolve(),
    }
  : (pool as Pool); // pool is non-null here: isPglite=false branch initialises pool in ./client.ts

/**
 * Track if database has been closed to prevent double-close errors
 */
let databaseClosed = false;

/**
 * Gracefully close database connections
 * Should be called when the application is shutting down
 */
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

/**
 * Reopen database connections after a reset (e.g. `vibe dev -r`).
 * No-op in PGlite mode (embedded db doesn't need reconnection).
 */
export function reopenDatabase(): void {
  if (isPglite) {
    return;
  }
  const newPool = recreatePool();
  db = drizzle(newPool as Pool);
  rawPool = newPool as Pool;
  databaseClosed = false;
}
