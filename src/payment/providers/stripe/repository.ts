/**
 * Stripe Payment Provider Implementation
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import Stripe from "stripe";

import { productsRepository } from "@/products/repository-client";

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

export class StripeProvider implements PaymentProvider {
  private static readonly _stripe = paymentEnv.STRIPE_SECRET_KEY
    ? new Stripe(paymentEnv.STRIPE_SECRET_KEY, {
        apiVersion: "2026-10-28.endive",
      })
    : null;

  /** Returns the Stripe client, or null if STRIPE_SECRET_KEY is not configured */
  static getStripe(): Stripe | null {
    return StripeProvider._stripe;
  }
  name = PaymentProviderEnum.STRIPE;

  async ensureCustomer(
    userId: string,
    email: string,
    name: string | null,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CustomerResult>> {
    const { t } = scopedTranslation.scopedT(locale);
    const stripeClient = StripeProvider.getStripe();
    if (!stripeClient) {
      return fail({
        message: t("errors.notConfigured.title"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    try {
      const [user] = await db
        .select({ stripeCustomerId: users.stripeCustomerId })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        return fail({
          message: t("errors.userNotFound.detail", { userId }),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (user.stripeCustomerId) {
        // Verify the customer exists in Stripe (handles test->prod migration)
        try {
          await stripeClient.customers.retrieve(user.stripeCustomerId);
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
              message: t("errors.customerRetrievalFailed.detail", {
                error: error.message,
                userId,
              }),
              errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
            });
          }
        }
      }

      // Create new customer (either no customer ID or invalid one was cleared)
      const customer = await stripeClient.customers.create({
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
        message: t("errors.customerCreationFailed.detail", {
          error: parseError(error).message,
          userId,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
  }

  async createCheckoutSession(
    params: CheckoutSessionParams,
    customerId: string,
    logger: EndpointLogger,
    callbackToken: string,
    locale: CountryLanguage,
  ): Promise<ResponseType<CheckoutSessionResult>> {
    const { t: tCheckout } = scopedTranslation.scopedT(locale);
    const stripeClient = StripeProvider.getStripe();
    if (!stripeClient) {
      return fail({
        message: tCheckout("errors.notConfigured.title"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
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
      // Packs are priced per unit; charge quantity units so the charge matches
      // the credits granted (metadata.totalCredits = credits * quantity).
      const lineQuantity =
        mode === "payment"
          ? Math.max(1, parseInt(params.metadata.quantity ?? "1", 10) || 1)
          : 1;

      // Create checkout session
      const session = await stripeClient.checkout.sessions.create({
        customer: customerId,
        allowed_payment_method_types: ["card"],
        mode: mode,
        line_items: [
          { price: priceResult.data.priceId, quantity: lineQuantity },
        ],
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
          amount: (product.price * lineQuantity).toFixed(2),
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
            amount: (product.price * lineQuantity).toFixed(2),
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
        message: t("errors.checkoutCreationFailed.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
  }

  async verifyWebhook(
    body: string,
    signature: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): ReturnType<PaymentProvider["verifyWebhook"]> {
    const { t } = scopedTranslation.scopedT(locale);
    const stripeClient = StripeProvider.getStripe();
    if (!stripeClient) {
      return fail({
        message: t("errors.notConfigured.title"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    if (!paymentEnv.STRIPE_WEBHOOK_SECRET) {
      logger.error(
        "Stripe webhook secret is not configured. Please set STRIPE_WEBHOOK_SECRET in your .env file.",
      );
      return fail({
        message: t("errors.webhookVerificationFailed.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
    try {
      const event = stripeClient.webhooks.constructEvent(
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
      if ("currency" in eventData && typeof eventData.currency === "string") {
        webhookData.currency = eventData.currency;
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
            logger.debug(
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
      // Charge / dispute / checkout-session fields (refund + chargeback clawback)
      if ("payment_intent" in eventData) {
        const pi = eventData.payment_intent;
        if (typeof pi === "string" && pi.length > 0) {
          webhookData.payment_intent = pi;
        } else if (
          typeof pi === "object" &&
          pi !== null &&
          "id" in pi &&
          typeof pi.id === "string"
        ) {
          webhookData.payment_intent = pi.id;
        }
      }
      if ("amount" in eventData && typeof eventData.amount === "number") {
        webhookData.amount = eventData.amount;
      }
      if (
        "amount_refunded" in eventData &&
        typeof eventData.amount_refunded === "number"
      ) {
        webhookData.amount_refunded = eventData.amount_refunded;
      }
      if ("charge" in eventData) {
        const charge = eventData.charge;
        if (typeof charge === "string" && charge.length > 0) {
          webhookData.charge = charge;
        } else if (
          typeof charge === "object" &&
          charge !== null &&
          "id" in charge &&
          typeof charge.id === "string"
        ) {
          webhookData.charge = charge.id;
        }
      }
      // Invoice / invoice payment: what was actually paid (renewal commission)
      if (
        "amount_paid" in eventData &&
        typeof eventData.amount_paid === "number"
      ) {
        webhookData.amount_paid = eventData.amount_paid;
      }
      // Checkout session (subscription mode) / invoice payment: the invoice
      if ("invoice" in eventData) {
        const inv = eventData.invoice;
        if (typeof inv === "string" && inv.length > 0) {
          webhookData.invoice = inv;
        } else if (
          typeof inv === "object" &&
          inv !== null &&
          "id" in inv &&
          typeof inv.id === "string"
        ) {
          webhookData.invoice = inv.id;
        }
      }
      // invoice_payment.*: the payment intent sits under payment.payment_intent
      // (invoices themselves no longer carry it since API 2025-03-31)
      if (
        !webhookData.payment_intent &&
        "payment" in eventData &&
        typeof eventData.payment === "object" &&
        eventData.payment !== null &&
        "payment_intent" in eventData.payment
      ) {
        const pi = eventData.payment.payment_intent;
        if (typeof pi === "string" && pi.length > 0) {
          webhookData.payment_intent = pi;
        } else if (
          typeof pi === "object" &&
          pi !== null &&
          "id" in pi &&
          typeof pi.id === "string"
        ) {
          webhookData.payment_intent = pi.id;
        }
      }
      if ("created" in eventData && typeof eventData.created === "number") {
        webhookData.created = eventData.created;
      }
      if ("reason" in eventData && typeof eventData.reason === "string") {
        webhookData.reason = eventData.reason;
      }
      if (
        "parent" in eventData &&
        typeof eventData.parent === "object" &&
        eventData.parent !== null
      ) {
        webhookData.parent = eventData.parent;
        logger.debug("Extracted parent from webhook event", {
          eventType: event.type,
          hasParent: true,
          parentKeys: Object.keys(eventData.parent),
        });
      } else if (
        event.type.startsWith("invoice.") &&
        !event.type.startsWith("invoice_payment.")
      ) {
        // invoice.* events (not invoice_payment.*) are expected to have a parent
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
      return fail({
        message: t("errors.webhookVerificationFailed.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }
  }

  async retrieveSubscription(
    subscriptionId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      userId: string;
      currentPeriodStart?: number;
      currentPeriodEnd?: number;
    }>
  > {
    const { t: tSub } = scopedTranslation.scopedT(locale);
    const stripeClient = StripeProvider.getStripe();
    if (!stripeClient) {
      return fail({
        message: tSub("errors.notConfigured.title"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    try {
      const subscription =
        await stripeClient.subscriptions.retrieve(subscriptionId);

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
        message: t("errors.subscriptionRetrievalFailed.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
  }

  async cancelSubscription(
    subscriptionId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    const { t: tCancel } = scopedTranslation.scopedT(locale);
    const stripeClient = StripeProvider.getStripe();
    if (!stripeClient) {
      return fail({
        message: tCancel("errors.notConfigured.title"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    try {
      await stripeClient.subscriptions.cancel(subscriptionId);

      logger.info("Canceled Stripe subscription", { subscriptionId });

      return success();
    } catch (error) {
      // Stripe SDK errors carry .type/.code (e.g. "resource_missing" = bad
      // subscriptionId on our side vs a transient API/network error) -
      // surface them so the two causes aren't indistinguishable in logs.
      logger.error("Failed to cancel Stripe subscription", {
        error: parseError(error),
        subscriptionId,
        stripeErrorType:
          error instanceof Object ? Reflect.get(error, "type") : undefined,
        stripeErrorCode:
          error instanceof Object ? Reflect.get(error, "code") : undefined,
      });
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.subscriptionCancellationFailed.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
  }
}
