/**
 * Global setup for all tests
 * This runs once before all test files
 */

import { parseError } from "next-vibe/core/utils/parse-error";
import { closeDatabase } from "next-vibe/database/index";
import { SeedRepository } from "next-vibe/database/seed/repository";
import type { EndpointLogger } from "next-vibe/logger/types";
import { loadEnvironment } from "next-vibe/platforms/cli/runtime/environment";

import teardown from "./global-teardown";
import { startServer } from "./test-server";

export default async function setup(
  logger: EndpointLogger,
): Promise<() => Promise<void>> {
  try {
    loadEnvironment();
    await startServer(logger);
    await SeedRepository.seed("test", logger);

    // Return a teardown function that will be run after all tests
    return async (): Promise<void> => {
      logger.debug("Global setup teardown function called");
      await teardown(logger);
      // The actual teardown logic is in global-teardown.ts
    };
  } catch (error) {
    logger.error("Error during test setup:", parseError(error));
    // Make sure to disconnect Prisma on error
    await closeDatabase(logger).catch(void logger.error);
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Test infrastructure can throw errors
    throw error;
  }
}
