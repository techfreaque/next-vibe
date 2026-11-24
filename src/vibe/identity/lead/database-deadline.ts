import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Pool, PoolClient } from "pg";

import { pgDiagnosticQueryLogger } from "../../database/pg-result-diagnostics";

export const GUEST_LEAD_DB_BUDGET_MS = 1500;

function deadlineError(): Error {
  return new Error("Guest lead database deadline exceeded");
}

/** An expired checkout never starts work. An outstanding query on an already
 * acquired client is interrupted by destroying the client at the deadline. */
async function withBoundedCheckout<T>(
  pool: Pool | null,
  deadlineMs: number,
  work: (client: PoolClient, deadline: number) => Promise<T>,
): Promise<T> {
  const now = performance.now();
  const deadline = Math.min(deadlineMs, now + GUEST_LEAD_DB_BUDGET_MS);
  if (!pool || !Number.isFinite(deadline) || deadline <= now) {
    return Promise.reject(deadlineError());
  }

  let acquired: PoolClient | undefined;
  let expired = false;
  const timeout = Promise.withResolvers<never>();
  const timer = setTimeout(() => {
    expired = true;
    const client = acquired;
    acquired = undefined;
    client?.release(true);
    timeout.reject(deadlineError());
  }, deadline - now);

  const run = async (): Promise<T> => {
    const client = await pool.connect();
    if (expired || performance.now() >= deadline) {
      client.release();
      return Promise.reject(deadlineError());
    }
    acquired = client;
    let reusable = false;
    try {
      const result = await work(client, deadline);
      reusable = true;
      return result;
    } finally {
      if (acquired === client) {
        acquired = undefined;
        client.release(!reusable);
      }
    }
  };

  try {
    return await Promise.race([run(), timeout.promise]);
  } finally {
    clearTimeout(timer);
  }
}

/** One SELECT on the ordinary pool. It keeps the pool's statement ceiling and
 * requires no BEGIN/COMMIT round trips or transaction-local settings. */
export function withLeadLookupDeadline<T>(
  pool: Pool | null,
  deadlineMs: number,
  lookup: (
    db: Pick<NodePgDatabase<Record<string, never>>, "select">,
  ) => Promise<T>,
): Promise<T> {
  return withBoundedCheckout(pool, deadlineMs, (client) =>
    lookup(drizzle(client, { logger: pgDiagnosticQueryLogger })),
  );
}

/** Provisioning commits the insert and its guest links together. Discarding
 * the socket causes Postgres to roll uncommitted writes back. */
export function withLeadDatabaseDeadline<T>(
  pool: Pool | null,
  deadlineMs: number,
  work: (db: NodePgDatabase<Record<string, never>>) => Promise<T>,
): Promise<T> {
  return withBoundedCheckout(pool, deadlineMs, async (client, deadline) => {
    // Leave time for a specific server error to reach us before the client
    // deadline. Only integers enter SQL. The idle limit also cleans up an
    // open transaction if the server cannot see the client disconnect.
    const remainingMs = Math.max(1, Math.floor(deadline - performance.now()));
    const statementMs = Math.max(1, remainingMs - 50);
    const lockMs = Math.max(1, statementMs - 50);
    await client.query(
      `BEGIN; SET LOCAL statement_timeout = ${statementMs}; SET LOCAL lock_timeout = ${lockMs}; SET LOCAL idle_in_transaction_session_timeout = ${remainingMs}`,
    );
    const result = await work(
      drizzle(client, { logger: pgDiagnosticQueryLogger }),
    );
    if (performance.now() >= deadline) {
      return Promise.reject(deadlineError());
    }
    await client.query("COMMIT");
    return result;
  });
}
