import "server-only";

import { PGlite } from "@electric-sql/pglite";
import { type NodePgDatabase } from "drizzle-orm/node-postgres";
import { type PgliteDatabase } from "drizzle-orm/pglite";
import { databaseEnv } from "next-vibe/database/env";
import { Pool } from "pg";

/**
 * Shared database connection primitives.
 *
 * This module owns the raw pool / PGlite client and the driver-selection logic.
 * Both the default client (./index.ts) and the per-domain relational clients
 * (./relational.ts) build on top of these primitives, so neither has to import
 * the other — this is the seam that keeps `index.ts` free of any domain schema
 * fan-out.
 */

/**
 * Database URL — resolved at module load time before the env singleton is ready.
 * If the URL starts with "file:" it selects the PGlite embedded driver;
 * everything else uses the standard pg connection pool.
 */
const DATABASE_URL = process.env["DATABASE_URL"] ?? databaseEnv.DATABASE_URL;

/**
 * True when running against a local PGlite file database (headless-client mode).
 * Detected purely from the DATABASE_URL prefix — no extra env var needed.
 */
export const isPglite = DATABASE_URL.startsWith("file:");

/**
 * PostgreSQL connection pool configuration (ignored in PGlite mode).
 */
const poolConfig = {
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 30_000,
};

export function createPool(): Pool {
  return new Pool(poolConfig);
}

/**
 * Mutable pool handle. Null in PGlite mode; recreated by reopenDatabase().
 * Shared so the default client and relational clients observe the same pool.
 */
export let pool: Pool | null = isPglite ? null : createPool();

/**
 * Underlying PGlite instance — only set in PGlite mode.
 * Exposed so the headless-client migration runner can call exec() directly.
 */
export let pgliteClient: PGlite | null = isPglite
  ? new PGlite(DATABASE_URL)
  : null;

/**
 * Callbacks that rebuild derived drizzle clients (default + per-domain
 * relational clients) after the pool is recreated. Each derived client captures
 * the pool at construction time, so a pool swap would otherwise leave them
 * pointing at a closed pool. They register here and get rebuilt by recreatePool().
 */
const poolRebuildCallbacks = new Set<() => void>();

/**
 * Register a callback invoked whenever the pool is recreated (dev reset /
 * reconnect). Returns an unregister function. No-op-safe in PGlite mode — the
 * embedded client never swaps, so the callback simply never fires.
 */
export function onPoolRebuild(callback: () => void): () => void {
  poolRebuildCallbacks.add(callback);
  return () => poolRebuildCallbacks.delete(callback);
}

/**
 * Replace the live pool after a reset (e.g. `vibe dev -r`).
 * No-op in PGlite mode (embedded db doesn't need reconnection).
 * Rebuilds every registered derived client, then returns the new pool so the
 * caller can rebuild its own handle too.
 */
export function recreatePool(): Pool | null {
  if (isPglite) {
    return pool;
  }
  pool = createPool();
  for (const callback of poolRebuildCallbacks) {
    callback();
  }
  return pool;
}

// PGlite is API-compatible with NodePgDatabase at runtime (same pg-core query builders).
// The types diverge only in their HKT; this bridge function hides the cast in one place
// so callers see NodePgDatabase and get correct .returning()/.execute() overloads.
// eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- drizzle's schema generic is bound to Record<string, unknown>; this must match its constraint exactly.
export function pgliteAsNodePg<TSchema extends Record<string, unknown>>(
  client: PgliteDatabase<TSchema>,
): NodePgDatabase<TSchema> {
  // @ts-expect-error — PgliteDatabase and NodePgDatabase share identical pg-core APIs
  // at runtime; only their HKT type params differ. Cast is safe for this use.
  return client;
}
