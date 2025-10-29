/**
 * Global setup for all tests
 * This runs once before all test files
 */

import { parseError } from "next-vibe/shared/utils";

import { closeDatabase } from "@/app/api/[locale]/v1/core/system/db";
import { seedDatabase } from "@/app/api/[locale]/v1/core/system/db/seed/seed-manager";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import teardown from "./global-teardown";
import { startServer } from "./test-server";

export default async function setup(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<() => Promise<void>> {
  try {
    await startServer(logger);
    await seedDatabase("test", logger, locale);

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
    // eslint-disable-next-line no-restricted-syntax -- Test infrastructure can throw errors
    throw error;
  }
}
