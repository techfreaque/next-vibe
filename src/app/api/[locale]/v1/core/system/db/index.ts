import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "next-vibe/server/env";
import pg from "pg";

import type { EndpointLogger } from "../unified-ui/cli/vibe/endpoints/endpoint-handler/logger";

const { Pool } = pg;

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
 * Drizzle ORM database client
 */
export const db = drizzle(pool);

/**
 * Raw PostgreSQL pool for direct queries when needed
 */
export const rawPool = pool;

/**
 * Gracefully close database connections
 * Should be called when the application is shutting down
 */
export async function closeDatabase(logger: EndpointLogger): Promise<void> {
  try {
    await pool.end();
  } catch (error) {
    // Ignore errors during shutdown
    logger.error("core.system.db.errors.pool_close_failed", error);
  }
}

export * from "./types";
