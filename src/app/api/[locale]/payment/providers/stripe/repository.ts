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
import type { CountryLanguage } from "@/i18n/core/config";

import { users } from "../../../user/db";
import { paymentInvoices, paymentTransactions } from "../../db";
import {
  CheckoutMode,
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
import { scopedTranslation } from "./i18n";

// Singleton Stripe instance for direct access (legacy webhook support)
export const stripe = new Stripe(paymentEnv.STRIPE_SECRET_KEY, {
  apiVersion: "2026-02-25.clover",
});

export class StripeProvider implements PaymentProvider {
  name = "stripe";

  async ensureCustomer(
    userId: string,
    email: string,
    name: string | null,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ) {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [user] = await db
        .select({ stripeCustomerId: users.stripeCustomerId })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        return fail({
          message: t("errors.userNotFound.title"),
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
              message: t("errors.customerRetrievalFailed.title"),
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
        message: t("errors.customerCreationFailed.title"),
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
    locale: CountryLanguage,
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
              ? CheckoutMode.PAYMENT
              : CheckoutMode.SUBSCRIPTION,
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
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.checkoutCreationFailed.title"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  async verifyWebhook(
    body: string,
    signature: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ) {
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
        const cust = eventData.customer;
        if (typeof cust === "string") {
          webhookData.customer = cust;
        } else if (
          typeof cust === "object" &&
          cust !== null &&
          "id" in cust &&
          typeof cust.id === "string"
        ) {
          webhookData.customer = cust.id;
        } else {
          webhookData.customer = null;
        }
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
      // Extract subscription ID: try direct field first, then parent.subscription_details
      // (Stripe API 2025-03-31+ deprecated `subscription` on Invoice in favor of `parent`)
      if ("subscription" in eventData) {
        const sub = eventData.subscription;
        if (typeof sub === "string" && sub.length > 0) {
          webhookData.subscription = sub;
        } else if (
          typeof sub === "object" &&
          sub !== null &&
          "id" in sub &&
          typeof sub.id === "string"
        ) {
          webhookData.subscription = sub.id;
        }
      }
      // Fallback: extract from parent.subscription_details (Stripe API 2025-03-31+ invoices)
      if (!webhookData.subscription && "parent" in eventData) {
        const parent = eventData.parent;
        if (
          typeof parent === "object" &&
          parent !== null &&
          "subscription_details" in parent
        ) {
          const details = parent.subscription_details;
          if (
            typeof details === "object" &&
            details !== null &&
            "subscription" in details &&
            typeof details.subscription === "string" &&
            details.subscription.length > 0
          ) {
            webhookData.subscription = details.subscription;
            logger.info(
              "Extracted subscription from parent.subscription_details",
              {
                subscription: details.subscription,
                eventType: event.type,
              },
            );
          }
        }
      }
      if (
        "billing_reason" in eventData &&
        typeof eventData.billing_reason === "string"
      ) {
        webhookData.billing_reason = eventData.billing_reason;
      }
      if (
        "parent" in eventData &&
        typeof eventData.parent === "object" &&
        eventData.parent !== null
      ) {
        webhookData.parent = eventData.parent;
        logger.info("Extracted parent from webhook event", {
          eventType: event.type,
          hasParent: true,
          parentKeys: Object.keys(eventData.parent),
        });
      } else if (event.type.includes("invoice")) {
        logger.warn("No parent in invoice event", {
          eventType: event.type,
          eventDataKeys: Object.keys(eventData),
        });
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
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.webhookVerificationFailed.title"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  async retrieveSubscription(
    subscriptionId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      // Prefer actual period dates from subscription item (most accurate, available in 2025-12-15.clover)
      const item = subscription.items.data[0];
      let currentPeriodStart: number;
      let currentPeriodEnd: number;

      if (item?.current_period_start && item?.current_period_end) {
        currentPeriodStart = item.current_period_start;
        currentPeriodEnd = item.current_period_end;
      } else {
        // Fallback: Calculate current period from billing_cycle_anchor + interval
        // billing_cycle_anchor advances with each renewal cycle
        const anchor =
          subscription.billing_cycle_anchor ||
          subscription.start_date ||
          subscription.created;
        const billingInterval = item?.plan.interval || "month";
        const intervalCount = item?.plan.interval_count || 1;

        // Find the current period by advancing from anchor until we pass now
        const now = Math.floor(Date.now() / 1000);
        let periodStart = anchor;
        let periodEnd = anchor;

        // Advance period-by-period until we find the one containing "now"
        for (let i = 0; i < 120; i++) {
          const d = new Date(periodEnd * 1000);
          if (billingInterval === "month") {
            d.setMonth(d.getMonth() + intervalCount);
          } else if (billingInterval === "year") {
            d.setFullYear(d.getFullYear() + intervalCount);
          } else if (billingInterval === "week") {
            d.setDate(d.getDate() + 7 * intervalCount);
          } else if (billingInterval === "day") {
            d.setDate(d.getDate() + intervalCount);
          } else {
            d.setMonth(d.getMonth() + 1);
          }
          const nextEnd = Math.floor(d.getTime() / 1000);

          if (nextEnd > now) {
            periodStart = periodEnd;
            periodEnd = nextEnd;
            break;
          }
          periodEnd = nextEnd;
        }

        currentPeriodStart = periodStart;
        currentPeriodEnd = periodEnd;
      }

      logger.debug("Retrieved Stripe subscription", {
        subscriptionId,
        currentPeriodStart,
        currentPeriodEnd,
        usedItemPeriod: !!(
          item?.current_period_start && item?.current_period_end
        ),
      });

      return success({
        userId: subscription.metadata?.userId || "",
        currentPeriodStart: currentPeriodStart * 1000,
        currentPeriodEnd: currentPeriodEnd * 1000,
      });
    } catch (error) {
      logger.error("Failed to retrieve Stripe subscription", {
        error: parseError(error),
        subscriptionId,
      });
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.subscriptionRetrievalFailed.title"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  async cancelSubscription(
    subscriptionId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ) {
    try {
      await stripe.subscriptions.cancel(subscriptionId);

      logger.info("Canceled Stripe subscription", { subscriptionId });

      return success();
    } catch (error) {
      logger.error("Failed to cancel Stripe subscription", {
        error: parseError(error),
        subscriptionId,
      });
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.subscriptionCancellationFailed.title"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
