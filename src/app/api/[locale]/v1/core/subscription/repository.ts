/**
 * Subscription Repository
 * Business logic for subscription operations - provider-agnostic
 */

import "server-only";

import { desc, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import type Stripe from "stripe";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { getPaymentProvider } from "../payment/providers";
import { stripe as getStripe } from "../payment/providers/stripe/repository";
import type { WebhookData } from "../payment/providers/types";
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
import type {
  SubscriptionStatusValue,
  BillingIntervalDB,
  SubscriptionPlanDB,
} from "./enum";
import { SubscriptionPlan, SubscriptionStatus } from "./enum";
import { PaymentProvider, type PaymentProviderValue } from "../payment/enum";

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
        return fail({
          message: "app.api.v1.core.subscription.errors.not_found",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const subscription = results[0];
      return success({
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
        cancelAt: subscription.cancelAt?.toISOString(),
        provider: subscription.provider,
        providerSubscriptionId:
          subscription.providerSubscriptionId || undefined,
        createdAt: subscription.createdAt.toISOString(),
        updatedAt: subscription.updatedAt.toISOString(),
      });
    } catch (error) {
      logger.error("Error getting subscription:", parseError(error));
      return fail({
        message: "app.api.v1.core.subscription.errors.database_error",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  async createSubscription(
    _data: SubscriptionPostRequestOutput,
    _userId: string,
    _locale: CountryLanguage,
    _logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionPostResponseOutput>> {
    // This should be called from checkout flow after payment provider confirms
    return fail({
      message: "app.api.v1.core.subscription.errors.use_checkout_flow",
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
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
        return fail({
          message: "app.api.v1.core.subscription.errors.not_found",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
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
        return fail({
          message: "app.api.v1.core.subscription.errors.not_found",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const updatedSubscription = results[0];
      return success({
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
      return fail({
        message: "app.api.v1.core.subscription.errors.database_error",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parseError(error).message },
      });
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
        return fail({
          message: "app.api.v1.core.subscription.errors.not_found",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
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
        return fail({
          message: "app.api.v1.core.subscription.errors.not_found",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({
        success: true,
        message: t("app.api.v1.core.subscription.cancel.success"),
      });
    } catch (error) {
      logger.error("Error canceling subscription:", parseError(error));
      return fail({
        message: "app.api.v1.core.subscription.errors.cancel_failed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Handle subscription checkout webhook from payment provider
   * Called by payment repository when checkout.session.completed webhook received
   */
  async handleSubscriptionCheckout(
    session: WebhookData,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;
      const billingInterval = session.metadata?.billingInterval;
      const providerSubscriptionId = session.subscription;

      if (!userId || !planId || !billingInterval) {
        logger.error("Missing required metadata in checkout session", {
          sessionId: session.id,
          userId,
          planId,
          billingInterval,
        });
        return;
      }

      if (!providerSubscriptionId) {
        logger.error("Missing provider subscription ID", {
          sessionId: session.id,
        });
        return;
      }

      const providerEnum =
        (session.metadata?.provider as typeof PaymentProviderValue) ||
        PaymentProvider.STRIPE;
      const providerKey =
        providerEnum === PaymentProvider.NOWPAYMENTS ? "nowpayments" : "stripe";
      const provider = getPaymentProvider(providerKey);
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
          billingInterval:
            billingInterval as (typeof BillingIntervalDB)[number],
          status: SubscriptionStatus.ACTIVE,
          provider: providerEnum,
          providerSubscriptionId,
          currentPeriodStart: subscriptionResult.data.currentPeriodStart
            ? new Date(subscriptionResult.data.currentPeriodStart)
            : new Date(),
          currentPeriodEnd: subscriptionResult.data.currentPeriodEnd
            ? new Date(subscriptionResult.data.currentPeriodEnd)
            : null,
        })
        .onConflictDoUpdate({
          target: subscriptions.userId,
          set: {
            status: SubscriptionStatus.ACTIVE,
            providerSubscriptionId,
            currentPeriodStart: subscriptionResult.data.currentPeriodStart
              ? new Date(subscriptionResult.data.currentPeriodStart)
              : new Date(),
            currentPeriodEnd: subscriptionResult.data.currentPeriodEnd
              ? new Date(subscriptionResult.data.currentPeriodEnd)
              : null,
            updatedAt: new Date(),
          },
        });

      // Add subscription credits with expiration date
      const { creditRepository } = await import("../credits/repository");
      const { productsRepository, ProductIds } =
        await import("../products/repository-client");

      // Map subscription plan to product ID
      const productId =
        planId === SubscriptionPlan.SUBSCRIPTION
          ? ProductIds.SUBSCRIPTION
          : null;

      if (productId) {
        const product = productsRepository.getProduct(productId, "en-GLOBAL");
        const expiresAt = subscriptionResult.data.currentPeriodEnd
          ? new Date(subscriptionResult.data.currentPeriodEnd)
          : null;

        await creditRepository.addUserCredits(
          userId as string,
          product.credits,
          "subscription",
          logger,
          expiresAt ?? undefined,
        );
        logger.debug("Added subscription credits", {
          userId,
          credits: product.credits,
          expiresAt: expiresAt?.toISOString(),
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
    invoice: WebhookData,
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

      // Update subscription period
      await db
        .update(subscriptions)
        .set({
          currentPeriodStart: subscriptionResult.data.currentPeriodStart
            ? new Date(subscriptionResult.data.currentPeriodStart)
            : new Date(),
          currentPeriodEnd: subscriptionResult.data.currentPeriodEnd
            ? new Date(subscriptionResult.data.currentPeriodEnd)
            : undefined,
          status: SubscriptionStatus.ACTIVE,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.providerSubscriptionId, subscriptionId));

      // Add monthly credits for renewal (skip if this is the first payment - handled by checkout)
      // Check if this is a renewal by looking at billing_reason
      const billingReason = (
        invoice as Stripe.Invoice & { billing_reason?: string }
      ).billing_reason;

      if (
        billingReason === "subscription_cycle" ||
        billingReason === "subscription_update"
      ) {
        // This is a renewal - add monthly credits with expiration
        const { creditRepository } = await import("../credits/repository");
        const { productsRepository, ProductIds } =
          await import("../products/repository-client");

        const productId =
          subscription.planId === SubscriptionPlan.SUBSCRIPTION
            ? ProductIds.SUBSCRIPTION
            : null;

        if (productId) {
          const product = productsRepository.getProduct(productId, "en-GLOBAL");
          const expiresAt = subscriptionResult.data.currentPeriodEnd
            ? new Date(subscriptionResult.data.currentPeriodEnd)
            : null;

          await creditRepository.addUserCredits(
            subscription.userId,
            product.credits,
            "subscription",
            logger,
            expiresAt ?? undefined,
          );
          logger.debug("Added renewal credits", {
            userId: subscription.userId,
            credits: product.credits,
            expiresAt: expiresAt?.toISOString(),
            billingReason,
          });
        }
      }

      logger.debug("Invoice payment processed successfully", {
        subscriptionId,
        billingReason,
      });
    } catch (error) {
      logger.error("Failed to process invoice payment", {
        error: parseError(error),
        subscriptionId,
      });
    }
  }

  /**
   * Handle subscription cancellation
   * Called when customer.subscription.deleted webhook is received
   */
  async handleSubscriptionCanceled(
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
        logger.error("Subscription not found for cancellation", {
          subscriptionId,
        });
        return;
      }

      // Mark subscription as canceled
      await db
        .update(subscriptions)
        .set({
          status: SubscriptionStatus.CANCELED,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.providerSubscriptionId, subscriptionId));

      logger.debug("Subscription canceled successfully", {
        subscriptionId,
        userId: subscription.userId,
      });
    } catch (error) {
      logger.error("Failed to process subscription cancellation", {
        error: parseError(error),
        subscriptionId,
      });
    }
  }

  /**
   * Handle subscription update
   * Called when customer.subscription.updated webhook is received
   */
  async handleSubscriptionUpdated(
    stripeSubscription: Stripe.Subscription,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.providerSubscriptionId, stripeSubscription.id))
        .limit(1);

      if (!subscription) {
        logger.error("Subscription not found for update", {
          subscriptionId: stripeSubscription.id,
        });
        return;
      }

      // Fetch full subscription from Stripe to get all fields (webhook events may not include all fields)
      const fullSubscription = await getStripe.subscriptions.retrieve(
        stripeSubscription.id,
      );

      // Map Stripe status to our status
      let status: typeof SubscriptionStatusValue;
      switch (fullSubscription.status) {
        case "active":
          status = SubscriptionStatus.ACTIVE;
          break;
        case "canceled":
          status = SubscriptionStatus.CANCELED;
          break;
        case "past_due":
        case "unpaid":
          status = SubscriptionStatus.PAST_DUE;
          break;
        case "incomplete":
        case "incomplete_expired":
        case "trialing":
        case "paused":
        default:
          status = SubscriptionStatus.ACTIVE; // Default to active for unknown states
          break;
      }

      // Update subscription
      await db
        .update(subscriptions)
        .set({
          status,
          cancelAtPeriodEnd: fullSubscription.cancel_at_period_end,
          cancelAt: fullSubscription.cancel_at
            ? new Date(fullSubscription.cancel_at * 1000)
            : null,
          // Note: Stripe.Subscription doesn't have current_period_start/end in the type definition
          // These would need to be retrieved from the latest invoice or billing cycle
          currentPeriodStart: undefined,
          currentPeriodEnd: undefined,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.providerSubscriptionId, fullSubscription.id));

      logger.debug("Subscription updated successfully", {
        subscriptionId: fullSubscription.id,
        status,
        cancelAtPeriodEnd: fullSubscription.cancel_at_period_end,
        cancelAt: fullSubscription.cancel_at,
      });
    } catch (error) {
      logger.error("Failed to process subscription update", {
        error: parseError(error),
        subscriptionId: stripeSubscription.id,
      });
    }
  }
}

export const subscriptionRepository = new SubscriptionRepositoryImpl();
