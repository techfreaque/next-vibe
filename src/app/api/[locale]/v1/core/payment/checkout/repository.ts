/**
 * Payment Checkout Repository
 * Delegates to payment provider abstraction for checkout session creation
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createSuccessResponse,
  createErrorResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";
import { simpleT } from "@/i18n/core/shared";

import type { JwtPrivatePayloadType } from "../../user/auth/types";
import { getPaymentProvider } from "../providers";
import { ProductIds } from "../../products/repository-client";
import { BillingInterval } from "../../subscription/enum";
import type {
  CheckoutRequestOutput,
  CheckoutResponseOutput,
} from "./definition";

/**
 * Subscription Checkout Repository Interface
 */
export interface SubscriptionCheckoutRepository {
  createCheckoutSession(
    data: CheckoutRequestOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CheckoutResponseOutput>>;
}

/**
 * Subscription Checkout Repository Implementation
 */
export class SubscriptionCheckoutRepositoryImpl
  implements SubscriptionCheckoutRepository {
  /**
   * Create a subscription checkout session
   */
  async createCheckoutSession(
    data: CheckoutRequestOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CheckoutResponseOutput>> {
    logger.debug("Function called - before try block", { userId: user?.id, locale });
    try {
      logger.debug("Step 1: Getting translation function");
      const { t } = simpleT(locale);

      logger.debug("Step 2: Creating subscription checkout session", {
        userId: user.id,
        planId: data.planId,
        billingInterval: data.billingInterval,
        locale,
      });

      // Default to stripe provider
      logger.debug("Step 3: Getting payment provider");
      const provider = getPaymentProvider("stripe");
      logger.debug("Step 4: Payment provider retrieved", { providerName: provider.name });

      // Get user details from database for customer creation
      logger.debug("Step 5: Importing user repository");
      const { userRepository } = await import("../../user/repository");
      const { UserDetailLevel } = await import("../../user/enum");
      logger.debug("Step 6: Getting user by ID");
      const userResult = await userRepository.getUserById(
        user.id,
        UserDetailLevel.STANDARD,
        locale,
        logger
      );
      logger.debug("Step 7: User result received", { success: userResult.success });

      if (!userResult.success || !userResult.data) {
        return createErrorResponse(
          "app.api.v1.core.payment.checkout.post.errors.notFound.title" as never,
          ErrorResponseTypes.NOT_FOUND,
          { userId: user.id },
        );
      }

      // Ensure customer exists with provider
      const customerResult = await provider.ensureCustomer(
        user.id,
        userResult.data.email || "",
        userResult.data.publicName || "",
        logger,
      );

      if (!customerResult.success) {
        return customerResult;
      }

      const country = getCountryFromLocale(locale);

      // Map billing interval to payment interval
      const interval = data.billingInterval === BillingInterval.MONTHLY ? "month" : "year";

      // Create checkout session using provider abstraction
      const session = await provider.createCheckoutSession(
        {
          userId: user.id,
          productId: ProductIds.SUBSCRIPTION,
          interval,
          country,
          locale,
          successUrl: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/subscription?canceled=true`,
          metadata: {
            type: "subscription",
            userId: user.id,
            planId: data.planId,
            billingInterval: data.billingInterval,
            productId: ProductIds.SUBSCRIPTION,
            interval,
          },
        },
        customerResult.data.customerId,
        logger,
      );

      if (!session.success) {
        return session;
      }

      logger.debug("Subscription checkout session created successfully", {
        sessionId: session.data.sessionId,
        userId: user.id,
      });

      return createSuccessResponse({
        success: true,
        sessionId: session.data.sessionId,
        checkoutUrl: session.data.checkoutUrl,
        message: t("app.api.v1.core.payment.checkout.post.success.description" as never),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      logger.error("Failed to create checkout session", {
        errorMessage,
        errorStack,
        errorType: typeof error,
        errorConstructor: error?.constructor?.name
      });
      return createErrorResponse(
        "app.api.v1.core.payment.checkout.post.errors.server.title" as never,
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: errorMessage },
      );
    }
  }
}

/**
 * Subscription Checkout Repository Instance
 */
export const subscriptionCheckoutRepository =
  new SubscriptionCheckoutRepositoryImpl();
