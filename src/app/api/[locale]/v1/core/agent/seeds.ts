/**
 * Agent Seeds
 * Provides seed data for email agent processing system
 */

import { registerSeed } from "@/packages/next-vibe/server/db/seed-manager";

import type { EndpointLogger } from "../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

/**
 * Development seed function for agent module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding agent data for development environment");

  try {
    // Agent module is primarily system-driven and doesn't need specific seed data
    // The agent system creates its own processing records based on email interactions
    await Promise.resolve();
    logger.debug("✅ Agent system is ready for dynamic email processing");
  } catch (error) {
    logger.error("Error seeding agent data:", error);
  }
}

/**
 * Test seed function for agent module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding agent data for test environment");

  try {
    // Test environment doesn't require specific agent seeds
    // Agent processing will be tested through email interaction tests
    await Promise.resolve();
    logger.debug("✅ Agent system ready for test email processing");
  } catch (error) {
    logger.error("Error seeding test agent data:", error);
  }
}

/**
 * Production seed function for agent module
 */
export async function prod(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding agent data for production environment");

  try {
    // Production agent system is self-managing
    // No initial seed data required
    await Promise.resolve();
    logger.debug("✅ Agent system ready for production email processing");
  } catch (error) {
    logger.error("Error seeding production agent data:", error);
  }
}

// Register seeds with low priority since agents are system-driven
registerSeed(
  "agent",
  {
    dev,
    test,
    prod,
  },
  10,
);
