/**
 * Newsletter Seeds
 * Provides seed data for newsletter subscriptions
 */

import { parseError } from "next-vibe/shared/utils";

import { registerSeed } from "@/app/api/[locale]/v1/core/system/db/seed/seed-manager";

import type { EndpointLogger } from "../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { UserDetailLevel } from "../user/enum";
import { userRepository } from "../user/repository";
import type { NewNewsletterSubscription } from "./db";
import { NewsletterSubscriptionStatus } from "./enum";

/**
 * Helper function to create newsletter subscription seed data
 */
function createNewsletterSeed(
  overrides?: Partial<NewNewsletterSubscription>,
): NewNewsletterSubscription {
  return {
    email: "demo@example.com",
    status: NewsletterSubscriptionStatus.SUBSCRIBED,
    subscriptionDate: new Date(),
    preferences: {
      frequency: "weekly",
      categories: ["updates", "tips"],
    },
    ...overrides,
  };
}

/**
 * Development seed function for newsletter module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding newsletter data for development environment");

  try {
    // Get existing users for newsletter subscriptions
    const demoUserResponse = await userRepository.getUserByEmail(
      "demo@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );

    const adminUserResponse = await userRepository.getUserByEmail(
      "admin@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );

    // Create newsletter subscriptions for development users
    const subscriptions = [
      createNewsletterSeed({
        email: "demo@example.com",
        userId: demoUserResponse.success
          ? demoUserResponse.data?.id
          : undefined,
        status: NewsletterSubscriptionStatus.SUBSCRIBED,
        preferences: {
          frequency: "weekly",
          categories: ["updates", "tips", "news"],
        },
      }),
      createNewsletterSeed({
        email: "admin@example.com",
        userId: adminUserResponse.success
          ? adminUserResponse.data?.id
          : undefined,
        status: NewsletterSubscriptionStatus.SUBSCRIBED,
        preferences: {
          frequency: "daily",
          categories: ["updates", "admin", "system"],
        },
      }),
      createNewsletterSeed({
        email: "app.api.v1.core.newsletter.test@example.com",
        status: NewsletterSubscriptionStatus.PENDING,
        preferences: {
          frequency: "monthly",
          categories: ["tips"],
        },
      }),
    ];

    // Note: Newsletter functionality may need repository implementation
    // For now, we'll just log the intended subscriptions
    for (const subscription of subscriptions) {
      logger.debug(
        `✅ Would create newsletter subscription for ${subscription.email}`,
        {
          subscription,
        },
      );
    }

    logger.debug("✅ Newsletter subscription data ready for development");
  } catch (error) {
    logger.error("Error seeding newsletter data:", parseError(error));
  }
}

/**
 * Test seed function for newsletter module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding newsletter data for test environment");

  try {
    // Create minimal test newsletter subscription
    const testSubscription = createNewsletterSeed({
      email: "test.newsletter@example.com",
      status: NewsletterSubscriptionStatus.SUBSCRIBED,
      preferences: {
        frequency: "weekly",
        categories: ["test"],
      },
    });

    await Promise.resolve(); // Add await expression for async function
    logger.debug("✅ Would create test newsletter subscription", {
      subscription: testSubscription,
    });
  } catch (error) {
    logger.error("Error seeding test newsletter data:", parseError(error));
  }
}

/**
 * Production seed function for newsletter module
 */
export async function prod(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding newsletter data for production environment");

  try {
    // Production doesn't need pre-seeded newsletter subscriptions
    // Users will subscribe through the actual newsletter forms
    await Promise.resolve(); // Add await expression for async function
    logger.debug("✅ Newsletter system ready for production subscriptions");
  } catch (error) {
    logger.error("Error seeding production newsletter data:", parseError(error));
  }
}

// Register seeds with low priority since newsletters depend on users
registerSeed(
  "newsletter",
  {
    dev,
    test,
    prod,
  },
  20,
);
