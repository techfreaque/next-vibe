import "server-only";

import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";

import {
  isPglite,
  onPoolRebuild,
  pgliteAsNodePg,
  pgliteClient,
  pool,
} from "./client";

/**
 * Build a Drizzle client registered with a single domain's schema cluster.
 *
 * The default `db` (./index.ts) carries NO schema, so it cannot serve the
 * relational query API (`db.query.<table>.findFirst(...)`). Domains that need
 * relational queries call this factory with just their own tables + relations
 * and export the resulting typed client from their `db.ts`. This keeps the
 * heavy 20-schema fan-out out of `index.ts` (and out of the 470 callers that
 * only need `.select/.insert/...`), while preserving full type safety and the
 * `db.query` API where it is actually used.
 *
 * The schema cluster only needs the tables a query actually traverses — a flat
 * `findFirst` (no `with:`) needs only the queried table, not its relation
 * targets. Register the relations too when you traverse them.
 *
 * The returned client stays valid across pool resets (dev reconnect): it is a
 * thin stable wrapper that rebuilds its inner drizzle client on pool rebuild,
 * so domains can export it once at module load and keep using it.
 */
export function createRelationalDb<
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- drizzle's schema generic is bound to Record<string, unknown>; this must match its constraint exactly.
  TSchema extends Record<string, unknown>,
>(schema: TSchema): NodePgDatabase<TSchema> {
  const build = (): NodePgDatabase<TSchema> => {
    if (isPglite) {
      // pgliteClient is non-null in PGlite mode (initialised in ./client.ts).
      return pgliteAsNodePg(
        drizzlePglite(pgliteClient as NonNullable<typeof pgliteClient>, {
          schema,
        }),
      );
    }
    // pool is non-null when isPglite is false (initialised in ./client.ts).
    return drizzle(pool as NonNullable<typeof pool>, { schema });
  };

  let inner = build();
  // In pool mode, rebuild against the fresh pool after a dev reset.
  // In PGlite mode this callback never fires (the embedded client never swaps).
  onPoolRebuild(() => {
    inner = build();
  });

  // Stable wrapper so domains keep one reference while `inner` is swapped underneath.
  return new Proxy({} as NodePgDatabase<TSchema>, {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Proxy trap signature requires the target param even though delegation targets the swappable `inner`.
    get(_target, prop) {
      const value = Reflect.get(inner, prop, inner);
      // Bind methods to `inner` so drizzle's internal `this` stays correct
      // when the client is swapped after a pool rebuild.
      return typeof value === "function" ? value.bind(inner) : value;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Proxy trap signature requires the target param even though delegation targets the swappable `inner`.
    has(_target, prop) {
      return Reflect.has(inner, prop);
    },
  });
}
