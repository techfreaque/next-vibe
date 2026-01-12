/**
 * Stripe Payment Provider Implementation
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import Stripe from "stripe";

import { productsRepository } from "@/app/api/[locale]/products/repository-client";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { users } from "../../../user/db";
import { paymentInvoices, paymentTransactions } from "../../db";
import {
  InvoiceStatus,
  PaymentProvider as PaymentProviderEnum,
  PaymentStatus,
} from "../../enum";
import { paymentEnv } from "../../env";
import type {
  CheckoutSessionParams,
  CheckoutSessionResult,
  CustomerResult,
  PaymentProvider,
  WebhookData,
  WebhookEvent,
} from "../types";

// Singleton Stripe instance for direct access (legacy webhook support)
export const stripe = new Stripe(paymentEnv.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
});

export class StripeProvider implements PaymentProvider {
  name = "stripe";

  async ensureCustomer(
    userId: string,
    email: string,
    name: string | null,
    logger: EndpointLogger,
  ) {
    try {
      const [user] = await db
        .select({ stripeCustomerId: users.stripeCustomerId })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        return fail({
          message: "app.api.payment.providers.stripe.errors.userNotFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId },
        });
      }

      if (user.stripeCustomerId) {
        // Verify the customer exists in Stripe (handles test->prod migration)
        try {
          await stripe.customers.retrieve(user.stripeCustomerId);
          return success<CustomerResult>({
            customerId: user.stripeCustomerId,
          });
        } catch (retrieveError) {
          const error = parseError(retrieveError);
          // If customer doesn't exist (e.g., test ID in production), clear it and create new one
          if (
            error.message.includes("No such customer") ||
            error.message.includes("resource_missing")
          ) {
            logger.warn(
              "Invalid Stripe customer ID detected, creating new one",
              {
                userId,
                oldCustomerId: user.stripeCustomerId,
                error: error.message,
              },
            );

            // Clear invalid customer ID
            await db
              .update(users)
              .set({ stripeCustomerId: null })
              .where(eq(users.id, userId));
          } else {
            // Other errors (network, etc.) should be returned as failure
            return fail({
              message:
                "app.api.payment.providers.stripe.errors.customerRetrievalFailed.title",
              errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
              messageParams: { error: error.message, userId },
            });
          }
        }
      }

      // Create new customer (either no customer ID or invalid one was cleared)
      const customer = await stripe.customers.create({
        email,
        name: name || undefined,
        metadata: { userId },
      });

      await db
        .update(users)
        .set({ stripeCustomerId: customer.id })
        .where(eq(users.id, userId));

      logger.debug("Created Stripe customer", {
        userId,
        stripeCustomerId: customer.id,
      });

      return success<CustomerResult>({
        customerId: customer.id,
      });
    } catch (error) {
      logger.error("Failed to ensure Stripe customer", {
        error: parseError(error),
        userId,
      });
      return fail({
        message:
          "app.api.payment.providers.stripe.errors.customerCreationFailed.title",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: parseError(error).message, userId },
      });
    }
  }

  async createCheckoutSession(
    params: CheckoutSessionParams,
    customerId: string,
    logger: EndpointLogger,
    callbackToken: string,
  ) {
    try {
      logger.debug("Creating checkout session", {
        productId: params.productId,
        interval: params.interval,
        country: params.country,
        userId: params.userId,
      });

      // Import dynamic price manager
      const { stripePriceManager } = await import("./prices");

      // Create Stripe price dynamically
      const priceResult = await stripePriceManager.createPrice(
        params.productId,
        params.country,
        params.locale,
        params.interval,
        logger,
      );

      if (!priceResult.success) {
        logger.error("Price creation failed", {
          error: priceResult.message,
          productId: params.productId,
          interval: params.interval,
        });
        return priceResult;
      }

      // Determine mode based on interval
      const mode = params.interval === "one_time" ? "payment" : "subscription";

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        mode: mode,
        line_items: [{ price: priceResult.data.priceId, quantity: 1 }],
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: {
          ...params.metadata,
          // Store provider IDs in metadata for webhook processing
          providerPriceId: priceResult.data.priceId,
          providerProductId: priceResult.data.productId,
        },
        allow_promotion_codes: true,
        billing_address_collection: "auto",
        customer_update: { address: "auto" },
      });

      logger.debug("Created Stripe checkout session", {
        sessionId: session.id,
        userId: params.userId,
        mode,
        interval: params.interval,
      });

      // Always create a payment transaction record for tracking and referral payouts
      const product = productsRepository.getProduct(
        params.productId,
        params.locale,
        params.interval,
      );

      try {
        await db.insert(paymentTransactions).values({
          userId: params.userId,
          providerSessionId: session.id,
          amount: product.price.toFixed(2),
          currency: product.currency,
          status: PaymentStatus.PENDING,
          provider: PaymentProviderEnum.STRIPE,
          mode:
            mode === "payment"
              ? "app.api.payment.enums.checkoutMode.payment"
              : "app.api.payment.enums.checkoutMode.subscription",
          metadata: params.metadata,
        });

        logger.debug("Created payment transaction", {
          sessionId: session.id,
          userId: params.userId,
        });
      } catch (txError) {
        logger.error("Failed to create payment transaction", {
          error: parseError(txError),
          sessionId: session.id,
        });
        // Continue - webhook can still process
      }

      // Store invoice in database with callback token for one-time payments
      if (mode === "payment") {
        try {
          await db.insert(paymentInvoices).values({
            userId: params.userId,
            providerInvoiceId: session.id,
            amount: product.price.toFixed(2),
            currency: product.currency,
            status: InvoiceStatus.DRAFT,
            invoiceUrl: session.url || undefined,
            callbackToken,
            metadata: params.metadata,
          });

          logger.debug("Stored invoice in database", {
            sessionId: session.id,
            userId: params.userId,
            callbackToken: callbackToken.slice(0, 8),
          });
        } catch (dbError) {
          logger.error("Failed to store invoice in database", {
            error: parseError(dbError),
            sessionId: session.id,
          });
          // Continue anyway - webhook can still process the payment
        }
      }

      return success<CheckoutSessionResult>({
        sessionId: session.id,
        checkoutUrl: session.url || "",
        // Return provider IDs so they can be saved with subscription
        providerPriceId: priceResult.data.priceId,
        providerProductId: priceResult.data.productId,
      });
    } catch (error) {
      logger.error("Failed to create Stripe checkout session", {
        error: parseError(error),
        userId: params.userId,
      });
      return fail({
        message:
          "app.api.payment.providers.stripe.errors.checkoutCreationFailed.title",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  async verifyWebhook(body: string, signature: string, logger: EndpointLogger) {
    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        paymentEnv.STRIPE_WEBHOOK_SECRET,
      );

      // Extract common fields from Stripe event data
      const eventData = event.data.object;
      const webhookData: WebhookData = {
        id: "id" in eventData ? String(eventData.id) : event.id,
      };

      // Add optional fields if they exist
      if (
        "metadata" in eventData &&
        typeof eventData.metadata === "object" &&
        eventData.metadata
      ) {
        webhookData.metadata = Object.fromEntries(
          Object.entries(eventData.metadata).map(([k, v]) => [k, String(v)]),
        );
      }
      if ("customer" in eventData) {
        webhookData.customer =
          typeof eventData.customer === "string" ? eventData.customer : null;
      }
      if ("status" in eventData && typeof eventData.status === "string") {
        webhookData.status = eventData.status;
      }
      if (
        "cancel_at_period_end" in eventData &&
        typeof eventData.cancel_at_period_end === "boolean"
      ) {
        webhookData.cancel_at_period_end = eventData.cancel_at_period_end;
      }
      if (
        "current_period_start" in eventData &&
        typeof eventData.current_period_start === "number"
      ) {
        webhookData.current_period_start = eventData.current_period_start;
      }
      if (
        "current_period_end" in eventData &&
        typeof eventData.current_period_end === "number"
      ) {
        webhookData.current_period_end = eventData.current_period_end;
      }
      if (
        "amount_total" in eventData &&
        typeof eventData.amount_total === "number"
      ) {
        webhookData.amount_total = eventData.amount_total;
      }
      if ("subscription" in eventData) {
        webhookData.subscription =
          typeof eventData.subscription === "string"
            ? eventData.subscription
            : undefined;
      }

      return success<WebhookEvent>({
        id: event.id,
        type: event.type,
        data: webhookData,
      });
    } catch (error) {
      logger.error("Failed to verify Stripe webhook", {
        error: parseError(error),
      });
      return fail({
        message:
          "app.api.payment.providers.stripe.errors.webhookVerificationFailed.title",
        errorType: ErrorResponseTypes.BAD_REQUEST,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  async retrieveSubscription(subscriptionId: string, logger: EndpointLogger) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      // In API version 2025-09-30.clover, current_period_end/start were removed from Subscription
      // Use start_date/created for period start and billing_cycle_anchor for the cycle anchor
      // Use start_date if available, otherwise fall back to created timestamp
      const currentPeriodStart =
        subscription.start_date || subscription.created;

      // Calculate currentPeriodEnd based on billing interval
      // billing_cycle_anchor is the start of the billing cycle, not the end
      // We need to add the interval duration to get the period end
      const billingInterval =
        subscription.items.data[0]?.plan.interval || "month";
      const intervalCount =
        subscription.items.data[0]?.plan.interval_count || 1;

      // Calculate period end by adding the interval to period start
      const periodStartDate = new Date(currentPeriodStart * 1000);
      let periodEndDate: Date;

      if (billingInterval === "month") {
        periodEndDate = new Date(periodStartDate);
        periodEndDate.setMonth(periodEndDate.getMonth() + intervalCount);
      } else if (billingInterval === "year") {
        periodEndDate = new Date(periodStartDate);
        periodEndDate.setFullYear(periodEndDate.getFullYear() + intervalCount);
      } else if (billingInterval === "week") {
        periodEndDate = new Date(periodStartDate);
        periodEndDate.setDate(periodEndDate.getDate() + 7 * intervalCount);
      } else if (billingInterval === "day") {
        periodEndDate = new Date(periodStartDate);
        periodEndDate.setDate(periodEndDate.getDate() + intervalCount);
      } else {
        // Default to 1 month if interval is unknown
        periodEndDate = new Date(periodStartDate);
        periodEndDate.setMonth(periodEndDate.getMonth() + 1);
      }

      const currentPeriodEnd = Math.floor(periodEndDate.getTime() / 1000);

      logger.debug("Retrieved Stripe subscription", {
        subscriptionId,
        currentPeriodStart,
        currentPeriodStartMs: currentPeriodStart * 1000,
        currentPeriodEnd,
        currentPeriodEndMs: currentPeriodEnd * 1000,
        billingInterval,
        intervalCount,
      });

      return success({
        userId: subscription.metadata?.userId || "",
        currentPeriodStart: currentPeriodStart * 1000, // Convert to milliseconds
        currentPeriodEnd: currentPeriodEnd * 1000, // Convert to milliseconds
      });
    } catch (error) {
      logger.error("Failed to retrieve Stripe subscription", {
        error: parseError(error),
        subscriptionId,
      });
      return fail({
        message:
          "app.api.payment.providers.stripe.errors.subscriptionRetrievalFailed.title",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  async cancelSubscription(subscriptionId: string, logger: EndpointLogger) {
    try {
      await stripe.subscriptions.cancel(subscriptionId);

      logger.info("Canceled Stripe subscription", { subscriptionId });

      return success();
    } catch (error) {
      logger.error("Failed to cancel Stripe subscription", {
        error: parseError(error),
        subscriptionId,
      });
      return fail({
        message:
          "app.api.payment.providers.stripe.errors.subscriptionCancellationFailed.title",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
