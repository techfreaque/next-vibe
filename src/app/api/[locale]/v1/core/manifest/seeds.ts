/**
 * Manifest Seeds
 * Provides seed validation for manifest configuration
 */

import type { CountryLanguage } from "@/i18n/core/config";
import { registerSeed } from "@/packages/next-vibe/server/db/seed-manager";

import type { EndpointLogger } from "../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { manifestRepository } from "./repository";

/**
 * Development seed function for manifest module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding manifest data for development environment");

  try {
    // Manifest doesn't need database seeding - just validate configuration
    // Test manifest generation for supported locales
    const testLocales: CountryLanguage[] = ["en-GLOBAL", "de-DE", "pl-PL"];

    for (const locale of testLocales) {
      const manifestResult = await manifestRepository.generateManifest(
        locale,
        logger,
      );

      if (manifestResult.success) {
        logger.debug(`✅ Manifest generation validated for locale: ${locale}`);
      } else {
        logger.error(
          `Failed to generate manifest for locale ${locale}:`,
          manifestResult.message,
        );
      }
    }

    logger.debug("✅ Manifest configuration validated for development");
  } catch (error) {
    logger.error("Error validating manifest configuration:", error);
  }
}

/**
 * Test seed function for manifest module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding manifest data for test environment");

  try {
    // Test manifest generation for English locale
    const manifestResult = await manifestRepository.generateManifest(
      "en-GLOBAL",
      logger,
    );

    if (manifestResult.success) {
      logger.debug("✅ Test manifest generation validated");
    } else {
      logger.error("Failed to generate test manifest:", manifestResult.message);
    }
  } catch (error) {
    logger.error("Error validating test manifest configuration:", error);
  }
}

/**
 * Production seed function for manifest module
 */
export async function prod(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding manifest data for production environment");

  try {
    // Validate manifest generation for production
    const manifestResult = await manifestRepository.generateManifest(
      "en-GLOBAL",
      logger,
    );

    if (manifestResult.success) {
      logger.debug("✅ Production manifest configuration validated");
    } else {
      logger.error(
        "Failed to validate production manifest:",
        manifestResult.message,
      );
    }
  } catch (error) {
    logger.error("Error validating production manifest configuration:", error);
  }
}

// Register seeds with low priority since manifest doesn't depend on database
registerSeed(
  "manifest",
  {
    dev,
    test,
    prod,
  },
  10,
);
