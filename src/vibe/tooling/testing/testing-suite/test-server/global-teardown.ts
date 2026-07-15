/**
 * Global teardown for all tests
 * This runs once after all tests complete
 */

import { parseError } from "next-vibe/core/utils/parse-error";
import { closeDatabase } from "next-vibe/database/index";
import type { EndpointLogger } from "next-vibe/logger/types";

import { stopServer } from "./test-server";

export default async function teardown(logger: EndpointLogger): Promise<void> {
  try {
    logger.debug("Global teardown starting...");
    await closeDatabase(logger);
    await stopServer(logger);
    logger.debug("Test server stopped successfully");
  } catch (error) {
    logger.error("Error during test teardown:", parseError(error));
    // Attempt to force disconnect even if there's an error
    await closeDatabase(logger).catch(void logger.error);
    process.exit(1);
  }
}
