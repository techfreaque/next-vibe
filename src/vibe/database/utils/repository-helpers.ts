import "server-only";

import { DatabaseError } from "pg";

import { parseError } from "../../core/utils/parse-error";
import type { EndpointLogger } from "../../logger/types";
import { db } from "..";

/**
 * Transaction Utilities
 */

/**
 * Execute a function within a transaction
 *
 * @param fn - The function to execute within the transaction
 * @returns The result of the function
 */
export async function withTransaction<T>(
  logger: EndpointLogger,
  fn: (tx: Parameters<Parameters<typeof db.transaction>[0]>[0]) => Promise<T>,
): Promise<T> {
  try {
    return await db.transaction(fn);
  } catch (error) {
    logger.error("Transaction error", parseError(error));
    // Re-throw the error to maintain compatibility with Drizzle's transaction API
    // This is a low-level utility that must preserve the original error handling behavior
    // eslint-disable-next-line restricted/restricted-syntax -- Database transaction wrapper needs to propagate errors
    throw error;
  }
}

/** Postgres SQLSTATE for foreign_key_violation. */
const PG_FOREIGN_KEY_VIOLATION = "23503";

/**
 * The violated constraint when `error` (or the pg error drizzle wraps in
 * `cause`) is a foreign-key violation, else null. Pass `parseError(caught)`.
 */
export function getForeignKeyViolation(
  error: Error,
): { constraint: string; detail: string | null } | null {
  for (let current: Error | undefined = error; current;) {
    if (
      current instanceof DatabaseError &&
      current.code === PG_FOREIGN_KEY_VIOLATION
    ) {
      return {
        constraint: current.constraint ?? "unknown",
        detail: current.detail ?? null,
      };
    }
    current = current.cause instanceof Error ? current.cause : undefined;
  }
  return null;
}
