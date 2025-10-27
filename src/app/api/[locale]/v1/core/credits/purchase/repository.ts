/**
 * Credit Purchase Repository
 * Handles Stripe checkout session creation for credit packs
 */

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import Stripe from "stripe";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import { users } from "@/app/api/[locale]/v1/core/user/db";
import { env } from "@/config/env";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  CreditsPurchasePostRequestOutput,
  CreditsPurchasePostResponseOutput,
} from "./definition";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

const PACK_CREDITS = 500;
const PACK_PRICE_CENTS = 500; // €5 = 500 cents

/**
 * Ensure user has a Stripe customer ID
 */
async function ensureStripeCustomer(
  userId: string,
  logger: EndpointLogger,
): Promise<ResponseType<string>> {
  try {
    // Check if user already has a Stripe customer ID
    const [user] = await db
      .select({ stripeCustomerId: users.stripeCustomerId, email: users.email })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.userNotFound",
        ErrorResponseTypes.NOT_FOUND,
        { userId },
      );
    }

    if (user.stripeCustomerId) {
      return createSuccessResponse(user.stripeCustomerId);
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId },
    });

    // Update user with Stripe customer ID
    await db
      .update(users)
      .set({ stripeCustomerId: customer.id })
      .where(eq(users.id, userId));

    logger.info("Created Stripe customer for user", {
      userId,
      customerId: customer.id,
    });

    return createSuccessResponse(customer.id);
  } catch (error) {
    logger.error("Failed to ensure Stripe customer", {
      error: parseError(error),
      userId,
    });
    return createErrorResponse(
      "app.api.v1.core.agent.chat.credits.errors.stripeCustomerFailed",
      ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      { error: parseError(error).message },
    );
  }
}

/**
 * Credit Purchase Repository Interface
 */
export interface CreditPurchaseRepository {
  createCheckoutSession(
    data: CreditsPurchasePostRequestOutput,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditsPurchasePostResponseOutput>>;
}

/**
 * Credit Purchase Repository Implementation
 */
export class CreditPurchaseRepositoryImpl implements CreditPurchaseRepository {
  /**
   * Create a Stripe checkout session for credit pack purchase
   */
  async createCheckoutSession(
    data: CreditsPurchasePostRequestOutput,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditsPurchasePostResponseOutput>> {
    try {
      // Ensure user has a Stripe customer
      const customerResult = await ensureStripeCustomer(userId, logger);
      if (!customerResult.success) {
        return customerResult;
      }
      const stripeCustomerId = customerResult.data;

      const totalCredits = PACK_CREDITS * data.quantity;
      const totalAmount = PACK_PRICE_CENTS * data.quantity;

      logger.info("Creating credit pack checkout session", {
        userId,
        quantity: data.quantity,
        totalCredits,
        totalAmount,
      });

      // Create Stripe checkout session for one-time payment
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        mode: "payment", // One-time payment, not subscription
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                // eslint-disable-next-line i18next/no-literal-string
                name: `${PACK_CREDITS.toString()} Credits Pack`,
                // eslint-disable-next-line i18next/no-literal-string
                description: `${data.quantity.toString()} × ${PACK_CREDITS.toString()} credits = ${totalCredits.toString()} total credits`,
              },
              unit_amount: PACK_PRICE_CENTS,
            },
            quantity: data.quantity,
          },
        ],
        success_url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/chat?credits_purchase=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/subscription?credits_purchase=canceled`,
        metadata: {
          userId,
          type: "credit_pack",
          quantity: data.quantity.toString(),
          totalCredits: totalCredits.toString(),
        },
        allow_promotion_codes: true,
        billing_address_collection: "auto",
        customer_update: {
          address: "auto",
        },
      });

      logger.info("Credit pack checkout session created", {
        sessionId: session.id,
        userId,
        totalAmount,
        totalCredits,
      });

      return createSuccessResponse({
        checkoutUrl: session.url || "",
        sessionId: session.id,
        totalAmount,
        totalCredits,
      });
    } catch (error) {
      logger.error("Failed to create credit pack checkout session", {
        error: parseError(error),
        userId,
        quantity: data.quantity,
      });
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.checkoutFailed",
        ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        { error: parseError(error).message },
      );
    }
  }
}

export const creditPurchaseRepository = new CreditPurchaseRepositoryImpl();
