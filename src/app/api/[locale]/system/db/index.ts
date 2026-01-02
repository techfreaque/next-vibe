import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { parseError } from "next-vibe/shared/utils";
import { Pool } from "pg";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { env } from "@/config/env";

import * as agentChatSchema from "../../agent/chat/db";
import * as creditSchema from "../../credits/db";
import * as leadsSchema from "../../leads/db";
import * as referralSchema from "../../referral/db";
import * as userSchema from "../../user/db";

/**
 * Database connection pool configuration
 */
const poolConfig = {
  connectionString: env.DATABASE_URL,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30_000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2_000, // How long to wait for a connection to become available
};

/**
 * PostgreSQL connection pool
 */
const pool = new Pool(poolConfig);

/**
 * Drizzle ORM database client with schema registration
 */
export const db = drizzle(pool, {
  schema: {
    ...userSchema,
    ...agentChatSchema,
    ...creditSchema,
    ...leadsSchema,
    ...referralSchema,
  },
});

/**
 * Raw PostgreSQL pool for direct queries when needed
 */
export const rawPool = pool;

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
    return; // Already closed, skip
  }

  // Check if pool is already ending/ended
  if (pool.ending || pool.ended) {
    databaseClosed = true;
    return;
  }

  try {
    databaseClosed = true;
    await pool.end();
  } catch (error) {
    // Ignore errors during shutdown - this is expected when pool is already closed
    logger.error("app.api.system.db.errors.pool_close_failed", parseError(error));
  }
}
