import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";

import { db } from "../../../../app/api/[locale]/v1/core/system/db/index";

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
  fn: Parameters<typeof db.transaction>[0],
): Promise<T> {
  try {
    return (await db.transaction(fn)) as T;
  } catch (error) {
    logger.error("Transaction error", error);
    // Re-throw the error to maintain compatibility with Drizzle's transaction API
    // This is a low-level utility that must preserve the original error handling behavior
    // eslint-disable-next-line no-restricted-syntax
    throw error;
  }
}
