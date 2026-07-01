import "server-only";

import { PGlite } from "@electric-sql/pglite";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  drizzle as drizzlePglite,
  type PgliteDatabase,
} from "drizzle-orm/pglite";
import * as vibeSenseSchema from "next-vibe/core/utils/dataflow/db";
import { parseError } from "next-vibe/core/utils/parse-error";
import * as leadsSchema from "next-vibe/identity/lead/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import * as cronTasksSchema from "next-vibe/tasks/cron/db";
import { Pool } from "pg";

import * as agentChatSchema from "@/app/api/[locale]/agent/chat/db";
import * as chartOfAccountsSchema from "@/app/api/[locale]/chart-of-accounts/db";
import * as companiesSchema from "@/app/api/[locale]/companies/db";
import * as creditSchema from "@/app/api/[locale]/credits/db";
import * as inventorySchema from "@/app/api/[locale]/inventory/db";
import * as paymentSchema from "@/app/api/[locale]/payment/db";
import * as posSchema from "@/app/api/[locale]/pos/db";
import * as catalogProductsSchema from "@/app/api/[locale]/products/db";
import * as purchasingSchema from "@/app/api/[locale]/purchasing/db";
import * as referralSchema from "@/app/api/[locale]/referral/db";
import * as remoteConnectionSchema from "@/app/api/[locale]/remote-connection/db";
import * as sshSchema from "@/app/api/[locale]/ssh/db";
import * as taxSchema from "@/app/api/[locale]/tax/db";
import * as userSchema from "@/app/api/[locale]/user/db";
import { env } from "@/config/env";

/**
 * Database URL — resolved at module load time before the env singleton is ready.
 * If the URL starts with "file:" it selects the PGlite embedded driver;
 * everything else uses the standard pg connection pool.
 */
const DATABASE_URL = process.env["DATABASE_URL"] ?? env.DATABASE_URL;

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

const schema = {
  ...userSchema,
  ...remoteConnectionSchema,
  ...agentChatSchema,
  ...chartOfAccountsSchema,
  ...companiesSchema,
  ...creditSchema,
  ...paymentSchema,
  ...cronTasksSchema,
  ...leadsSchema,
  ...referralSchema,
  ...sshSchema,
  ...taxSchema,
  ...catalogProductsSchema,
  ...posSchema,
  ...inventorySchema,
  ...purchasingSchema,
  ...vibeSenseSchema,
};

function createPool(): Pool {
  return new Pool(poolConfig);
}

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

let pool: Pool | null = isPglite ? null : createPool();

// PGlite is API-compatible with NodePgDatabase at runtime (same pg-core query builders).
// The types diverge only in their HKT; this bridge function hides the cast in one place
// so callers see NodePgDatabase and get correct .returning()/.execute() overloads.
function pgliteAsNodePg(
  client: PgliteDatabase<typeof schema>,
): NodePgDatabase<typeof schema> {
  // @ts-expect-error — PgliteDatabase and NodePgDatabase share identical pg-core APIs
  // at runtime; only their HKT type params differ. Cast is safe for this use.
  return client;
}

/**
 * Underlying PGlite instance — only set in PGlite mode.
 * Exposed so the headless-client migration runner can call exec() directly.
 */
export let pgliteClient: PGlite | null = null;

/**
 * Drizzle ORM database client with schema registration.
 * PGlite mode: embedded in-process Postgres stored at the file: path.
 * Standard mode: pg connection pool.
 */
export let db: NodePgDatabase<typeof schema> = (() => {
  if (isPglite) {
    pgliteClient = new PGlite(DATABASE_URL);
    return pgliteAsNodePg(drizzlePglite(pgliteClient, { schema }));
  }
  return drizzle(pool as Pool, { schema });
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
  : (pool as Pool); // pool is non-null here: isPglite=false branch initialises pool above

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
  pool = createPool();
  db = drizzle(pool, { schema });
  rawPool = pool;
  databaseClosed = false;
}
