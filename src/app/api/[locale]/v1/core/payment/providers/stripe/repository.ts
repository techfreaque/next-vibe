/**
 * Stripe Payment Provider Implementation
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import Stripe from "stripe";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import { env } from "@/config/env";

import { users } from "../../../user/db";
import type {
  CheckoutSessionParams,
  CheckoutSessionResult,
  CustomerResult,
  PaymentProvider,
  WebhookEvent,
} from "../types";

// Singleton Stripe instance for direct access (legacy webhook support)
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

export class StripeProvider implements PaymentProvider {
  name = "stripe";
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-09-30.clover",
    });
  }

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
        return createErrorResponse(
          "app.api.v1.core.payment.providers.stripe.errors.userNotFound.title",
          ErrorResponseTypes.NOT_FOUND,
          { userId },
        );
      }

      if (user.stripeCustomerId) {
        return createSuccessResponse<CustomerResult>({
          customerId: user.stripeCustomerId,
        });
      }

      const customer = await this.stripe.customers.create({
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

      return createSuccessResponse<CustomerResult>({
        customerId: customer.id,
      });
    } catch (error) {
      logger.error("Failed to ensure Stripe customer", {
        error: parseError(error),
        userId,
      });
      return createErrorResponse(
        "app.api.v1.core.payment.providers.stripe.errors.customerCreationFailed.title",
        ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        { error: parseError(error).message, userId },
      );
    }
  }

  async createCheckoutSession(
    params: CheckoutSessionParams,
    customerId: string,
    logger: EndpointLogger,
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
      const session = await this.stripe.checkout.sessions.create({
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

      return createSuccessResponse<CheckoutSessionResult>({
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
      return createErrorResponse(
        "app.api.v1.core.payment.providers.stripe.errors.checkoutCreationFailed.title",
        ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  async verifyWebhook(body: string, signature: string, logger: EndpointLogger) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET,
      );

      return createSuccessResponse<WebhookEvent>({
        id: event.id,
        type: event.type,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: event.data.object as any,
      });
    } catch (error) {
      logger.error("Failed to verify Stripe webhook", {
        error: parseError(error),
      });
      return createErrorResponse(
        "app.api.v1.core.payment.providers.stripe.errors.webhookVerificationFailed.title",
        ErrorResponseTypes.BAD_REQUEST,
        { error: parseError(error).message },
      );
    }
  }

  async retrieveSubscription(subscriptionId: string, logger: EndpointLogger) {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(
        subscriptionId,
      );

      // In API version 2025-09-30.clover, current_period_end/start were removed from Subscription
      // Use billing_cycle_anchor or retrieve from latest_invoice instead
      const currentPeriodEnd = subscription.billing_cycle_anchor;

      logger.debug("Retrieved Stripe subscription", {
        subscriptionId,
        billingCycleAnchor: currentPeriodEnd,
        billingCycleAnchorMs: currentPeriodEnd * 1000,
      });

      return createSuccessResponse({
        userId: subscription.metadata?.userId || "",
        currentPeriodEnd: currentPeriodEnd * 1000, // Convert to milliseconds
      });
    } catch (error) {
      logger.error("Failed to retrieve Stripe subscription", {
        error: parseError(error),
        subscriptionId,
      });
      return createErrorResponse(
        "app.api.v1.core.payment.providers.stripe.errors.subscriptionRetrievalFailed.title",
        ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  async cancelSubscription(subscriptionId: string, logger: EndpointLogger) {
    try {
      await this.stripe.subscriptions.cancel(subscriptionId);

      logger.info("Canceled Stripe subscription", { subscriptionId });

      return createSuccessResponse(undefined);
    } catch (error) {
      logger.error("Failed to cancel Stripe subscription", {
        error: parseError(error),
        subscriptionId,
      });
      return createErrorResponse(
        "app.api.v1.core.payment.providers.stripe.errors.subscriptionCancellationFailed.title",
        ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        { error: parseError(error).message },
      );
    }
  }
}
