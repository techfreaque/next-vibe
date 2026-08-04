import "server-only";

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
