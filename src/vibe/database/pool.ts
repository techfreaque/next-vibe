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
 *  - maxLifetimeSeconds recycles old sockets (proxied over WireGuard on HA S2)
 *    before they can go stale.
 *  - a NEW connection that fails with a transient network error
 *    (ECONNREFUSED while a link or proxy comes back, reset, unreachable, the
 *    server still starting) is retried a few times with backoff. Only the
 *    connect phase: no query has been sent yet, so a retry can never run a
 *    statement twice. pg-pool never caches a failed client, so once the
 *    network is back every new checkout connects fresh.
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
  /** Seconds before a pooled connection is recycled, 0 = never. */
  maxLifetimeSeconds?: number;
  /** Connect-phase retry for transient network errors. */
  connectRetry?: Partial<ConnectRetryOptions>;
}

// ─── Connect retry ───────────────────────────────────────────────────────────

export interface ConnectRetryOptions {
  /** Extra attempts after the first failure (0 = no retry). */
  retries: number;
  /** First backoff in ms; doubles per attempt up to maxDelayMs. */
  baseDelayMs: number;
  maxDelayMs: number;
  /** Injectable for tests. */
  sleep: (ms: number) => Promise<void>;
  /** 0..1, jitter source. Injectable for tests. */
  random: () => number;
  onRetry?: (error: Error, attempt: number, delayMs: number) => void;
}

export const CONNECT_RETRY_MAX_DELAY_MS = 2_000;

/**
 * Node socket errors that mean "the link or the server is (still) down", plus
 * the Postgres SQLSTATEs a server sends while starting / shutting down and
 * the connection-exception class (08xxx).
 */
const TRANSIENT_CONNECT_CODES: ReadonlySet<string> = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ECONNABORTED",
  "ETIMEDOUT",
  "EHOSTUNREACH",
  "EHOSTDOWN",
  "ENETUNREACH",
  "ENETDOWN",
  "EPIPE",
  "EAI_AGAIN",
  // Docker DNS answers NXDOMAIN while a target container is being recreated.
  "ENOTFOUND",
  "57P01", // admin_shutdown
  "57P02", // crash_shutdown
  "57P03", // cannot_connect_now (starting up / recovery)
  "08000",
  "08001",
  "08003",
  "08004",
  "08006",
]);

/**
 * True when a failed NEW connection is worth another try. Never true for the
 * pool's own "timeout exceeded when trying to connect": that already spent
 * the whole connectionTimeoutMillis budget (or waited for a busy pool slot).
 */
export function isTransientConnectError(error: Error): boolean {
  if ("code" in error && typeof error.code === "string") {
    if (TRANSIENT_CONNECT_CODES.has(error.code)) {
      return true;
    }
  }
  // pg: the server (or a TCP proxy in front of it, e.g. HAProxy whose backend
  // is down) closed the socket during the startup handshake.
  return error.message === "Connection terminated unexpectedly";
}

function connectRetryDelay(attempt: number, opts: ConnectRetryOptions): number {
  const exp = Math.min(opts.maxDelayMs, opts.baseDelayMs * 2 ** attempt);
  // Half fixed, half jitter: N pooled connects after an outage do not all
  // hit the recovering server in the same millisecond.
  return Math.round(exp / 2 + (exp / 2) * opts.random());
}

/**
 * Run a connect attempt, retrying transient network failures with bounded
 * exponential backoff. Non-transient errors (bad password, unknown database,
 * pool ended, slot wait timeout) fail immediately.
 */
export async function retryTransientConnect<T>(
  attemptConnect: () => Promise<T>,
  opts: ConnectRetryOptions,
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await attemptConnect();
    } catch (caught) {
      const error =
        caught instanceof Error ? caught : new Error(String(caught));
      if (attempt >= opts.retries || !isTransientConnectError(error)) {
        // eslint-disable-next-line restricted/restricted-syntax -- propagate the original pg error unchanged; callers (drizzle, pg-pool) expect a rejection
        throw error;
      }
      const delayMs = connectRetryDelay(attempt, opts);
      opts.onRetry?.(error, attempt + 1, delayMs);
      await opts.sleep(delayMs);
    }
  }
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function resolveConnectRetryOptions(
  overrides: Partial<ConnectRetryOptions> | undefined,
): ConnectRetryOptions {
  return {
    retries: overrides?.retries ?? databaseEnv.DATABASE_CONNECT_RETRIES,
    baseDelayMs:
      overrides?.baseDelayMs ?? databaseEnv.DATABASE_CONNECT_RETRY_DELAY_MS,
    maxDelayMs: overrides?.maxDelayMs ?? CONNECT_RETRY_MAX_DELAY_MS,
    sleep: overrides?.sleep ?? defaultSleep,
    random: overrides?.random ?? Math.random,
    onRetry: overrides?.onRetry,
  };
}

/** The callback overload of Pool.connect (Parameters picks the last overload). */
type PoolConnectCallback = Parameters<Pool["connect"]>[0];

/**
 * pg Pool whose connect() (also used internally by pool.query()) retries
 * transient connect failures. Drizzle calls pool.query() for plain queries and
 * pool.connect() for transactions, so both paths are covered.
 */
export class ResilientPool extends Pool {
  private readonly connectRetry: ConnectRetryOptions;

  constructor(config: PoolConfig, connectRetry: ConnectRetryOptions) {
    super(config);
    this.connectRetry = connectRetry;
  }

  override connect(): Promise<PoolClient>;
  override connect(callback: PoolConnectCallback): void;
  override connect(callback?: PoolConnectCallback): Promise<PoolClient> | void {
    const connected = retryTransientConnect(
      () => super.connect(),
      this.connectRetry,
    );
    if (!callback) {
      return connected;
    }
    connected.then(
      (client) => {
        callback(undefined, client, (release?: Error | boolean) => {
          client.release(release);
        });
        return undefined;
      },
      (error: Error) => {
        callback(error, undefined, () => undefined);
        return undefined;
      },
    );
  }
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
    maxLifetimeSeconds:
      opts.maxLifetimeSeconds ?? databaseEnv.DATABASE_MAX_LIFETIME_S,
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
  return guardStandardPool(
    new ResilientPool(
      buildStandardPoolConfig(opts),
      resolveConnectRetryOptions(opts.connectRetry),
    ),
  );
}
