/**
 * Payment Checkout Repository
 * Delegates to payment provider abstraction for checkout session creation
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";
import { simpleT } from "@/i18n/core/shared";

import { ProductIds } from "../../products/repository-client";
import { BillingInterval } from "../../subscription/enum";
import type { JwtPrivatePayloadType } from "../../user/auth/types";
import { UserDetailLevel } from "../../user/enum";
import { UserRepository } from "../../user/repository";
import { PaymentProvider } from "../enum";
import { getPaymentProvider } from "../providers";
import type { CheckoutRequestOutput, CheckoutResponseOutput } from "./definition";

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
export class SubscriptionCheckoutRepositoryImpl implements SubscriptionCheckoutRepository {
  /**
   * Create a subscription checkout session
   */
  async createCheckoutSession(
    data: CheckoutRequestOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CheckoutResponseOutput>> {
    logger.debug("Function called - before try block", {
      userId: user?.id,
      locale,
    });
    try {
      logger.debug("Step 1: Getting translation function");
      const { t } = simpleT(locale);

      logger.debug("Step 2: Creating subscription checkout session", {
        userId: user.id,
        planId: data.planId,
        billingInterval: data.billingInterval,
        provider: data.provider,
        locale,
      });

      // Get payment provider from request data or default to stripe
      logger.debug("Step 3: Getting payment provider");
      const providerKey = data.provider === PaymentProvider.NOWPAYMENTS ? "nowpayments" : "stripe";
      const provider = getPaymentProvider(providerKey);
      logger.debug("Step 4: Payment provider retrieved", {
        providerName: provider.name,
        providerKey,
        requestedProvider: data.provider,
      });

      // Check if user already has an active subscription
      logger.debug("Step 5: Checking for existing subscription");
      const { SubscriptionRepository } = await import("../../subscription/repository");
      const existingSubscription = await SubscriptionRepository.getSubscription(
        user.id,
        logger,
        locale,
      );

      if (existingSubscription.success && existingSubscription.data) {
        const { SubscriptionStatus } = await import("../../subscription/enum");
        if (existingSubscription.data.status === SubscriptionStatus.ACTIVE) {
          logger.warn("User already has active subscription", {
            userId: user.id,
            subscriptionId: existingSubscription.data.id,
          });
          return fail({
            message: "app.api.payment.checkout.post.errors.alreadySubscribed.title",
            errorType: ErrorResponseTypes.BAD_REQUEST,
            messageParams: { userId: user.id },
          });
        }
      }

      // Get user details from database for customer creation
      logger.debug("Step 6: Importing user repository");

      logger.debug("Step 7: Getting user by ID");
      const userResult = await UserRepository.getUserById(
        user.id,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      );
      logger.debug("Step 8: User result received", {
        success: userResult.success,
      });

      if (!userResult.success || !userResult.data) {
        return fail({
          message: "app.api.payment.checkout.post.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId: user.id },
        });
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

      // Generate callback token for webhook verification
      const callbackToken = crypto.randomUUID();

      // Create checkout session using provider abstraction
      const session = await provider.createCheckoutSession(
        {
          userId: user.id,
          productId: ProductIds.SUBSCRIPTION,
          interval,
          country,
          locale,
          successUrl: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/subscription?payment=success&type=subscription&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/subscription?payment=canceled&type=subscription`,
          metadata: {
            type: "subscription",
            userId: user.id,
            planId: data.planId,
            billingInterval: data.billingInterval,
            productId: ProductIds.SUBSCRIPTION,
            interval,
            provider: data.provider || PaymentProvider.STRIPE,
          },
        },
        customerResult.data.customerId,
        logger,
        callbackToken,
      );

      if (!session.success) {
        return session;
      }

      logger.debug("Subscription checkout session created successfully", {
        sessionId: session.data.sessionId,
        userId: user.id,
      });

      return success({
        success: true,
        sessionId: session.data.sessionId,
        checkoutUrl: session.data.checkoutUrl,
        message: t("app.api.payment.checkout.post.success.description"),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      logger.error("Failed to create checkout session", {
        errorMessage,
        errorStack,
        errorType: typeof error,
        errorConstructor: error?.constructor?.name,
      });
      return fail({
        message: "app.api.payment.checkout.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMessage },
      });
    }
  }
}

/**
 * Subscription Checkout Repository Instance
 */
export const subscriptionCheckoutRepository = new SubscriptionCheckoutRepositoryImpl();
