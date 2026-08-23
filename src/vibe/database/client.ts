import "server-only";

import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readdirSync,
  rmSync,
  unlinkSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { PGlite } from "@electric-sql/pglite";
import { type NodePgDatabase } from "drizzle-orm/node-postgres";
import { type PgliteDatabase } from "drizzle-orm/pglite";
import { Pool } from "pg";

import { databaseEnv } from "./env";

/**
 * Shared database connection primitives.
 *
 * ## Multi-process PGlite (socket proxy)
 *
 * PGlite's WASM Postgres can only be opened by ONE process at a time. To let
 * N parallel processes share the same PGlite database we use a Unix-socket proxy:
 *
 *   - The FIRST process to initialise in PGlite mode wins a file lock, opens
 *     PGlite, and starts a Postgres wire-protocol server on a Unix socket.
 *   - Every SUBSEQUENT process detects the socket, skips the WASM open, and
 *     connects via a normal `pg.Pool` to the socket.
 *   - `pgliteClient` is non-null ONLY in the owning process.
 *   - `pool` is always a `pg.Pool` in PGlite mode (socket pool).
 *   - `isPglite` stays true so feature-flag compat helpers still work.
 */

const DATABASE_URL = process.env["DATABASE_URL"] ?? databaseEnv.DATABASE_URL;

export const isPglite = DATABASE_URL.startsWith("file:");

// ─── Path helpers ─────────────────────────────────────────────────────────────

function resolvePgliteUrl(url: string): string {
  let osPath: string;
  if (url.startsWith("file://")) {
    osPath = fileURLToPath(url);
  } else {
    osPath = url.replace(/^file:/, "");
  }
  return pathToFileURL(resolve(osPath)).href;
}

/**
 * Return the Unix socket DIRECTORY for PGlite.
 * pg.Pool uses `host` as a directory and connects to `host/.s.PGSQL.5432`.
 * We create a directory alongside the data dir and let pg follow that convention.
 */
function getPgliteSocketDir(dbUrl: string): string {
  let osPath: string;
  if (dbUrl.startsWith("file://")) {
    osPath = fileURLToPath(dbUrl);
  } else {
    osPath = dbUrl.replace(/^file:/, "");
  }
  return `${resolve(osPath)}.pg`;
}

/** Full socket file path (what net.Server listens on). */
function getPgliteSocketPath(dbUrl: string): string {
  return join(getPgliteSocketDir(dbUrl), ".s.PGSQL.5432");
}

/** Path to the exclusive-create lock file that elects the PGlite owner. */
function getPgliteLockPath(dbUrl: string): string {
  return `${getPgliteSocketDir(dbUrl)}.lock`;
}

function removeStalePgliteLock(resolvedUrl: string): void {
  try {
    const dbPath = fileURLToPath(resolvedUrl);
    const lockPath = join(dbPath, "postmaster.pid");
    if (existsSync(lockPath)) {
      unlinkSync(lockPath);
    }
  } catch {
    // Non-fatal.
  }
}

// ─── Pool factory ─────────────────────────────────────────────────────────────

const STANDARD_POOL_CONFIG = {
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 30_000,
};

export function createPool(): Pool {
  return new Pool(STANDARD_POOL_CONFIG);
}

function createSocketPool(socketDir: string): Pool {
  // pg treats `host` as a directory and connects to `host/.s.PGSQL.5432`.
  return new Pool({
    host: socketDir,
    database: "postgres",
    user: "postgres",
    password: "postgres",
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 30_000,
  });
}

// ─── Module singletons ────────────────────────────────────────────────────────

const PGLITE_GLOBAL_KEY = "__vibe_pglite_client__";
const g = globalThis as typeof globalThis & Record<string, PGlite | undefined>;

/** Non-null only in the process that owns the PGlite WASM instance. */
export let pgliteClient: PGlite | null = null;

/**
 * Always non-null after module init.
 * Standard mode: pool → DATABASE_URL postgres.
 * PGlite mode: pool → Unix socket served by pglite-server.ts.
 */
export let pool: Pool | null = isPglite ? null : createPool();

// ─── PGlite socket-server initialisation ─────────────────────────────────────

if (isPglite) {
  const resolvedUrl = resolvePgliteUrl(DATABASE_URL);
  const socketDir = getPgliteSocketDir(DATABASE_URL);
  const socketPath = getPgliteSocketPath(DATABASE_URL); // socketDir/.s.PGSQL.5432
  const lockPath = getPgliteLockPath(DATABASE_URL);

  // Ensure the socket directory exists (both owner and clients need it).
  mkdirSync(socketDir, { recursive: true });

  if (g[PGLITE_GLOBAL_KEY]) {
    // HMR re-evaluation in the same process: we already own PGlite.
    // Restore the module-level ref without opening a second WASM instance.
    pgliteClient = g[PGLITE_GLOBAL_KEY] as PGlite;
  } else {
    // Try to become the exclusive owner via O_EXCL file creation.
    let isOwner = false;
    try {
      const fd = openSync(lockPath, "wx"); // fails if file exists
      closeSync(fd);
      isOwner = true;
    } catch {
      // Another process holds the lock — we are a client.
    }

    if (isOwner || !existsSync(socketPath)) {
      // We are (or should be) the owner. Clean up stale state and open PGlite.
      removeStalePgliteLock(resolvedUrl);
      try {
        unlinkSync(socketPath);
      } catch {
        /* stale socket */
      }

      const fresh = new PGlite(resolvedUrl);
      g[PGLITE_GLOBAL_KEY] = fresh;
      pgliteClient = fresh;

      // Start the wire-protocol proxy server asynchronously.
      // Queries queue until the server is up (pg.Pool retries connections).
      void import("./pglite-server").then(({ startPgliteServer }) => {
        startPgliteServer(fresh, { socketPath });
        // Remove lock file once server is listening so child processes can
        // detect owner restart without being stuck on an orphaned lock.
        try {
          unlinkSync(lockPath);
        } catch {
          /* already removed */
        }
        return undefined;
      });
    }
    // else: socket already exists, another process is the owner — pool connects to it.
  }

  // All processes (owner and clients) use a socket pool so db/relational stay uniform.
  // pg treats `socketDir` as the socket directory and connects to `.s.PGSQL.5432` inside it.
  pool = createSocketPool(socketDir);
}

// ─── No-op shims ──────────────────────────────────────────────────────────────

/** No-op kept for call-site compatibility. */
export function openPglite(): void {
  // intentional no-op
}

/**
 * Serialise any direct PGlite access (migrations, db-functions, etc.) through
 * the same global FIFO queue used by the socket server.  Prevents concurrent
 * WASM access across connection callbacks (Aborted() crashes).
 * No-op passthrough in non-PGlite mode.
 */
export async function serialisePgliteAccess<T>(
  fn: () => Promise<T>,
): Promise<T> {
  if (!isPglite) {
    return fn();
  }
  const { serialisePglite } = await import("./pglite-server");
  return serialisePglite(fn);
}

// ─── PGlite lifecycle (used by db-setup) ─────────────────────────────────────

export async function reinitPgliteClient(): Promise<void> {
  if (!isPglite) {
    return;
  }
  const resolvedUrl = resolvePgliteUrl(DATABASE_URL);
  const socketPath = getPgliteSocketPath(DATABASE_URL);

  const fresh = new PGlite(resolvedUrl);
  await fresh.waitReady;
  pgliteClient = fresh;
  g[PGLITE_GLOBAL_KEY] = fresh;

  const { startPgliteServer } = await import("./pglite-server");
  startPgliteServer(fresh, { socketPath });

  for (const cb of pgliteRebuildCallbacks) {
    cb(fresh);
  }
}

export async function reopenPgliteAfterMigrations(): Promise<void> {
  if (!isPglite || !pgliteClient) {
    return;
  }
  // In socket-proxy mode: all DB access goes through the Unix socket pool —
  // there is no need to close+reopen the WASM instance. Doing so would allocate
  // a second heap in the same process and hang. Just checkpoint so the
  // post-migration state is durable, then let the socket pool continue.
  try {
    await pgliteClient.exec("CHECKPOINT");
  } catch {
    try {
      await pgliteClient.syncToFs();
    } catch {
      /* best effort */
    }
  }
  for (const cb of pgliteRebuildCallbacks) {
    cb(pgliteClient);
  }
}

export function getLivePgliteClient(): PGlite | null {
  if (!isPglite) {
    return null;
  }
  return (g[PGLITE_GLOBAL_KEY] as PGlite | undefined) ?? pgliteClient;
}

// ─── Rebuild callbacks ────────────────────────────────────────────────────────

const pgliteRebuildCallbacks = new Set<(client: PGlite) => void>();

export function onPgliteReopen(callback: (client: PGlite) => void): () => void {
  pgliteRebuildCallbacks.add(callback);
  return () => pgliteRebuildCallbacks.delete(callback);
}

const poolRebuildCallbacks = new Set<() => void>();

export function onPoolRebuild(callback: () => void): () => void {
  poolRebuildCallbacks.add(callback);
  return () => poolRebuildCallbacks.delete(callback);
}

export function recreatePool(): Pool | null {
  if (isPglite) {
    return pool;
  }
  pool = createPool();
  for (const cb of poolRebuildCallbacks) {
    cb();
  }
  return pool;
}

// ─── PGlite heal ─────────────────────────────────────────────────────────────

function wipePgliteHeap(dbPath: string): void {
  for (const entry of readdirSync(dbPath)) {
    try {
      rmSync(join(dbPath, entry), { recursive: true, force: true });
    } catch {
      /* best effort */
    }
  }
  mkdirSync(join(dbPath, "pg_wal"), { recursive: true });
}

export async function healPgliteIfCorrupted(): Promise<void> {
  if (!isPglite || !pgliteClient) {
    return;
  }
  try {
    await pgliteClient.query("SELECT 1");
  } catch (probeError) {
    const msg =
      probeError instanceof Error ? probeError.message : String(probeError);
    if (!msg.includes("Aborted")) {
      // eslint-disable-next-line restricted/restricted-syntax -- non-Aborted errors propagate normally
      throw probeError;
    }
    const resolvedUrl = resolvePgliteUrl(DATABASE_URL);
    const socketPath = getPgliteSocketPath(DATABASE_URL);
    const dbPath = fileURLToPath(resolvedUrl);
    wipePgliteHeap(dbPath);
    const fresh = new PGlite(resolvedUrl);
    await fresh.waitReady;
    pgliteClient = fresh;
    g[PGLITE_GLOBAL_KEY] = fresh;
    const { startPgliteServer } = await import("./pglite-server");
    startPgliteServer(fresh, { socketPath });
    for (const cb of pgliteRebuildCallbacks) {
      cb(fresh);
    }
  }
}

// ─── Type bridge (used by pglite-server.ts) ──────────────────────────────────

// PGlite is API-compatible with NodePgDatabase at runtime.
// eslint-disable-next-line restricted/no-unknown -- drizzle's schema generic is bound to Record<string, unknown>; this must match its constraint exactly.
export function pgliteAsNodePg<TSchema extends Record<string, unknown>>(
  client: PgliteDatabase<TSchema>,
): NodePgDatabase<TSchema> {
  // @ts-expect-error — PgliteDatabase and NodePgDatabase share identical pg-core APIs
  // at runtime; only their HKT type params differ. Cast is safe for this use.
  return client;
}

// ─── INSERT…RETURNING fix ─────────────────────────────────────────────────────
// Kept for use in pglite-server.ts. Not used directly from index.ts any more.

const pgliteQueryFixCache = new WeakMap<PGlite, PGlite>();

function countInsertRows(sql: string): number {
  const valuesIdx = sql.search(/\bvalues\s*\(/i);
  if (valuesIdx === -1) {
    return 1;
  }
  const valuesPart = sql.slice(valuesIdx);
  let depth = 0;
  let count = 0;
  for (const ch of valuesPart) {
    if (ch === "(") {
      depth++;
      if (depth === 1) {
        count++;
      }
    } else if (ch === ")") {
      depth--;
    }
  }
  return Math.max(count, 1);
}

export function wrapPgliteQueryFix(raw: PGlite): PGlite {
  const cached = pgliteQueryFixCache.get(raw);
  if (cached) {
    return cached;
  }
  type PgliteRow = Record<string, string | number | boolean | null>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- PGlite query options type uses any internally
  // oxlint-disable-next-line no-explicit-any
  type QueryOptions = Record<string, any>;
  const wrapped = new Proxy(raw, {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Proxy get trap return type is too complex to express statically
    get(target, prop) {
      if (prop !== "query") {
        const val = Reflect.get(target, prop) as
          | string
          | ((...a: string[]) => void);
        return typeof val === "function" ? val.bind(target) : val;
      }
      const queryFn = async (
        sql: string,
        params?: (string | number | boolean | null)[],
        options?: QueryOptions,
      ): ReturnType<PGlite["query"]> => {
        const isArrayMode = options?.["rowMode"] === "array";
        if (/^\s*insert\s+into\s/i.test(sql) && /\sreturning\s/i.test(sql)) {
          const tableMatch = /^\s*insert\s+into\s+"?([^"\s(]+)"?/i.exec(sql);
          const tableName = tableMatch?.[1];
          const sqlWithoutReturning = sql.replace(
            /\s+returning\s+[\s\S]+$/i,
            "",
          );
          await target.query(sqlWithoutReturning, params, {
            rowMode: "object",
          });
          if (tableName) {
            const rowCount = countInsertRows(sql);
            const selectSql = `SELECT * FROM "${tableName}" ORDER BY ctid DESC LIMIT ${rowCount}`;
            const selectResult = await target.query<PgliteRow>(selectSql, [], {
              rowMode: "object",
            });
            const orderedRows = selectResult.rows.toReversed();
            if (isArrayMode) {
              return {
                ...selectResult,
                rows: orderedRows.map((row) => Object.values(row)),
              } as Awaited<ReturnType<PGlite["query"]>>;
            }
            return { ...selectResult, rows: orderedRows } as Awaited<
              ReturnType<PGlite["query"]>
            >;
          }
          return { rows: [], fields: [] } as Awaited<
            ReturnType<PGlite["query"]>
          >;
        }
        if (!isArrayMode) {
          return target.query(sql, params, options);
        }
        const objectResult = await target.query<PgliteRow>(sql, params, {
          ...options,
          rowMode: "object",
        });
        return {
          ...objectResult,
          rows: objectResult.rows.map((row) => Object.values(row)),
        } as Awaited<ReturnType<PGlite["query"]>>;
      };
      return queryFn;
    },
  });
  pgliteQueryFixCache.set(raw, wrapped);
  return wrapped;
}
