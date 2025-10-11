/**
 * Global setup for all tests
 * This runs once before all test files
 */

import { closeDatabase } from "@/app/api/[locale]/v1/core/system/db";
import type { CountryLanguage } from "@/i18n/core/config";
import { seedDatabase } from "next-vibe/server/db/seed-manager";

import type { EndpointLogger } from "../../../../unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import teardown from "./global-teardown";
import { startServer } from "./test-server";

export default async function setup(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
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
    logger.error("Error during test setup:", error);
    // Make sure to disconnect Prisma on error
    await closeDatabase(logger).catch(void logger.error);
    throw error;
  }
}
