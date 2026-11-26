import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Pool, PoolClient } from "pg";

import { pgDiagnosticQueryLogger } from "../../database/pg-result-diagnostics";
import { describePgPoolCheckouts } from "../../database/pool";

export const GUEST_LEAD_DB_BUDGET_MS = 1500;

type LeadDatabasePhase =
  | "pool-unavailable"
  | "before-checkout"
  | "checkout"
  | "lookup"
  | "begin"
  | "provision"
  | LeadProvisionStep
  | "commit";

export type LeadProvisionStep =
  | "find-reusable-guest"
  | "insert-guest"
  | "link-guest-pool";

interface LeadCheckout {
  deadline: number;
  resolve: (client: PoolClient | undefined) => void;
  reject: (error: Error) => void;
}

interface LeadCheckoutQueue {
  pending: boolean;
  waiters: Set<LeadCheckout>;
}

declare global {
  var __vibeLeadCheckoutQueues: WeakMap<Pool, LeadCheckoutQueue> | undefined;
}

function takeLiveCheckout(queue: LeadCheckoutQueue): LeadCheckout | undefined {
  const now = performance.now();
  for (const waiter of queue.waiters) {
    queue.waiters.delete(waiter);
    if (waiter.deadline > now) {
      return waiter;
    }
    waiter.resolve(undefined);
  }
  return undefined;
}

function dispatchLeadCheckout(pool: Pool, queue: LeadCheckoutQueue): void {
  if (queue.pending || queue.waiters.size === 0) {
    return;
  }
  queue.pending = true;
  void pool
    .connect()
    .then(
      (client) => {
        const waiter = takeLiveCheckout(queue);
        if (waiter) {
          waiter.resolve(client);
        } else {
          client.release();
        }
        return undefined;
      },
      (error: Error) => takeLiveCheckout(queue)?.reject(error),
    )
    .finally(() => {
      queue.pending = false;
      dispatchLeadCheckout(pool, queue);
    });
}

// pg-pool keeps a queued checkout until it acquires a socket or its own,
// longer connect timeout expires. Keep the other guest waiters here so their
// deadlines can remove them. Hand the acquired socket to the oldest live
// waiter so a late checkout can still serve a request with time left.
function checkoutLeadClient(
  pool: Pool,
  deadline: number,
  signal: AbortSignal,
): Promise<PoolClient | undefined> {
  const queues = (globalThis.__vibeLeadCheckoutQueues ??= new WeakMap());
  const queue = queues.get(pool) ?? {
    pending: false,
    waiters: new Set<LeadCheckout>(),
  };
  queues.set(pool, queue);
  const result = Promise.withResolvers<PoolClient | undefined>();
  const waiter: LeadCheckout = {
    deadline,
    resolve: result.resolve,
    reject: result.reject,
  };
  const cancel = (): void => {
    queue.waiters.delete(waiter);
    result.resolve(undefined);
  };
  queue.waiters.add(waiter);
  signal.addEventListener("abort", cancel, { once: true });
  dispatchLeadCheckout(pool, queue);
  return result.promise.finally(() =>
    signal.removeEventListener("abort", cancel),
  );
}

export class GuestLeadDatabaseDeadlineError extends Error {
  readonly poolTotal: number | undefined;
  readonly poolIdle: number | undefined;
  readonly poolWaiting: number | undefined;
  readonly leadCheckoutWaiting: number | undefined;
  readonly oldestPoolCheckouts: ReturnType<typeof describePgPoolCheckouts>;

  constructor(
    readonly phase: LeadDatabasePhase,
    pool: Pool | null,
  ) {
    super("Guest lead database deadline exceeded");
    this.poolTotal = pool?.totalCount;
    this.poolIdle = pool?.idleCount;
    this.poolWaiting = pool?.waitingCount;
    this.leadCheckoutWaiting = pool
      ? globalThis.__vibeLeadCheckoutQueues?.get(pool)?.waiters.size
      : undefined;
    this.oldestPoolCheckouts = pool ? describePgPoolCheckouts(pool) : undefined;
  }
}

/** An expired checkout never starts work. An outstanding query on an already
 * acquired client is interrupted by destroying the client at the deadline. */
async function withBoundedCheckout<T>(
  pool: Pool | null,
  deadlineMs: number,
  work: (
    client: PoolClient,
    setPhase: (phase: LeadDatabasePhase) => void,
    deadline: number,
  ) => Promise<T>,
): Promise<T> {
  const now = performance.now();
  const deadline = Math.min(deadlineMs, now + GUEST_LEAD_DB_BUDGET_MS);
  if (!pool || !Number.isFinite(deadline) || deadline <= now) {
    return Promise.reject(
      new GuestLeadDatabaseDeadlineError(
        pool ? "before-checkout" : "pool-unavailable",
        pool,
      ),
    );
  }

  let acquired: PoolClient | undefined;
  let expired = false;
  let phase: LeadDatabasePhase = "checkout";
  const setPhase = (next: LeadDatabasePhase): void => {
    phase = next;
  };
  const timeout = Promise.withResolvers<never>();
  const checkout = new AbortController();
  const timer = setTimeout(() => {
    expired = true;
    const failure = new GuestLeadDatabaseDeadlineError(phase, pool);
    checkout.abort();
    const client = acquired;
    acquired = undefined;
    client?.release(true);
    timeout.reject(failure);
  }, deadline - now);

  const run = async (): Promise<T> => {
    const client = await checkoutLeadClient(pool, deadline, checkout.signal);
    if (!client || expired || performance.now() >= deadline) {
      const failure = new GuestLeadDatabaseDeadlineError(phase, pool);
      client?.release();
      return Promise.reject(failure);
    }
    acquired = client;
    let reusable = false;
    try {
      const result = await work(client, setPhase, deadline);
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
  return withBoundedCheckout(pool, deadlineMs, (client, setPhase) => {
    setPhase("lookup");
    return lookup(drizzle(client, { logger: pgDiagnosticQueryLogger }));
  });
}

/** Provisioning commits the insert and its guest links together. Discarding
 * the socket causes Postgres to roll uncommitted writes back. */
export function withLeadDatabaseDeadline<T>(
  pool: Pool | null,
  deadlineMs: number,
  work: (
    db: NodePgDatabase<Record<string, never>>,
    setStep: (step: LeadProvisionStep) => void,
  ) => Promise<T>,
): Promise<T> {
  return withBoundedCheckout(
    pool,
    deadlineMs,
    async (client, setPhase, deadline) => {
      // Leave time for a specific server error to reach us before the client
      // deadline. Only integers enter SQL. The idle limit also cleans up an
      // open transaction if the server cannot see the client disconnect.
      const remainingMs = Math.max(1, Math.floor(deadline - performance.now()));
      const statementMs = Math.max(1, remainingMs - 50);
      const lockMs = Math.max(1, statementMs - 50);
      setPhase("begin");
      await client.query(
        `BEGIN; SET LOCAL statement_timeout = ${statementMs}; SET LOCAL lock_timeout = ${lockMs}; SET LOCAL idle_in_transaction_session_timeout = ${remainingMs}`,
      );
      setPhase("provision");
      const result = await work(
        drizzle(client, { logger: pgDiagnosticQueryLogger }),
        setPhase,
      );
      if (performance.now() >= deadline) {
        return Promise.reject(
          new GuestLeadDatabaseDeadlineError("provision", pool),
        );
      }
      setPhase("commit");
      await client.query("COMMIT");
      return result;
    },
  );
}
