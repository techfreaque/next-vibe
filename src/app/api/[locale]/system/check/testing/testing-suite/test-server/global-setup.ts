/**
 * Global setup for all tests
 * This runs once before all test files
 */

import { parseError } from "next-vibe/shared/utils";

import { closeDatabase } from "@/app/api/[locale]/system/db";
import { SeedRepository } from "@/app/api/[locale]/system/db/seed/repository";
import { loadEnvironment } from "@/app/api/[locale]/system/unified-interface/cli/runtime/environment";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

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
