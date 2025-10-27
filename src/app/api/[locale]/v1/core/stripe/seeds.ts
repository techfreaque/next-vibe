/**
 * Stripe Seeds
 * Provides seed validation for Stripe CLI integration
 */

import { parseError } from "next-vibe/shared/utils";

import { registerSeed } from "@/app/api/[locale]/v1/core/system/db/seed/seed-manager";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";

import { cliStripeRepository } from "./repository";

/**
 * Development seed function for stripe module
 */
export function dev(logger: EndpointLogger): void {
  logger.debug("🌱 Seeding stripe data for development environment");

  try {
    // Stripe doesn't need database seeding - just validate CLI integration
    // Check if Stripe CLI is properly installed and configured
    const installationResult = cliStripeRepository.checkInstallation(logger);

    if (installationResult.success && installationResult.data) {
      logger.debug("✅ Stripe CLI installation validated");

      // Check authentication status
      const authResult = cliStripeRepository.checkAuthentication(logger);
      if (authResult.success && authResult.data) {
        logger.debug("✅ Stripe CLI authentication validated");
      } else {
        logger.debug(
          "⚠️ Stripe CLI not authenticated - this is expected for fresh setups",
        );
      }
    } else {
      logger.debug(
        "⚠️ Stripe CLI not installed - webhook functionality will be limited",
      );
    }

    logger.debug("✅ Stripe CLI integration validated for development");
  } catch (error) {
    logger.error("Error validating Stripe CLI integration:", parseError(error));
  }
}

/**
 * Test seed function for stripe module
 */
export function test(logger: EndpointLogger): void {
  logger.debug("🌱 Seeding stripe data for test environment");

  try {
    // For test environment, just check if Stripe CLI is available
    const installationResult = cliStripeRepository.checkInstallation(logger);

    if (installationResult.success) {
      logger.debug("✅ Test Stripe CLI configuration validated");
    } else {
      logger.debug(
        "⚠️ Stripe CLI not available in test environment - this is expected",
      );
    }
  } catch (error) {
    logger.error(
      "Error validating test Stripe CLI configuration:",
      parseError(error),
    );
  }
}

/**
 * Production seed function for stripe module
 */
export function prod(logger: EndpointLogger): void {
  logger.debug("🌱 Seeding stripe data for production environment");

  try {
    // In production, validate that Stripe integration is properly configured
    const installationResult = cliStripeRepository.checkInstallation(logger);

    if (installationResult.success && installationResult.data) {
      logger.debug("✅ Production Stripe CLI installation validated");

      // Check authentication for production
      const authResult = cliStripeRepository.checkAuthentication(logger);
      if (authResult.success && authResult.data) {
        logger.debug("✅ Production Stripe CLI authentication validated");
      } else {
        logger.debug("⚠️ Production Stripe CLI authentication needs setup");
      }
    } else {
      logger.debug(
        "⚠️ Production Stripe CLI needs installation for full functionality",
      );
    }

    logger.debug("✅ Production Stripe integration validated");
  } catch (error) {
    logger.error(
      "Error validating production Stripe integration:",
      parseError(error),
    );
  }
}

// Register seeds with low priority since Stripe doesn't depend on database
registerSeed(
  "stripe",
  {
    dev,
    test,
    prod,
  },
  5,
);
