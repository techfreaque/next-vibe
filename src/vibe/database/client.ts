import "server-only";

import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  unlinkSync,
} from "node:fs";
import { join, resolve as resolvePath } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { PGlite } from "@electric-sql/pglite";
import { type NodePgDatabase } from "drizzle-orm/node-postgres";
import { type PgliteDatabase } from "drizzle-orm/pglite";
import { Pool } from "pg";

import { parseError } from "../core/utils/parse-error";
import { databaseEnv } from "./env";

/**
 * Shared database connection primitives.
 *
 * ## Multi-process PGlite (TCP loopback proxy)
 *
 * PGlite's WASM Postgres engine can only be opened by ONE OS process at a
 * time — that is a hard PGlite constraint, not a design choice here. To let
 * N processes all read/write the same PGlite database concurrently anyway,
 * exactly one process hosts the WASM engine behind a Postgres wire-protocol
 * proxy on a TCP loopback port derived deterministically from the resolved
 * data-dir path (not a Unix domain socket — node-postgres only recognises a
 * `host` as a Unix socket directory when it starts with "/", which never
 * matches a Windows drive-letter path); every process, including the host
 * itself, talks to the DB through a normal `pg.Pool` against that port.
 *
 * Ownership is decided by racing to bind the port, not by a lock file:
 * binding a TCP port is atomically exclusive at the OS level (exactly one
 * process can ever win), and self-heals the instant the owner process exits
 * — the kernel frees the port immediately, so there is no stale state to
 * clean up and no PID bookkeeping. Any process, at any time, past or future,
 * that fails to bind the port simply becomes a pool client of whichever
 * process did. See `pglite-server.ts`'s `tryClaimPgliteOwnership`.
 *
 *   - `pgliteClient` is non-null ONLY in the process that won the bind.
 *   - `pool` is always a `pg.Pool` in PGlite mode (loopback pool), in every
 *     process — including the owner, so query behaviour stays uniform.
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
  return pathToFileURL(resolvePath(osPath)).href;
}

/**
 * Return the state DIRECTORY for PGlite. Created alongside the data dir;
 * currently unused for ownership (that's TCP-port-bind based, see above)
 * but kept for the port-hash namespace and heal/reset bookkeeping.
 */
function getPgliteSocketDir(dbUrl: string): string {
  let osPath: string;
  if (dbUrl.startsWith("file://")) {
    osPath = fileURLToPath(dbUrl);
  } else {
    osPath = dbUrl.replace(/^file:/, "");
  }
  return `${resolvePath(osPath)}.pg`;
}

/**
 * Deterministic TCP loopback port for the wire-protocol proxy, derived from
 * the resolved data-dir path so every process pointed at the same
 * DATABASE_URL agrees on it without a discovery round-trip.
 */
function getPglitePort(dbUrl: string): number {
  const path = getPgliteSocketDir(dbUrl);
  let hash = 0;
  for (let i = 0; i < path.length; i++) {
    hash = (Math.imul(hash, 31) + path.charCodeAt(i)) | 0;
  }
  return 40000 + (Math.abs(hash) % 10000);
}

/** Is this a PGlite WASM-heap corruption abort, as opposed to some other failure? */
function isPgliteCorruptionError(error: Error): boolean {
  return error.message.includes("Aborted");
}

/**
 * Open a PGlite instance, self-healing a corrupted WASM heap instead of
 * failing outright. A corrupted heap always throws "Aborted()" on open —
 * this codebase already treats that as recoverable in `healPgliteIfCorrupted`
 * (for corruption discovered after a successful open); this applies the same
 * recovery at initial-open time, wiping the heap and retrying once, so a
 * corrupted dev/CLI data directory heals itself rather than requiring a
 * manual `vibe dev -r`.
 */
async function openPgliteWithSelfHeal(dbPath: string): Promise<PGlite> {
  try {
    const client = new PGlite(dbPath);
    await client.waitReady;
    return client;
  } catch (error) {
    if (!isPgliteCorruptionError(parseError(error))) {
      // eslint-disable-next-line restricted/restricted-syntax -- not a recoverable corruption case, propagate
      throw error;
    }
    wipePgliteHeap(dbPath);
    const client = new PGlite(dbPath);
    await client.waitReady;
    return client;
  }
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

function createSocketPool(port: number): Pool {
  return new Pool({
    host: "127.0.0.1",
    port,
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

/**
 * Resolves once PGlite ownership for this process has been decided (owner or
 * client) and, if owner, once the WASM instance has finished loading.
 * Callers that touch `pgliteClient` synchronously right after import (e.g.
 * running migrations at server startup) MUST await this first — ownership is
 * decided by an async port-bind race, so `pgliteClient` is not guaranteed to
 * be set yet on the same tick the module finishes evaluating.
 * Resolves immediately in non-PGlite mode.
 *
 * A `const` holding a promise whose *resolution* we trigger later (via the
 * stored resolver) rather than an exported `let` we reassign — reassigning
 * an exported binding depends on the bundler correctly propagating ESM live
 * bindings to every importer, which is not something to lean on here.
 */
let resolvePgliteReady: () => void = () => undefined;
export const pgliteReady: Promise<void> = isPglite
  ? new Promise<void>((resolve) => {
      resolvePgliteReady = resolve;
    })
  : Promise.resolve();

// ─── PGlite socket-server initialisation ─────────────────────────────────────

if (isPglite) {
  const resolvedUrl = resolvePgliteUrl(DATABASE_URL);
  const socketDir = getPgliteSocketDir(DATABASE_URL);
  const port = getPglitePort(DATABASE_URL);

  // Ensure the state directory exists (heal/reset bookkeeping lives here).
  mkdirSync(socketDir, { recursive: true });

  if (g[PGLITE_GLOBAL_KEY]) {
    // HMR re-evaluation in the same process: we already own PGlite.
    // Restore the module-level ref without opening a second WASM instance.
    pgliteClient = g[PGLITE_GLOBAL_KEY] as PGlite;
    resolvePgliteReady();
  } else {
    // Race to bind the port. Whoever wins hosts PGlite; every other
    // process — present or started later — just becomes a pool client.
    // Async by nature (binding takes an event-loop tick) — `pgliteReady`
    // lets startup code (migrations, etc.) wait for the outcome instead of
    // racing it, while `pool` below is created immediately and connects
    // lazily so ordinary queries just wait the small amount of time this
    // takes to resolve.
    void import("./pglite-server")
      .then(async ({ tryClaimPgliteOwnership, servePgliteOn }) => {
        const claimed = await tryClaimPgliteOwnership(port);
        if (!claimed) {
          // Another process already owns this port — we are a client.
          return undefined;
        }
        removeStalePgliteLock(resolvedUrl);
        const dbPath = fileURLToPath(resolvedUrl);
        const fresh = await openPgliteWithSelfHeal(dbPath);
        g[PGLITE_GLOBAL_KEY] = fresh;
        pgliteClient = fresh;
        servePgliteOn(claimed, fresh);
        return undefined;
      })
      .finally(() => {
        resolvePgliteReady();
      });
  }

  // All processes (owner and clients) use a loopback pool so db/relational stay uniform.
  pool = createSocketPool(port);
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
  const port = getPglitePort(DATABASE_URL);

  const fresh = await openPgliteWithSelfHeal(fileURLToPath(resolvedUrl));
  pgliteClient = fresh;
  g[PGLITE_GLOBAL_KEY] = fresh;

  const { startPgliteServer } = await import("./pglite-server");
  startPgliteServer(fresh, { port });

  for (const cb of pgliteRebuildCallbacks) {
    cb(fresh);
  }
}

export async function reopenPgliteAfterMigrations(): Promise<void> {
  if (!isPglite || !pgliteClient) {
    return;
  }
  // In socket-proxy mode: all DB access goes through the loopback pool —
  // there is no need to close+reopen the WASM instance. Doing so would allocate
  // a second heap in the same process and hang. Just checkpoint so the
  // post-migration state is durable, then let the socket pool continue.
  // Serialised through the same FIFO queue the wire-protocol server uses —
  // an unserialised direct call here can race concurrent socket traffic
  // (e.g. seeding running over the pool) and deadlock PGlite's
  // single-threaded engine instead of erroring.
  try {
    await serialisePgliteAccess(() => pgliteClient!.exec("CHECKPOINT"));
  } catch {
    try {
      await serialisePgliteAccess(() => pgliteClient!.syncToFs());
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
    // Direct WASM access MUST go through the same FIFO queue the wire-protocol
    // server uses (see pglite-server.ts) — an unserialised call here can race
    // a concurrent query arriving over the socket and deadlock PGlite's
    // single-threaded engine instead of erroring, hanging every query on the
    // pool until connectionTimeoutMillis.
    await serialisePgliteAccess(() => pgliteClient!.query("SELECT 1"));
  } catch (probeError) {
    if (!isPgliteCorruptionError(parseError(probeError))) {
      // eslint-disable-next-line restricted/restricted-syntax -- non-corruption errors propagate normally
      throw probeError;
    }
    const resolvedUrl = resolvePgliteUrl(DATABASE_URL);
    const port = getPglitePort(DATABASE_URL);
    const dbPath = fileURLToPath(resolvedUrl);
    wipePgliteHeap(dbPath);
    const fresh = new PGlite(dbPath);
    await fresh.waitReady;
    pgliteClient = fresh;
    g[PGLITE_GLOBAL_KEY] = fresh;
    const { startPgliteServer } = await import("./pglite-server");
    startPgliteServer(fresh, { port });
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
