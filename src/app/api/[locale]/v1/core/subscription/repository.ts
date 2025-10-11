/**
 * Subscription Repository
 * Implements repository pattern for subscription operations with Stripe integration
 */

import "server-only";

import { desc, eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";
import type Stripe from "stripe";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { users } from "../user/db";
import { stripe, STRIPE_PRICE_IDS } from "./checkout/repository";
import type { NewSubscription } from "./db";
import { subscriptions } from "./db";
import type {
  SubscriptionGetResponseTypeOutput,
  SubscriptionPostRequestTypeOutput,
  SubscriptionPostResponseTypeOutput,
} from "./definition";
import { BillingInterval, BillingIntervalValue, SubscriptionPlan, SubscriptionPlanValue, SubscriptionStatus, SubscriptionStatusValue } from "./enum";

/**
 * Helper function to extract country from locale
 */
const getCountryFromLocale = (
  locale: CountryLanguage,
): keyof typeof STRIPE_PRICE_IDS => {
  // Extract country part from locale (e.g., "en-GLOBAL" -> "GLOBAL", "de-DE" -> "DE")
  const countryPart = locale.split("-")[1];

  // Validate that the country is supported
  if (countryPart && countryPart in STRIPE_PRICE_IDS) {
    return countryPart as keyof typeof STRIPE_PRICE_IDS;
  }

  // Default to GLOBAL if country is not found or not supported
  return "GLOBAL";
};

/**
 * Helper function to get Stripe price ID for a plan, billing interval, and region
 */
const getStripePriceId = (
  planId: Exclude<SubscriptionPlanValue, typeof SubscriptionPlan.ENTERPRISE>,
  billingInterval: BillingIntervalValue,
  country: keyof typeof STRIPE_PRICE_IDS,
): string => {
  const regionPrices = STRIPE_PRICE_IDS[country];
  const intervalPrices = regionPrices[billingInterval];
  return intervalPrices[planId];
};

/**
 * Helper function to ensure user has a Stripe customer
 * Production-ready version that stores and reuses stripeCustomerId
 */
const ensureStripeCustomer = async (
  userId: string,
  logger: EndpointLogger,
): Promise<ResponseType<string>> => {
  try {
    // Get user from database
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user[0]) {
      return createErrorResponse(
        "subscription.errors.user_not_found",
        ErrorResponseTypes.NOT_FOUND,
        { userId },
      );
    }

    // If user already has a Stripe customer ID, return it
    if (user[0].stripeCustomerId) {
      return createSuccessResponse(user[0].stripeCustomerId);
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email: user[0].email,
      name: `${user[0].firstName} ${user[0].lastName}`,
      metadata: {
        userId: userId,
      },
    });

    // Update user with Stripe customer ID
    await db
      .update(users)
      .set({ stripeCustomerId: customer.id })
      .where(eq(users.id, userId));

    return createSuccessResponse(customer.id);
  } catch (error) {
    logger.error("Failed to ensure Stripe customer", {
      error: parseError(error),
      userId,
    });
    const parsedError = parseError(error);
    return createErrorResponse(
      "subscription.errors.stripe_customer_creation_failed",
      ErrorResponseTypes.INTERNAL_ERROR,
      { error: parsedError.message, userId },
    );
  }
};

/**
 * Helper function to sync Stripe subscription with database
 */
const syncStripeSubscription = async (
  stripeSubscription: Stripe.Subscription,
  userId: string,
  logger: EndpointLogger,
): Promise<ResponseType<SubscriptionPostResponseTypeOutput>> => {
  try {
    const subscriptionData: NewSubscription = {
      // Don't set id - let the database auto-generate a UUID
      userId: userId,
      stripeCustomerId: stripeSubscription.customer as string,
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: stripeSubscription.items.data[0]?.price.id || null,
      status: mapStripeStatusToLocal(stripeSubscription.status),
      planId: (extractPlanFromMetadata(stripeSubscription.metadata) ||
        SubscriptionPlan.STARTER) as SubscriptionPlanValue,
      billingInterval:
        stripeSubscription.items.data[0]?.price.recurring?.interval === "year"
          ? BillingInterval.YEARLY
          : BillingInterval.MONTHLY,
      currentPeriodStart: stripeSubscription.items.data[0]?.current_period_start
        ? new Date(stripeSubscription.items.data[0].current_period_start * 1000)
        : new Date(),
      currentPeriodEnd: stripeSubscription.items.data[0]?.current_period_end
        ? new Date(stripeSubscription.items.data[0].current_period_end * 1000)
        : new Date(),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end || false,
      canceledAt: stripeSubscription.canceled_at
        ? new Date(stripeSubscription.canceled_at * 1000)
        : null,
      endedAt: stripeSubscription.ended_at
        ? new Date(stripeSubscription.ended_at * 1000)
        : null,
      trialStart: stripeSubscription.trial_start
        ? new Date(stripeSubscription.trial_start * 1000)
        : null,
      trialEnd: stripeSubscription.trial_end
        ? new Date(stripeSubscription.trial_end * 1000)
        : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Upsert subscription in database
    const result = await db
      .insert(subscriptions)
      .values(subscriptionData)
      .onConflictDoUpdate({
        target: subscriptions.stripeSubscriptionId,
        set: {
          status: subscriptionData.status,
          planId: subscriptionData.planId,
          billingInterval: subscriptionData.billingInterval,
          currentPeriodStart: subscriptionData.currentPeriodStart,
          currentPeriodEnd: subscriptionData.currentPeriodEnd,
          cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd,
          canceledAt: subscriptionData.canceledAt,
          endedAt: subscriptionData.endedAt,
          trialStart: subscriptionData.trialStart,
          trialEnd: subscriptionData.trialEnd,
          stripeSubscriptionId: subscriptionData.stripeSubscriptionId,
          stripePriceId: subscriptionData.stripePriceId,
          updatedAt: new Date(),
        },
      })
      .returning();

    const subscription = result[0];
    return createSuccessResponse({
      id: subscription.id,
      userId: subscription.userId,
      plan: subscription.planId as SubscriptionPlanValue,
      billingInterval: subscription.billingInterval,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart.toISOString(),
      currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString(),
      message: "Subscription synced successfully",
    });
  } catch (error) {
    logger.error("Failed to sync Stripe subscription", {
      error: parseError(error),
      subscriptionId: stripeSubscription.id,
    });
    return createErrorResponse(
      "subscription.errors.sync_failed",
      ErrorResponseTypes.DATABASE_ERROR,
      {
        error: parseError(error).message,
        subscriptionId: stripeSubscription.id,
      },
    );
  }
};

/**
 * Helper function to map Stripe subscription status to local enum
 */
const mapStripeStatusToLocal = (
  stripeStatus: Stripe.Subscription.Status,
): SubscriptionStatusValue => {
  switch (stripeStatus) {
    case "active":
      return SubscriptionStatus.ACTIVE;
    case "past_due":
      return SubscriptionStatus.PAST_DUE;
    case "canceled":
    case "unpaid":
      return SubscriptionStatus.CANCELED;
    case "incomplete":
    case "incomplete_expired":
      return SubscriptionStatus.INCOMPLETE;
    case "trialing":
      return SubscriptionStatus.TRIALING;
    case "paused":
      return SubscriptionStatus.PAUSED;
    default:
      return SubscriptionStatus.INCOMPLETE;
  }
};

/**
 * Helper function to extract plan ID from Stripe metadata
 */
const extractPlanFromMetadata = (metadata: Stripe.Metadata): string | null => {
  return metadata.planId || metadata.plan_id || null;
};

/**
 * Subscription Repository Interface
 * Defines the contract for subscription data operations with Stripe integration
 */
export interface SubscriptionRepository {
  /**
   * Get subscription by user ID
   */
  getSubscription(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionGetResponseTypeOutput | null>>;

  /**
   * Create a new subscription with Stripe integration
   */
  createSubscription(
    data: SubscriptionPostRequestTypeOutput,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionPostResponseTypeOutput>>;

  /**
   * Update a subscription with Stripe integration
   */
  updateSubscription(
    data: SubscriptionPostRequestTypeOutput,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionPostResponseTypeOutput>>;

  /**
   * Cancel a subscription with Stripe integration
   */
  cancelSubscription(
    data: { cancelAtPeriodEnd: boolean; reason?: string },
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionPostResponseTypeOutput>>;

  /**
   * Sync a Stripe subscription with the local database
   * Used by webhook handlers to keep subscription data in sync
   */
  syncStripeSubscription(
    stripeSubscription: Stripe.Subscription,
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionPostResponseTypeOutput>>;

  /**
   * Ensure Stripe customer exists for user
   */
  ensureStripeCustomer(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>>;
}

/**
 * Subscription Repository Implementation
 * Uses Drizzle ORM for database operations
 */
export class SubscriptionRepositoryImpl implements SubscriptionRepository {
  /**
   * Get subscription by user ID
   */
  async getSubscription(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionGetResponseTypeOutput | null>> {
    try {
      const results = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .orderBy(desc(subscriptions.createdAt))
        .limit(1);

      if (results.length === 0) {
        return createSuccessResponse(null);
      }

      const subscription = results[0];
      const subscriptionData: SubscriptionGetResponseTypeOutput = {
        id: subscription.id,
        userId: subscription.userId,
        plan: subscription.planId as SubscriptionPlanValue,
        billingInterval: subscription.billingInterval,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart.toISOString(),
        currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        createdAt: subscription.createdAt.toISOString(),
        updatedAt: subscription.updatedAt.toISOString(),
        message: "",
      };

      return createSuccessResponse(subscriptionData);
    } catch (error) {
      logger.error("Error getting subscription:", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "subscription.errors.database_error",
        ErrorResponseTypes.DATABASE_ERROR,
        { error: parsedError.message },
      );
    }
  }

  /**
   * Create a new subscription with Stripe integration
   */
  async createSubscription(
    data: SubscriptionPostRequestTypeOutput,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionPostResponseTypeOutput>> {
    try {
      // Ensure user has a Stripe customer
      const stripeCustomerResult = await ensureStripeCustomer(userId, logger);
      if (!stripeCustomerResult.success) {
        return stripeCustomerResult;
      }
      const stripeCustomerId = stripeCustomerResult.data;

      // Get the Stripe price ID for the plan and billing interval
      const country = getCountryFromLocale(locale);
      const stripePriceId = getStripePriceId(
        data.plan,
        data.billingInterval,
        country,
      );

      // Create Stripe subscription
      const stripeSubscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: stripePriceId }],
        metadata: {
          userId: userId,
          planId: data.plan,
        },
      });

      // Sync the Stripe subscription with our database
      const syncResult = await syncStripeSubscription(
        stripeSubscription,
        userId,
        logger,
      );

      if (!syncResult.success) {
        return syncResult;
      }

      return createSuccessResponse(syncResult.data);
    } catch (error) {
      logger.error("Error creating subscription:", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "subscription.errors.create_crashed",
        ErrorResponseTypes.DATABASE_ERROR,
        { error: parsedError.message },
      );
    }
  }

  /**
   * Update a subscription with Stripe integration
   */
  async updateSubscription(
    data: SubscriptionPostRequestTypeOutput,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionPostResponseTypeOutput>> {
    try {
      // Get current subscription
      const currentSubscription = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .limit(1);

      if (!currentSubscription[0]) {
        return createErrorResponse(
          "subscription.errors.not_found",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      const subscription = currentSubscription[0];

      // If we have a Stripe subscription ID, update it in Stripe
      if (
        subscription.stripeSubscriptionId &&
        (data.plan || data.billingInterval)
      ) {
        const country = getCountryFromLocale(locale);
        const newPriceId = getStripePriceId(
          (data.plan || subscription.planId) as Exclude<
            SubscriptionPlan,
            SubscriptionPlan.ENTERPRISE
          >,
          data.billingInterval || subscription.billingInterval,
          country,
        );

        // Update Stripe subscription
        const stripeSubscription = await stripe.subscriptions.update(
          subscription.stripeSubscriptionId,
          {
            items: [
              {
                id: subscription.stripePriceId || undefined,
                price: newPriceId,
              },
            ],
            metadata: {
              userId: userId,
              planId: data.plan || subscription.planId,
            },
          },
        );

        // Sync the updated Stripe subscription with our database
        const syncResult = await syncStripeSubscription(
          stripeSubscription,
          userId,
          logger,
        );
        if (!syncResult.success) {
          return syncResult;
        }
        return createSuccessResponse(syncResult.data);
      }

      // Fallback to local update if no Stripe subscription
      const updateData: Partial<NewSubscription> = {
        updatedAt: new Date(),
      };

      if (data.plan) {
        updateData.planId = data.plan;
      }
      if (data.billingInterval) {
        updateData.billingInterval = data.billingInterval;
      }

      const results = await db
        .update(subscriptions)
        .set(updateData)
        .where(eq(subscriptions.userId, userId))
        .returning();

      if (results.length === 0) {
        return createErrorResponse(
          "subscription.errors.not_found",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      const updatedSubscription = results[0];
      const subscriptionData: SubscriptionPostResponseTypeOutput = {
        id: updatedSubscription.id,
        userId: updatedSubscription.userId,
        plan: updatedSubscription.planId as SubscriptionPlan,
        billingInterval: updatedSubscription.billingInterval,
        status: updatedSubscription.status,
        currentPeriodStart: updatedSubscription.currentPeriodStart.toISOString(),
        currentPeriodEnd: updatedSubscription.currentPeriodEnd.toISOString(),
        cancelAtPeriodEnd: updatedSubscription.cancelAtPeriodEnd,
        createdAt: updatedSubscription.createdAt.toISOString(),
        updatedAt: updatedSubscription.updatedAt.toISOString(),
        message: "Subscription updated successfully",
      };

      return createSuccessResponse(subscriptionData);
    } catch (error) {
      logger.error("Error updating subscription:", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "subscription.errors.database_error",
        ErrorResponseTypes.DATABASE_ERROR,
        { error: parsedError.message },
      );
    }
  }

  /**
   * Cancel a subscription with Stripe integration
   */
  async cancelSubscription(
    data: { cancelAtPeriodEnd: boolean; reason?: string },
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionPostResponseTypeOutput>> {
    try {
      // Get current subscription
      const currentSubscription = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .limit(1);

      if (!currentSubscription[0]) {
        return createErrorResponse(
          "subscription.errors.not_found",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      const subscription = currentSubscription[0];

      // If we have a Stripe subscription ID, cancel it in Stripe
      if (subscription.stripeSubscriptionId) {
        if (data.cancelAtPeriodEnd) {
          // Cancel at period end
          const stripeSubscription = await stripe.subscriptions.update(
            subscription.stripeSubscriptionId,
            {
              cancel_at_period_end: true,
            },
          );

          // Sync the updated Stripe subscription with our database
          const syncResult = await syncStripeSubscription(
            stripeSubscription,
            userId,
            logger,
          );
          if (!syncResult.success) {
            return syncResult;
          }
          return createSuccessResponse(syncResult.data);
        } else {
          // Cancel immediately
          const stripeSubscription = await stripe.subscriptions.cancel(
            subscription.stripeSubscriptionId,
          );

          // Sync the canceled Stripe subscription with our database
          const syncResult = await syncStripeSubscription(
            stripeSubscription,
            userId,
            logger,
          );
          if (!syncResult.success) {
            return syncResult;
          }
          return createSuccessResponse(syncResult.data);
        }
      }

      // Fallback to local cancellation if no Stripe subscription
      const updateData: Partial<NewSubscription> = {
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
        updatedAt: new Date(),
      };

      if (data.cancelAtPeriodEnd) {
        updateData.canceledAt = new Date();
      } else {
        updateData.status = SubscriptionStatus.CANCELED;
        updateData.canceledAt = new Date();
        updateData.endedAt = new Date();
      }

      const results = await db
        .update(subscriptions)
        .set(updateData)
        .where(eq(subscriptions.userId, userId))
        .returning();

      if (results.length === 0) {
        return createErrorResponse(
          "subscription.errors.not_found",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      const canceledSubscription = results[0];
      const subscriptionData: SubscriptionPostResponseTypeOutput = {
        id: canceledSubscription.id,
        userId: canceledSubscription.userId,
        plan: canceledSubscription.planId as SubscriptionPlan,
        billingInterval: canceledSubscription.billingInterval,
        status: canceledSubscription.status,
        currentPeriodStart: canceledSubscription.currentPeriodStart.toISOString(),
        currentPeriodEnd: canceledSubscription.currentPeriodEnd.toISOString(),
        cancelAtPeriodEnd: canceledSubscription.cancelAtPeriodEnd,
        createdAt: canceledSubscription.createdAt.toISOString(),
        updatedAt: canceledSubscription.updatedAt.toISOString(),
        message: "Subscription canceled successfully",
      };

      return createSuccessResponse(subscriptionData);
    } catch (error) {
      logger.error("Error canceling subscription:", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "subscription.errors.cancel_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        { error: parsedError.message },
      );
    }
  }

  /**
   * Sync a Stripe subscription with the local database
   * Used by webhook handlers to keep subscription data in sync
   */
  async syncStripeSubscription(
    stripeSubscription: Stripe.Subscription,
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionPostResponseTypeOutput>> {
    return await syncStripeSubscription(stripeSubscription, userId, logger);
  }

  /**
   * Ensure Stripe customer exists for user
   */
  async ensureStripeCustomer(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      // Get user from database
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user[0]) {
        return createErrorResponse(
          "subscription.errors.user_not_found",
          ErrorResponseTypes.NOT_FOUND,
          { userId },
        );
      }

      // If user already has a Stripe customer ID, return it
      if (user[0].stripeCustomerId) {
        return createSuccessResponse(user[0].stripeCustomerId);
      }

      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user[0].email,
        name: `${user[0].firstName} ${user[0].lastName}`,
        metadata: {
          userId: userId,
        },
      });

      // Update user with Stripe customer ID
      await db
        .update(users)
        .set({ stripeCustomerId: customer.id })
        .where(eq(users.id, userId));

      return createSuccessResponse(customer.id);
    } catch (error) {
      logger.error("Failed to ensure Stripe customer", {
        error: parseError(error),
        userId,
      });
      const parsedError = parseError(error);
      return createErrorResponse(
        "subscription.errors.stripe_customer_creation_failed",
        ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        { userId, error: parsedError.message },
      );
    }
  }
}

// Export singleton instance of the repository
export const subscriptionRepository = new SubscriptionRepositoryImpl();
