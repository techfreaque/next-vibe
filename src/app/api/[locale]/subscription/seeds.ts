/**
 * Subscription Seeds
 * Provides seed data for subscription-related tables
 */

import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";

import { CreditRepository } from "../credits/repository";
import { PaymentProvider } from "../payment/enum";
import type { NewSubscription } from "./db";
import { subscriptions } from "./db";
import type { SubscriptionGetResponseOutput } from "./definition";
import { BillingInterval, SubscriptionPlan, SubscriptionStatus } from "./enum";
import { SubscriptionRepository } from "./repository";
import { contactClientRepository } from "../contact/repository-client";

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
    provider: PaymentProvider.STRIPE,
    providerSubscriptionId: null,
    providerPriceId: null,
    providerProductId: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

const ENABLED = false;

/**
 * Development seed function for subscription module
 */
export async function dev(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  logger.debug("🌱 Seeding subscription data for development environment");

  if (!ENABLED) {
    return;
  }
  try {
    // NOTE: Demo user intentionally does NOT get a subscription by default
    // This allows testing the subscription purchase flow
    // To test with an active subscription, uncomment the code below

    /*
    // Get demo user for subscription testing
    const demoUserResponse = await UserRepository.getUserByEmail(
      "demo@example.com",
      UserDetailLevel.STANDARD,
      locale,
      logger,
    );

    if (!demoUserResponse.success || !demoUserResponse.data) {
      logger.debug("Demo user not found, skipping subscription seeds");
      return;
    }

    const demoUser = demoUserResponse.data;
    logger.debug(`Found demo user for subscription seeds: ${demoUser.id}`);

    // Check if demo user already has a subscription
    const existingSubscription = await SubscriptionRepository.getSubscription(
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

    if (subscription) {
      const userLead = await db.query.userLeadLinks.findFirst({
        where: (userLeads, { eq }) => eq(userLeads.userId, demoUser.id),
      });

      if (!userLead) {
        logger.error("Demo user missing leadId", { userId: demoUser.id });
        return;
      }

      const balanceResult = await CreditRepository.getBalance(
        { leadId: userLead.leadId, userId: demoUser.id },
        logger,
      );
      const hasCredits = balanceResult.success && balanceResult.data.total > 0;

      if (!hasCredits) {
        // Convert currentPeriodEnd to Date if it's a string (from database)
        const expiresAt = subscription.currentPeriodEnd
          ? new Date(subscription.currentPeriodEnd)
          : undefined;

        // Get subscription credits from products repository
        const { productsRepository, ProductIds } = await import("../products/repository-client");
        const subscriptionProduct = productsRepository.getProduct(ProductIds.SUBSCRIPTION, locale);
        const subscriptionCredits = subscriptionProduct.credits;

        const creditsResult = await CreditRepository.addUserCredits(
          demoUser.id,
          subscriptionCredits,
          "subscription",
          logger,
          expiresAt,
        );

        if (creditsResult.success) {
          logger.debug(`Added ${subscriptionCredits} subscription credits to demo user`, {
            userId: demoUser.id,
            credits: subscriptionCredits,
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
    */

    // Get admin user for subscription testing
    const adminUserResponse = await UserRepository.getUserByEmail(
      "admin@example.com",
      UserDetailLevel.STANDARD,
      locale,
      logger,
    );

    if (adminUserResponse.success && adminUserResponse.data) {
      const adminUser = adminUserResponse.data;

      // Check if admin user already has a subscription
      const adminSubscription = await SubscriptionRepository.getSubscription(
        adminUser.id,
        logger,
        locale,
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
            id: adminCreatedSubscription.id,
            userId: adminCreatedSubscription.userId,
            plan: adminCreatedSubscription.planId,
            billingInterval: adminCreatedSubscription.billingInterval,
            status: adminCreatedSubscription.status,
            cancelAtPeriodEnd: adminCreatedSubscription.cancelAtPeriodEnd,
            provider: adminCreatedSubscription.provider,
            providerSubscriptionId:
              adminCreatedSubscription.providerSubscriptionId || undefined,
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

      if (adminSubscriptionData) {
        const userLead = await db.query.userLeadLinks.findFirst({
          where: (userLeads, { eq }) => eq(userLeads.userId, adminUser.id),
        });

        if (!userLead) {
          logger.error("Admin user missing leadId", { userId: adminUser.id });
          return;
        }

        const balanceResult = await CreditRepository.getBalance(
          { leadId: userLead.leadId, userId: adminUser.id },
          logger,
        );
        const hasCredits =
          balanceResult.success && balanceResult.data.total > 0;

        if (!hasCredits) {
          // Convert currentPeriodEnd to Date if it's a string (from database)
          const expiresAt = adminSubscriptionData.currentPeriodEnd
            ? new Date(adminSubscriptionData.currentPeriodEnd)
            : undefined;

          // Get subscription credits from products repository
          const { productsRepository, ProductIds } = await import(
            "../products/repository-client"
          );
          const subscription = productsRepository.getProduct(
            ProductIds.SUBSCRIPTION,
            locale,
          );
          const subscriptionCredits = subscription.credits;

          const creditsResult = await CreditRepository.addUserCredits(
            adminUser.id,
            subscriptionCredits,
            "subscription",
            logger,
            expiresAt,
          );

          if (creditsResult.success) {
            logger.debug(
              `Added ${subscriptionCredits} subscription credits to admin user`,
              {
                userId: adminUser.id,
                credits: subscriptionCredits,
              },
            );
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
    logger.error(
      "Error creating development subscription seeds:",
      parseError(error),
    );
    // Don't throw error - continue with other seeds
  }

  // Create low credits user for testing insufficient credits error
  try {
    const lowCreditsUserResponse = await UserRepository.getUserByEmail(
      "lowcredits@example.com",
      UserDetailLevel.STANDARD,
      locale,
      logger,
    );

    if (lowCreditsUserResponse.success && lowCreditsUserResponse.data) {
      const lowCreditsUser = lowCreditsUserResponse.data;
      logger.debug(`Found low credits user for testing: ${lowCreditsUser.id}`);

      // Check if user already has a subscription
      const existingSubscription = await SubscriptionRepository.getSubscription(
        lowCreditsUser.id,
        logger,
        locale,
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
            id: createdSubscription.id,
            userId: createdSubscription.userId,
            plan: createdSubscription.planId,
            billingInterval: createdSubscription.billingInterval,
            status: createdSubscription.status,
            cancelAtPeriodEnd: createdSubscription.cancelAtPeriodEnd,
            provider: createdSubscription.provider,
            providerSubscriptionId:
              createdSubscription.providerSubscriptionId || undefined,
            currentPeriodStart:
              createdSubscription.currentPeriodStart?.toISOString() ?? "",
            currentPeriodEnd:
              createdSubscription.currentPeriodEnd?.toISOString() ?? "",
            createdAt: createdSubscription.createdAt.toISOString(),
            updatedAt: createdSubscription.updatedAt.toISOString(),
          };
        }
      }

      if (subscription) {
        const userLead = await db.query.userLeadLinks.findFirst({
          where: (userLeads, { eq }) => eq(userLeads.userId, lowCreditsUser.id),
        });

        if (!userLead) {
          logger.error("Low credits user missing leadId", {
            userId: lowCreditsUser.id,
          });
          return;
        }

        const balanceResult = await CreditRepository.getBalance(
          { leadId: userLead.leadId, userId: lowCreditsUser.id },
          logger,
        );
        const hasCredits =
          balanceResult.success && balanceResult.data.total > 0;

        if (!hasCredits) {
          // Convert currentPeriodEnd to Date if it's a string (from database)
          const expiresAt = subscription.currentPeriodEnd
            ? new Date(subscription.currentPeriodEnd)
            : undefined;

          // Add only 3 subscription credits (not enough for DeepSeek V3.1 which costs 5)
          const creditsResult = await CreditRepository.addUserCredits(
            lowCreditsUser.id,
            3,
            "subscription",
            logger,
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
export async function test(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  logger.debug("🌱 Seeding subscription data for test environment");

  try {
    // Get test users for subscription testing
    const testUser1Response = await UserRepository.getUserByEmail(
      "test1@example.com",
      UserDetailLevel.STANDARD,
      locale,
      logger,
    );

    const testUser2Response = await UserRepository.getUserByEmail(
      "test2@example.com",
      UserDetailLevel.STANDARD,
      locale,
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
          await SubscriptionRepository.getSubscription(
            subscriptionData.userId,
            logger,
            locale,
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
          parseError(subscriptionError),
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
export async function prod(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  logger.debug("🌱 Seeding subscription data for production environment");

  try {
    // In production, we typically don't pre-create subscription data
    // Instead, we might verify Stripe integration and webhook setup
    logger.debug("Subscription production setup - verifying integration");

    // Get admin user for subscription management
    const adminUserResponse = await UserRepository.getUserByEmail(
      contactClientRepository.getSupportEmail(locale),
      UserDetailLevel.STANDARD,
      locale,
      logger,
    );

    if (adminUserResponse.success && adminUserResponse.data) {
      const adminUser = adminUserResponse.data;
      logger.debug(
        `Admin user verified for subscription management: ${adminUser.id}`,
      );

      // Check if admin already has a subscription
      const adminSubscription = await SubscriptionRepository.getSubscription(
        adminUser.id,
        logger,
        locale,
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

// Export priority for seed manager
// Subscription seeds should run after user seeds but before business data (priority 45)
export const priority = 45;
