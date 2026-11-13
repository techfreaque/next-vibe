import "server-only";

import { Pool, type PoolClient, type PoolConfig, type Query } from "pg";

import { databaseEnv } from "./env";

/**
 * Real-Postgres pool factory (never PGlite). Side-effect free, so tests can
 * build pools against any server without triggering client.ts's PGlite
 * ownership race.
 *
 * Self-healing limits: a black-holed link (e.g. a WireGuard MTU drop between
 * HA nodes) must never wedge the pool.
 *  - keepAlive detects dead idle sockets.
 *  - connectionTimeoutMillis bounds both TCP connects and waits for a free slot.
 *  - statement_timeout (server) cancels slow queries with a clear error while
 *    keeping the connection healthy.
 *  - query_timeout (client) is the backstop when the server's answer never
 *    arrives; the stuck connection is destroyed, never reused.
 *  - idle_in_transaction_session_timeout frees locks held by vanished clients.
 * Long jobs (admin SQL, backfills) opt out via the long-running pool
 * (`getLongRunningDb()` in ./index).
 */

/** Margin the client read timeout keeps above the server statement timeout. */
export const QUERY_TIMEOUT_MARGIN_MS = 5_000;

/** Small on purpose: long jobs must never starve the request pool. */
export const LONG_RUNNING_POOL_MAX = 3;

export interface StandardPoolOptions {
  connectionString: string;
  max: number;
  /** Server statement_timeout in ms, 0 = off. */
  statementTimeoutMs: number;
  /** Client read timeout in ms, 0 = off. Defaults to DATABASE_QUERY_TIMEOUT_MS. */
  queryTimeoutMs?: number;
  connectionTimeoutMs?: number;
  idleInTransactionTimeoutMs?: number;
}

function clientQueryTimeout(
  configured: number,
  statementTimeoutMs: number,
): number | undefined {
  if (configured === 0) {
    return undefined;
  }
  if (statementTimeoutMs === 0) {
    return configured;
  }
  return Math.max(configured, statementTimeoutMs + QUERY_TIMEOUT_MARGIN_MS);
}

export function buildStandardPoolConfig(opts: StandardPoolOptions): PoolConfig {
  const idleInTx =
    opts.idleInTransactionTimeoutMs ??
    databaseEnv.DATABASE_IDLE_IN_TRANSACTION_TIMEOUT_MS;
  return {
    connectionString: opts.connectionString,
    // `timestamp` columns hold UTC wall-clock (Drizzle writes Dates as UTC), so
    // `DEFAULT now()` must run in UTC too — a host-local server zone skews
    // default-stamped rows (user messages) by the zone offset.
    options: "-c timezone=UTC",
    max: opts.max,
    idleTimeoutMillis: databaseEnv.DATABASE_IDLE_TIMEOUT_MS,
    connectionTimeoutMillis:
      opts.connectionTimeoutMs ?? databaseEnv.DATABASE_CONNECT_TIMEOUT_MS,
    keepAlive: true,
    keepAliveInitialDelayMillis: databaseEnv.DATABASE_KEEPALIVE_DELAY_MS,
    // 0 = off: pg skips falsy startup params, so the server default applies.
    statement_timeout: opts.statementTimeoutMs,
    query_timeout: clientQueryTimeout(
      opts.queryTimeoutMs ?? databaseEnv.DATABASE_QUERY_TIMEOUT_MS,
      opts.statementTimeoutMs,
    ),
    idle_in_transaction_session_timeout: idleInTx === 0 ? undefined : idleInTx,
  };
}

/**
 * pg exposes no public "query still in flight" flag. A client released while
 * a query is still on the wire hit the client read timeout (the server never
 * answered): its socket is wedged and every later query would queue behind
 * the hung one.
 */
function hasInFlightQuery(client: PoolClient): boolean {
  if (!("_getActiveQuery" in client)) {
    return false;
  }
  const getActiveQuery = client._getActiveQuery;
  if (typeof getActiveQuery !== "function") {
    return false;
  }
  const active: Query | null | undefined = getActiveQuery.call(client);
  return active !== null && active !== undefined;
}

/**
 * An idle pooled client whose backend dies (database restart, network drop)
 * emits 'error' on the pool; with no listener Node treats it as an uncaught
 * exception and takes the whole server down. The pool already discards the
 * dead client, so swallowing is the correct handling.
 */
export function guardPool(p: Pool): Pool {
  p.on("error", () => undefined);
  return p;
}

/**
 * Real-Postgres pools additionally:
 * - give every client a permanent no-op 'error' listener: a checked-out client
 *   has no pool listener, so a socket death mid-checkout would otherwise crash
 *   the process (the dead client is not queryable, so the pool drops it on
 *   release);
 * - end clients released with a hung query (client read timeout inside a
 *   transaction, where drizzle releases without an error) before the pool
 *   decides: `end()` marks them ending synchronously, so the pool removes them
 *   instead of handing the wedged socket to the next caller.
 */
function guardStandardPool(p: Pool): Pool {
  guardPool(p);
  p.on("connect", (client) => {
    client.on("error", () => undefined);
  });
  p.on("release", (err, client) => {
    if (!err && hasInFlightQuery(client)) {
      // Callback form: end() never rejects into an unhandled promise here.
      client.end(() => undefined);
    }
  });
  return p;
}

export function createStandardPool(opts: StandardPoolOptions): Pool {
  return guardStandardPool(new Pool(buildStandardPoolConfig(opts)));
}
