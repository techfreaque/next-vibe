/**
 * Subscription Seeds
 * Provides seed data for subscription-related tables
 */

import { db } from "@/app/api/[locale]/v1/core/system/db";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { registerSeed } from "@/packages/next-vibe/server/db/seed-manager";

import type { EndpointLogger } from "../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { NewSubscription } from "./db";
import { subscriptions } from "./db";
import { BillingInterval, SubscriptionPlan, SubscriptionStatus } from "./enum";
import { subscriptionRepository } from "./repository";

/**
 * Helper function to create local subscription record
 */
function createLocalSubscriptionSeed(
  userId: string,
  overrides?: Partial<NewSubscription>,
): NewSubscription {
  const now = new Date();
  const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return {
    userId,
    status: SubscriptionStatus.ACTIVE,
    planId: SubscriptionPlan.SUBSCRIPTION,
    billingInterval: BillingInterval.MONTHLY,
    currentPeriodStart: now,
    currentPeriodEnd: oneMonthFromNow,
    cancelAtPeriodEnd: false,
    canceledAt: null,
    endedAt: null,
    cancellationReason: null,
    trialStart: null,
    trialEnd: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripePriceId: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Development seed function for subscription module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding subscription data for development environment");

  try {
    // Get demo user for subscription testing
    const demoUserResponse = await userRepository.getUserByEmail(
      "demo@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );

    if (!demoUserResponse.success || !demoUserResponse.data) {
      logger.debug("Demo user not found, skipping subscription seeds");
      return;
    }

    const demoUser = demoUserResponse.data;
    logger.debug(`Found demo user for subscription seeds: ${demoUser.id}`);

    // Check if demo user already has a subscription
    const existingSubscription = await subscriptionRepository.getSubscription(
      demoUser.id,
      logger,
    );

    if (existingSubscription.success && existingSubscription.data) {
      logger.debug("Demo user already has a subscription, skipping creation");
      return;
    }

    // Create local subscription record for demo user (active professional plan)
    const demoSubscriptionData = createLocalSubscriptionSeed(demoUser.id, {
      planId: SubscriptionPlan.SUBSCRIPTION,
      billingInterval: BillingInterval.MONTHLY,
      status: SubscriptionStatus.ACTIVE,
    });

    const [createdSubscription] = await db
      .insert(subscriptions)
      .values(demoSubscriptionData)
      .returning();

    if (createdSubscription) {
      logger.debug(
        `✅ Created development subscription for demo user: ${createdSubscription.id}`,
      );
    }

    // Get admin user for subscription testing
    const adminUserResponse = await userRepository.getUserByEmail(
      "admin@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );

    if (adminUserResponse.success && adminUserResponse.data) {
      const adminUser = adminUserResponse.data;

      // Check if admin user already has a subscription
      const adminSubscription = await subscriptionRepository.getSubscription(
        adminUser.id,
        logger,
      );

      if (!adminSubscription.success || !adminSubscription.data) {
        // Create premium subscription for admin user
        const adminSubscriptionData = createLocalSubscriptionSeed(
          adminUser.id,
          {
            planId: SubscriptionPlan.SUBSCRIPTION,
            billingInterval: BillingInterval.YEARLY,
            status: SubscriptionStatus.ACTIVE,
          },
        );

        const [adminCreatedSubscription] = await db
          .insert(subscriptions)
          .values(adminSubscriptionData)
          .returning();

        if (adminCreatedSubscription) {
          logger.debug(
            `✅ Created premium subscription for admin user: ${adminCreatedSubscription.id}`,
          );
        }
      }
    }
  } catch (error) {
    logger.error("Error creating development subscription seeds:", error);
    // Don't throw error - continue with other seeds
  }

  logger.debug("✅ Subscription development seeding completed");
}

/**
 * Test seed function for subscription module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding subscription data for test environment");

  try {
    // Get test users for subscription testing
    const testUser1Response = await userRepository.getUserByEmail(
      "test1@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );

    const testUser2Response = await userRepository.getUserByEmail(
      "test2@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );

    if (!testUser1Response.success || !testUser2Response.success) {
      logger.debug("Test users not found, skipping subscription test seeds");
      return;
    }

    const testUser1 = testUser1Response.data;
    const testUser2 = testUser2Response.data;

    // Create test subscription configurations
    const testSubscriptions = [
      // Active subscription for test user 1
      createLocalSubscriptionSeed(testUser1.id, {
        planId: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.MONTHLY,
        status: SubscriptionStatus.ACTIVE,
      }),
      // Canceled subscription for test user 2 (for testing edge cases)
      createLocalSubscriptionSeed(testUser2.id, {
        planId: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.MONTHLY,
        status: SubscriptionStatus.CANCELED,
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
      }),
    ];

    // Insert test subscriptions
    for (const subscriptionData of testSubscriptions) {
      try {
        // Check if subscription already exists
        const existingSubscription =
          await subscriptionRepository.getSubscription(
            subscriptionData.userId,
            logger,
          );

        if (!existingSubscription.success || !existingSubscription.data) {
          const [createdSubscription] = await db
            .insert(subscriptions)
            .values(subscriptionData)
            .returning();

          if (createdSubscription) {
            logger.debug(
              `✅ Created test subscription: ${createdSubscription.id} for user: ${subscriptionData.userId}`,
            );
          }
        } else {
          logger.debug(
            `Test subscription already exists for user: ${subscriptionData.userId}`,
          );
        }
      } catch (subscriptionError) {
        logger.error(
          `Error creating test subscription for user ${subscriptionData.userId}:`,
          subscriptionError,
        );
      }
    }
  } catch (error) {
    logger.error("Error preparing subscription test seeds:", error);
    // Don't throw error - continue with other seeds
  }

  logger.debug("✅ Subscription test seeding completed");
}

/**
 * Production seed function for subscription module
 */
export async function prod(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding subscription data for production environment");

  try {
    // In production, we typically don't pre-create subscription data
    // Instead, we might verify Stripe integration and webhook setup
    logger.debug("Subscription production setup - verifying integration");

    // Get admin user for subscription management
    const adminUserResponse = await userRepository.getUserByEmail(
      "hi@socialmediaservice.center",
      UserDetailLevel.STANDARD,
      logger,
    );

    if (adminUserResponse.success && adminUserResponse.data) {
      const adminUser = adminUserResponse.data;
      logger.debug(
        `Admin user verified for subscription management: ${adminUser.id}`,
      );

      // Check if admin already has a subscription
      const adminSubscription = await subscriptionRepository.getSubscription(
        adminUser.id,
        logger,
      );

      if (!adminSubscription.success || !adminSubscription.data) {
        // Create enterprise subscription for production admin
        const adminSubscriptionData = createLocalSubscriptionSeed(
          adminUser.id,
          {
            planId: SubscriptionPlan.SUBSCRIPTION,
            billingInterval: BillingInterval.YEARLY,
            status: SubscriptionStatus.ACTIVE,
          },
        );

        const [createdAdminSubscription] = await db
          .insert(subscriptions)
          .values(adminSubscriptionData)
          .returning();

        if (createdAdminSubscription) {
          logger.debug(
            `✅ Created production admin subscription: ${createdAdminSubscription.id}`,
          );
        }
      } else {
        logger.debug("Production admin subscription already exists");
      }
    }

    logger.debug("✅ Subscription system verified for production");
  } catch (error) {
    logger.error("Error in subscription production setup:", error);
    // Don't throw error - log and continue
  }

  logger.debug("✅ Subscription production seeding completed");
}

// Register seeds with appropriate priority
// Subscription seeds should run after user seeds but before business data (priority 45)
registerSeed(
  "subscription",
  {
    dev,
    test,
    prod,
  },
  45,
);
