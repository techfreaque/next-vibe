/**
 * Subscription Checkout Repository
 * Production-ready Stripe subscription checkout implementation
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import Stripe from "stripe";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import { env } from "@/config/env";
import { envClient } from "@/config/env-client";
import type { CountryLanguage,Countries } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { EndpointLogger } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "../../user/auth/definition";
import { users } from "../../user/db";
import type { BillingIntervalValue, SubscriptionPlanValue } from "../enum";
import { BillingInterval, SubscriptionPlan } from "../enum";
import type {
  CheckoutRequestOutput,
  CheckoutResponseOutput,
} from "./definition";

// Initialize Stripe
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

// Production Stripe Price IDs from environment variables with regionalization
export const STRIPE_PRICE_IDS = {
  DE: {
    [BillingInterval.MONTHLY]: {
      [SubscriptionPlan.STARTER]:
        env.STRIPE_STARTER_MONTHLY_DE_PRICE_ID ||
        "price_starter_monthly_de_dev",
      [SubscriptionPlan.PROFESSIONAL]:
        env.STRIPE_PROFESSIONAL_MONTHLY_DE_PRICE_ID ||
        "price_professional_monthly_de_dev",
      [SubscriptionPlan.PREMIUM]:
        env.STRIPE_PREMIUM_MONTHLY_DE_PRICE_ID ||
        "price_premium_monthly_de_dev",
    },
    [BillingInterval.YEARLY]: {
      [SubscriptionPlan.STARTER]:
        env.STRIPE_STARTER_YEARLY_DE_PRICE_ID || "price_starter_yearly_de_dev",
      [SubscriptionPlan.PROFESSIONAL]:
        env.STRIPE_PROFESSIONAL_YEARLY_DE_PRICE_ID ||
        "price_professional_yearly_de_dev",
      [SubscriptionPlan.PREMIUM]:
        env.STRIPE_PREMIUM_YEARLY_DE_PRICE_ID || "price_premium_yearly_de_dev",
    },
  },
  PL: {
    [BillingInterval.MONTHLY]: {
      [SubscriptionPlan.STARTER]:
        env.STRIPE_STARTER_MONTHLY_PL_PRICE_ID ||
        "price_starter_monthly_pl_dev",
      [SubscriptionPlan.PROFESSIONAL]:
        env.STRIPE_PROFESSIONAL_MONTHLY_PL_PRICE_ID ||
        "price_professional_monthly_pl_dev",
      [SubscriptionPlan.PREMIUM]:
        env.STRIPE_PREMIUM_MONTHLY_PL_PRICE_ID ||
        "price_premium_monthly_pl_dev",
    },
    [BillingInterval.YEARLY]: {
      [SubscriptionPlan.STARTER]:
        env.STRIPE_STARTER_YEARLY_PL_PRICE_ID || "price_starter_yearly_pl_dev",
      [SubscriptionPlan.PROFESSIONAL]:
        env.STRIPE_PROFESSIONAL_YEARLY_PL_PRICE_ID ||
        "price_professional_yearly_pl_dev",
      [SubscriptionPlan.PREMIUM]:
        env.STRIPE_PREMIUM_YEARLY_PL_PRICE_ID || "price_premium_yearly_pl_dev",
    },
  },
  GLOBAL: {
    [BillingInterval.MONTHLY]: {
      [SubscriptionPlan.STARTER]:
        env.STRIPE_STARTER_MONTHLY_GLOBAL_PRICE_ID ||
        "price_starter_monthly_global_dev",
      [SubscriptionPlan.PROFESSIONAL]:
        env.STRIPE_PROFESSIONAL_MONTHLY_GLOBAL_PRICE_ID ||
        "price_professional_monthly_global_dev",
      [SubscriptionPlan.PREMIUM]:
        env.STRIPE_PREMIUM_MONTHLY_GLOBAL_PRICE_ID ||
        "price_premium_monthly_global_dev",
    },
    [BillingInterval.YEARLY]: {
      [SubscriptionPlan.STARTER]:
        env.STRIPE_STARTER_YEARLY_GLOBAL_PRICE_ID ||
        "price_starter_yearly_global_dev",
      [SubscriptionPlan.PROFESSIONAL]:
        env.STRIPE_PROFESSIONAL_YEARLY_GLOBAL_PRICE_ID ||
        "price_professional_yearly_global_dev",
      [SubscriptionPlan.PREMIUM]:
        env.STRIPE_PREMIUM_YEARLY_GLOBAL_PRICE_ID ||
        "price_premium_yearly_global_dev",
    },
  },
};

/**
 * Helper function to extract country from locale
 */
const getCountryFromLocale = (
  locale: CountryLanguage,
): keyof typeof STRIPE_PRICE_IDS => {
  const countryPart = locale.split("-")[1];
  return countryPart;
};

/**
 * Helper function to get Stripe price ID for a plan, billing interval, and region
 */
const getStripePriceId = (
  planId: Exclude<SubscriptionPlanValue, typeof SubscriptionPlan.ENTERPRISE>,
  billingInterval: BillingIntervalValue,
  country: keyof typeof STRIPE_PRICE_IDS,
): string | undefined => {
  const regionPrices = STRIPE_PRICE_IDS[country];

  // Type-safe access to nested record structure
  if (billingInterval === BillingInterval.MONTHLY) {
    const monthlyPrices = regionPrices[BillingInterval.MONTHLY];
    if (planId === SubscriptionPlan.STARTER) {
      return monthlyPrices[SubscriptionPlan.STARTER];
    }
    if (planId === SubscriptionPlan.PROFESSIONAL) {
      return monthlyPrices[SubscriptionPlan.PROFESSIONAL];
    }
    if (planId === SubscriptionPlan.PREMIUM) {
      return monthlyPrices[SubscriptionPlan.PREMIUM];
    }
  } else if (billingInterval === BillingInterval.YEARLY) {
    const yearlyPrices = regionPrices[BillingInterval.YEARLY];
    if (planId === SubscriptionPlan.STARTER) {
      return yearlyPrices[SubscriptionPlan.STARTER];
    }
    if (planId === SubscriptionPlan.PROFESSIONAL) {
      return yearlyPrices[SubscriptionPlan.PROFESSIONAL];
    }
    if (planId === SubscriptionPlan.PREMIUM) {
      return yearlyPrices[SubscriptionPlan.PREMIUM];
    }
  }

  return undefined;
};

/**
 * Helper function to ensure user has a Stripe customer
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
        "app.api.v1.core.subscription.errors.user_not_found",
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
    return createErrorResponse(
      "app.api.v1.core.subscription.errors.stripe_customer_creation_failed",
      ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      { error: parseError(error).message, userId },
    );
  }
};

/**
 * Subscription Checkout Repository Interface
 */
export interface SubscriptionCheckoutRepository {
  createCheckoutSession(
    data: CheckoutRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CheckoutResponseOutput>>;
}

/**
 * Subscription Checkout Repository Implementation
 */
export class SubscriptionCheckoutRepositoryImpl
  implements SubscriptionCheckoutRepository
{
  /**
   * Create a subscription checkout session
   */
  async createCheckoutSession(
    data: CheckoutRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CheckoutResponseOutput>> {
    let stripePriceId: string | undefined;
    let country: keyof typeof STRIPE_PRICE_IDS | undefined;

    const { t } = simpleT(locale);

    try {
      logger.debug("Creating subscription checkout session", {
        userId: user.id,
        planId: data.planId,
        billingInterval: data.billingInterval,
        locale,
      });

      // Ensure user has a Stripe customer
      const customerResult = await ensureStripeCustomer(user.id, logger);
      if (!customerResult.success) {
        return customerResult;
      }
      const stripeCustomerId = customerResult.data;

      // Get the country from locale for region-specific pricing
      country = getCountryFromLocale(locale);

      // Validate that planId is not ENTERPRISE (ENTERPRISE requires custom pricing)
      if (data.planId === SubscriptionPlan.ENTERPRISE) {
        logger.error(
          t(
            "app.api.v1.core.subscription.checkout.post.errors.validation.reason.enterpriseCustomPricing",
          ),
          {
            planId: data.planId,
            userId: user.id,
          },
        );
        return createErrorResponse(
          "app.api.v1.core.subscription.checkout.post.errors.validation.title",
          ErrorResponseTypes.BAD_REQUEST,
          {
            reason: t(
              "app.api.v1.core.subscription.checkout.post.errors.validation.reason.enterpriseCustomPricing",
            ),
          },
        );
      }

      // Get the Stripe price ID for the plan, billing interval, and region
      stripePriceId = getStripePriceId(
        data.planId,
        data.billingInterval,
        country,
      );

      logger.debug("Using Stripe price ID", {
        stripePriceId,
        planId: data.planId,
        billingInterval: data.billingInterval,
        country,
        locale,
      });

      if (!stripePriceId) {
        logger.error("No Stripe price ID found for plan", {
          planId: data.planId,
          billingInterval: data.billingInterval,
          country,
          locale,
        });
        return createErrorResponse(
          "app.api.v1.core.subscription.checkout.post.errors.validation.title",
          ErrorResponseTypes.BAD_REQUEST,
        );
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: stripePriceId,
            quantity: 1,
          },
        ],
        success_url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/subscription?canceled=true`,
        metadata: {
          userId: user.id,
          planId: data.planId,
          billingInterval: data.billingInterval,
          ...data.metadata,
        },
        allow_promotion_codes: true,
        billing_address_collection: "auto",
        customer_update: {
          address: "auto",
        },
        subscription_data: {
          metadata: {
            userId: user.id,
            planId: data.planId,
            billingInterval: data.billingInterval,
          },
        },
      });

      logger.debug("Subscription checkout session created successfully", {
        sessionId: session.id,
        userId: user.id,
      });

      logger.vibe(t("app.api.v1.core.subscription.checkout.success.title"), {
        sessionId: session.id,
        planId: data.planId,
        billingInterval: data.billingInterval,
      });

      return createSuccessResponse({
        success: true,
        sessionId: session.id,
        checkoutUrl: session.url || "",
        message: t("app.api.v1.core.subscription.checkout.success.description"),
      });
    } catch (error) {
      logger.error("Error creating subscription checkout session:", {
        error: parseError(error),
        userId: user.id,
        planId: data.planId,
        billingInterval: data.billingInterval,
        stripePriceId,
        country,
        locale,
      });
      const parsedError = parseError(error);
      return createErrorResponse(
        t("app.api.v1.core.subscription.checkout.errors.serverError.title"),
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message, userId: user.id, planId: data.planId },
      );
    }
  }
}

/**
 * Subscription Checkout Repository Instance
 */
export const subscriptionCheckoutRepository =
  new SubscriptionCheckoutRepositoryImpl();
