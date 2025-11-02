/**
 * Subscription Repository
 * Business logic for subscription operations - provider-agnostic
 */

import "server-only";

import { desc, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import type Stripe from "stripe";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { getPaymentProvider } from "../payment/providers";
import type { NewSubscription } from "./db";
import { subscriptions } from "./db";
import type {
  SubscriptionDeleteRequestOutput,
  SubscriptionGetResponseOutput,
  SubscriptionPostRequestOutput,
  SubscriptionPostResponseOutput,
  SubscriptionPutRequestOutput,
  SubscriptionPutResponseOutput,
} from "./definition";
import type { BillingIntervalDB, SubscriptionPlanDB } from "./enum";
import { SubscriptionStatus } from "./enum";

/**
 * Subscription Repository Interface
 */
export interface SubscriptionRepository {
  getSubscription(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionGetResponseOutput>>;

  createSubscription(
    data: SubscriptionPostRequestOutput,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionPostResponseOutput>>;

  updateSubscription(
    data: SubscriptionPutRequestOutput,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionPutResponseOutput>>;

  cancelSubscription(
    data: SubscriptionDeleteRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ success: boolean; message: string }>>;
}

/**
 * Subscription Repository Implementation
 */
export class SubscriptionRepositoryImpl implements SubscriptionRepository {
  async getSubscription(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionGetResponseOutput>> {
    try {
      const results = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .orderBy(desc(subscriptions.createdAt))
        .limit(1);

      if (results.length === 0) {
        return createErrorResponse(
          "app.api.v1.core.subscription.errors.not_found",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      const subscription = results[0];
      return createSuccessResponse({
        id: subscription.id,
        userId: subscription.userId,
        plan: subscription.planId,
        billingInterval: subscription.billingInterval,
        status: subscription.status,
        currentPeriodStart:
          subscription.currentPeriodStart?.toISOString() ||
          new Date().toISOString(),
        currentPeriodEnd:
          subscription.currentPeriodEnd?.toISOString() ||
          new Date().toISOString(),
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        createdAt: subscription.createdAt.toISOString(),
        updatedAt: subscription.updatedAt.toISOString(),
      });
    } catch (error) {
      logger.error("Error getting subscription:", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.subscription.errors.database_error",
        ErrorResponseTypes.DATABASE_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  async createSubscription(
    _data: SubscriptionPostRequestOutput,
    _userId: string,
    _locale: CountryLanguage,
    _logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionPostResponseOutput>> {
    // This should be called from checkout flow after payment provider confirms
    return createErrorResponse(
      "app.api.v1.core.subscription.errors.use_checkout_flow",
      ErrorResponseTypes.BAD_REQUEST,
      {},
    );
  }

  async updateSubscription(
    data: SubscriptionPutRequestOutput,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionPutResponseOutput>> {
    try {
      const currentSubscription = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .limit(1);

      if (!currentSubscription[0]) {
        return createErrorResponse(
          "app.api.v1.core.subscription.errors.not_found",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

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
          "app.api.v1.core.subscription.errors.not_found",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      const updatedSubscription = results[0];
      return createSuccessResponse({
        id: updatedSubscription.id,
        userId: updatedSubscription.userId,
        responsePlan: updatedSubscription.planId,
        responseBillingInterval: updatedSubscription.billingInterval,
        status: updatedSubscription.status,
        currentPeriodStart:
          updatedSubscription.currentPeriodStart?.toISOString() ||
          new Date().toISOString(),
        currentPeriodEnd:
          updatedSubscription.currentPeriodEnd?.toISOString() ||
          new Date().toISOString(),
        responseCancelAtPeriodEnd: updatedSubscription.cancelAtPeriodEnd,
        createdAt: updatedSubscription.createdAt.toISOString(),
        updatedAt: updatedSubscription.updatedAt.toISOString(),
        message: "app.api.v1.core.subscription.update.success",
      });
    } catch (error) {
      logger.error("Error updating subscription:", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.subscription.errors.database_error",
        ErrorResponseTypes.DATABASE_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  async cancelSubscription(
    data: SubscriptionDeleteRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ success: boolean; message: string }>> {
    try {
      const { t } = simpleT(locale);

      const currentSubscription = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .limit(1);

      if (!currentSubscription[0]) {
        return createErrorResponse(
          "app.api.v1.core.subscription.errors.not_found",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      const subscription = currentSubscription[0];

      // If has provider subscription ID, cancel with provider
      if (subscription.providerSubscriptionId) {
        const provider = getPaymentProvider(subscription.provider || "stripe");
        const cancelResult = await provider.cancelSubscription(
          subscription.providerSubscriptionId,
          logger,
        );

        if (!cancelResult.success) {
          return cancelResult;
        }
      }

      // Update local database
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
          "app.api.v1.core.subscription.errors.not_found",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse({
        success: true,
        message: t("app.api.v1.core.subscription.cancel.success"),
      });
    } catch (error) {
      logger.error("Error canceling subscription:", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.subscription.errors.cancel_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Handle subscription checkout webhook from payment provider
   * Called by payment repository when checkout.session.completed webhook received
   */
  async handleSubscriptionCheckout(
    session: Stripe.Checkout.Session,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;
      const billingInterval = session.metadata?.billingInterval;
      const providerSubscriptionId = session.subscription as string;

      if (!userId || !planId || !billingInterval) {
        logger.error("Missing required metadata in checkout session", {
          sessionId: session.id,
          userId,
          planId,
          billingInterval,
        });
        return;
      }

      const providerName = session.metadata?.provider || "stripe";
      const provider = getPaymentProvider(providerName);
      const subscriptionResult = await provider.retrieveSubscription(
        providerSubscriptionId,
        logger,
      );

      if (!subscriptionResult.success) {
        logger.error("Failed to retrieve subscription from provider", {
          providerSubscriptionId,
          error: subscriptionResult.message,
        });
        return;
      }

      await db
        .insert(subscriptions)
        .values({
          userId: userId as string,
          planId: planId as (typeof SubscriptionPlanDB)[number],
          billingInterval: billingInterval as (typeof BillingIntervalDB)[number],
          status: SubscriptionStatus.ACTIVE,
          provider: providerName,
          providerSubscriptionId,
          currentPeriodStart: new Date(),
          currentPeriodEnd: subscriptionResult.data.currentPeriodEnd
            ? new Date(subscriptionResult.data.currentPeriodEnd)
            : null,
        })
        .onConflictDoUpdate({
          target: subscriptions.userId,
          set: {
            status: SubscriptionStatus.ACTIVE,
            providerSubscriptionId,
            currentPeriodStart: new Date(),
            currentPeriodEnd: subscriptionResult.data.currentPeriodEnd
              ? new Date(subscriptionResult.data.currentPeriodEnd)
              : null,
            updatedAt: new Date(),
          },
        });

      // Add subscription credits
      const { creditRepository } = await import("../credits/repository");
      const { productsRepository, ProductIds } = await import("../products/repository-client");

      // Map subscription plan to product ID
      const productId = planId === SubscriptionPlan.SUBSCRIPTION
        ? ProductIds.SUBSCRIPTION
        : null;

      if (productId) {
        const product = productsRepository.getProduct(productId, "en-GLOBAL");
        await creditRepository.addUserCredits(
          userId as string,
          product.credits,
          "subscription",
          logger,
        );
        logger.debug("Added subscription credits", {
          userId,
          credits: product.credits,
        });
      }

      logger.debug("Subscription checkout processed successfully", {
        userId,
        providerSubscriptionId,
      });
    } catch (error) {
      logger.error("Failed to process subscription checkout", {
        error: parseError(error),
        sessionId: session.id,
      });
    }
  }

  /**
   * Handle invoice payment succeeded webhook from payment provider
   * Called by payment repository when invoice.payment_succeeded webhook received
   */
  async handleInvoicePaymentSucceeded(
    _invoice: Stripe.Invoice,
    subscriptionId: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.providerSubscriptionId, subscriptionId))
        .limit(1);

      if (!subscription) {
        logger.error("Subscription not found for invoice payment", {
          subscriptionId,
        });
        return;
      }

      const providerName = subscription.provider || "stripe";
      const provider = getPaymentProvider(providerName);
      const subscriptionResult = await provider.retrieveSubscription(
        subscriptionId,
        logger,
      );

      if (!subscriptionResult.success) {
        logger.error("Failed to retrieve subscription from provider", {
          subscriptionId,
          error: subscriptionResult.message,
        });
        return;
      }

      await db
        .update(subscriptions)
        .set({
          currentPeriodStart: new Date(),
          currentPeriodEnd: subscriptionResult.data.currentPeriodEnd
            ? new Date(subscriptionResult.data.currentPeriodEnd)
            : undefined,
          status: SubscriptionStatus.ACTIVE,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.providerSubscriptionId, subscriptionId));

      logger.debug("Invoice payment processed successfully", {
        subscriptionId,
      });
    } catch (error) {
      logger.error("Failed to process invoice payment", {
        error: parseError(error),
        subscriptionId,
      });
    }
  }
}

export const subscriptionRepository = new SubscriptionRepositoryImpl();
