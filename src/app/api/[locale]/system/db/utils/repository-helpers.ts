import "server-only";

import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db/index";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

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
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Database transaction wrapper needs to propagate errors
    throw error;
  }
}
