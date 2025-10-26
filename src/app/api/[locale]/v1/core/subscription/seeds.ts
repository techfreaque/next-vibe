/**
 * Subscription Seeds
 * Provides seed data for subscription-related tables
 */

import { parseError } from "next-vibe/shared/utils";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import { registerSeed } from "@/app/api/[locale]/v1/core/system/db/seed/seed-manager";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";

import { creditRepository } from "../credits/repository";
import type { EndpointLogger } from "../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { NewSubscription } from "./db";
import { subscriptions } from "./db";
import type { SubscriptionGetResponseOutput } from "./definition";
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

    let subscription: SubscriptionGetResponseOutput | undefined = undefined;

    if (existingSubscription.success && existingSubscription.data) {
      logger.debug("Demo user already has a subscription, skipping creation");
      subscription = existingSubscription.data;
    } else {
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
        subscription = {
          ...createdSubscription,
          plan: createdSubscription.planId,
          currentPeriodStart:
            createdSubscription.currentPeriodStart?.toISOString() ?? "",
          currentPeriodEnd:
            createdSubscription.currentPeriodEnd?.toISOString() ?? "",
          createdAt: createdSubscription.createdAt.toISOString(),
          updatedAt: createdSubscription.updatedAt.toISOString(),
        };
      }
    }

    // Always ensure subscription credits exist (even if subscription already existed)
    if (subscription) {
      // Check if user already has subscription credits
      const balanceResult = await creditRepository.getBalance(demoUser.id);
      const hasCredits = balanceResult.success && balanceResult.data.total > 0;

      if (!hasCredits) {
        // Convert currentPeriodEnd to Date if it's a string (from database)
        const expiresAt = subscription.currentPeriodEnd
          ? new Date(subscription.currentPeriodEnd)
          : undefined;

        const creditsResult = await creditRepository.addCredits(
          demoUser.id,
          1000,
          "subscription",
          expiresAt,
        );

        if (creditsResult.success) {
          logger.debug("Added 1000 subscription credits to demo user", {
            userId: demoUser.id,
          });
        } else {
          logger.error("Failed to add subscription credits to demo user", {
            userId: demoUser.id,
            error: creditsResult.message,
          });
        }
      } else {
        logger.debug("Demo user already has credits, skipping credit creation");
      }
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

      let adminSubscriptionData: SubscriptionGetResponseOutput | undefined =
        undefined;

      if (!adminSubscription.success || !adminSubscription.data) {
        // Create premium subscription for admin user
        const adminSubscriptionSeed = createLocalSubscriptionSeed(
          adminUser.id,
          {
            planId: SubscriptionPlan.SUBSCRIPTION,
            billingInterval: BillingInterval.YEARLY,
            status: SubscriptionStatus.ACTIVE,
          },
        );

        const [adminCreatedSubscription] = await db
          .insert(subscriptions)
          .values(adminSubscriptionSeed)
          .returning();

        if (adminCreatedSubscription) {
          logger.debug(
            `✅ Created premium subscription for admin user: ${adminCreatedSubscription.id}`,
          );
          adminSubscriptionData = {
            ...adminCreatedSubscription,
            plan: adminCreatedSubscription.planId,
            currentPeriodStart:
              adminCreatedSubscription.currentPeriodStart?.toISOString() ?? "",
            currentPeriodEnd:
              adminCreatedSubscription.currentPeriodEnd?.toISOString() ?? "",
            createdAt: adminCreatedSubscription.createdAt.toISOString(),
            updatedAt: adminCreatedSubscription.updatedAt.toISOString(),
          };
        }
      } else {
        logger.debug(
          "Admin user already has a subscription, skipping creation",
        );
        adminSubscriptionData = adminSubscription.data;
      }

      // Always ensure subscription credits exist (even if subscription already existed)
      if (adminSubscriptionData) {
        // Check if user already has subscription credits
        const balanceResult = await creditRepository.getBalance(adminUser.id);
        const hasCredits =
          balanceResult.success && balanceResult.data.total > 0;

        if (!hasCredits) {
          // Convert currentPeriodEnd to Date if it's a string (from database)
          const expiresAt = adminSubscriptionData.currentPeriodEnd
            ? new Date(adminSubscriptionData.currentPeriodEnd)
            : undefined;

          const creditsResult = await creditRepository.addCredits(
            adminUser.id,
            1000,
            "subscription",
            expiresAt,
          );

          if (creditsResult.success) {
            logger.debug("Added 1000 subscription credits to admin user", {
              userId: adminUser.id,
            });
          } else {
            logger.error("Failed to add subscription credits to admin user", {
              userId: adminUser.id,
              error: creditsResult.message,
            });
          }
        } else {
          logger.debug(
            "Admin user already has credits, skipping credit creation",
          );
        }
      }
    }
  } catch (error) {
    logger.error("Error creating development subscription seeds:", parseError(error));
    // Don't throw error - continue with other seeds
  }

  // Create low credits user for testing insufficient credits error
  try {
    const lowCreditsUserResponse = await userRepository.getUserByEmail(
      "lowcredits@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );

    if (lowCreditsUserResponse.success && lowCreditsUserResponse.data) {
      const lowCreditsUser = lowCreditsUserResponse.data;
      logger.debug(`Found low credits user for testing: ${lowCreditsUser.id}`);

      // Check if user already has a subscription
      const existingSubscription = await subscriptionRepository.getSubscription(
        lowCreditsUser.id,
        logger,
      );

      let subscription: SubscriptionGetResponseOutput | undefined = undefined;

      if (existingSubscription.success && existingSubscription.data) {
        logger.debug(
          "Low credits user already has a subscription, skipping creation",
        );
        subscription = existingSubscription.data;
      } else {
        // Create active subscription for low credits user
        const lowCreditsSubscriptionData = createLocalSubscriptionSeed(
          lowCreditsUser.id,
          {
            planId: SubscriptionPlan.SUBSCRIPTION,
            billingInterval: BillingInterval.MONTHLY,
            status: SubscriptionStatus.ACTIVE,
          },
        );

        const [createdSubscription] = await db
          .insert(subscriptions)
          .values(lowCreditsSubscriptionData)
          .returning();

        if (createdSubscription) {
          logger.debug(
            `✅ Created subscription for low credits user: ${createdSubscription.id}`,
          );
          subscription = {
            ...createdSubscription,
            plan: createdSubscription.planId,
            currentPeriodStart:
              createdSubscription.currentPeriodStart?.toISOString() ?? "",
            currentPeriodEnd:
              createdSubscription.currentPeriodEnd?.toISOString() ?? "",
            createdAt: createdSubscription.createdAt.toISOString(),
            updatedAt: createdSubscription.updatedAt.toISOString(),
          };
        }
      }

      // Always ensure subscription credits exist (only 3 credits for testing)
      if (subscription) {
        // Check if user already has subscription credits
        const balanceResult = await creditRepository.getBalance(
          lowCreditsUser.id,
        );
        const hasCredits =
          balanceResult.success && balanceResult.data.total > 0;

        if (!hasCredits) {
          // Convert currentPeriodEnd to Date if it's a string (from database)
          const expiresAt = subscription.currentPeriodEnd
            ? new Date(subscription.currentPeriodEnd)
            : undefined;

          // Add only 3 subscription credits (not enough for DeepSeek V3.1 which costs 5)
          const creditsResult = await creditRepository.addCredits(
            lowCreditsUser.id,
            3,
            "subscription",
            expiresAt,
          );

          if (creditsResult.success) {
            logger.debug("Added 3 subscription credits to low credits user", {
              userId: lowCreditsUser.id,
            });
          } else {
            logger.error(
              "Failed to add subscription credits to low credits user",
              {
                userId: lowCreditsUser.id,
                error: creditsResult.message,
              },
            );
          }
        } else {
          logger.debug(
            "Low credits user already has credits, skipping credit creation",
          );
        }
      }
    }
  } catch (error) {
    logger.error("Error creating low credits user seeds:", parseError(error));
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
    logger.error("Error preparing subscription test seeds:", parseError(error));
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
    logger.error("Error in subscription production setup:", parseError(error));
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
