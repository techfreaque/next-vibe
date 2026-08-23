import "server-only";

import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";

import { onPgliteReopen, onPoolRebuild, pool } from "./client";

/**
 * Build a Drizzle client registered with a single domain's schema cluster.
 *
 * The default `db` (./index.ts) carries NO schema, so it cannot serve the
 * relational query API (`db.query.<table>.findFirst(...)`). Domains that need
 * relational queries call this factory with just their own tables + relations
 * and export the resulting typed client from their `db.ts`.
 *
 * In both standard (pg) and PGlite (socket proxy) modes, `pool` is always a
 * pg.Pool — so this factory is uniform. The relational client rebuilds itself
 * on pool swap (dev reset) and on PGlite reopen (migration cycle).
 */
export function createRelationalDb<
  // eslint-disable-next-line restricted/no-unknown -- drizzle's schema generic is bound to Record<string, unknown>; this must match its constraint exactly.
  TSchema extends Record<string, unknown>,
>(schema: TSchema): NodePgDatabase<TSchema> {
  const buildCurrent = (): NodePgDatabase<TSchema> =>
    drizzle(pool as Pool, { schema });

  let inner = buildCurrent();

  onPoolRebuild(() => {
    inner = buildCurrent();
  });

  onPgliteReopen(() => {
    // Socket server restarts on new PGlite instance; pool reconnects automatically.
    inner = buildCurrent();
  });

  return new Proxy({} as NodePgDatabase<TSchema>, {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Proxy trap requires target param
    get(_target, prop) {
      const value = Reflect.get(inner, prop, inner);
      return typeof value === "function" ? value.bind(inner) : value;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Proxy trap requires target param
    has(_target, prop) {
      return Reflect.has(inner, prop);
    },
  });
}
