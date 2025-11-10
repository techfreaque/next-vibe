/**
 * Credit Purchase Repository
 * Handles payment provider checkout session creation for credit packs
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";

import { ProductIds } from "../../products/repository-client";
import { getPaymentProvider } from "../../payment/providers";
import { PaymentProvider } from "../../payment/enum";
import { SubscriptionStatus } from "../../subscription/enum";
import type {
  CreditsPurchasePostRequestOutput,
  CreditsPurchasePostResponseOutput,
} from "./definition";

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
   * Create a payment provider checkout session for credit pack purchase
   */
  async createCheckoutSession(
    data: CreditsPurchasePostRequestOutput,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditsPurchasePostResponseOutput>> {
    try {
      logger.debug("createCheckoutSession START", {
        userId,
        quantity: data.quantity,
        locale,
      });

      const { userRepository } = await import("../../user/repository");
      const { UserDetailLevel } = await import("../../user/enum");

      logger.debug("About to get user by ID");

      const userResult = await userRepository.getUserById(
        userId,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      );

      logger.debug("User result", {
        success: userResult.success,
      });

      if (!userResult.success) {
        return userResult;
      }

      const user = userResult.data;

      // Check if user has an active subscription before allowing credit pack purchase
      const { subscriptionRepository } = await import(
        "../../subscription/repository"
      );
      const subscriptionResult = await subscriptionRepository.getSubscription(
        userId,
        logger,
      );

      if (!subscriptionResult.success) {
        logger.warn(
          "Credit pack purchase attempted without active subscription",
          {
            userId,
          },
        );
        return fail({
          message:
            "app.api.v1.core.credits.purchase.post.errors.noActiveSubscription.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
          cause: subscriptionResult,
        });
      }

      const subscription = subscriptionResult.data;
      if (subscription.status !== SubscriptionStatus.ACTIVE) {
        logger.warn(
          "Credit pack purchase attempted with inactive subscription",
          {
            userId,
            subscriptionStatus: subscription.status,
          },
        );
        return fail({
          message:
            "app.api.v1.core.credits.purchase.post.errors.noActiveSubscription.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Get payment provider from request data or default to stripe
      const providerKey =
        data.provider === PaymentProvider.NOWPAYMENTS
          ? "nowpayments"
          : "stripe";
      const provider = getPaymentProvider(providerKey);

      logger.debug("Using payment provider", {
        providerKey,
        providerName: provider.name,
        requestedProvider: data.provider,
      });

      logger.debug("About to ensure customer");

      // Ensure customer exists with provider
      const customerResult = await provider.ensureCustomer(
        userId,
        user.email,
        user.publicName,
        logger,
      );

      logger.debug("Customer result", {
        success: customerResult.success,
      });

      if (!customerResult.success) {
        return customerResult;
      }

      const customer = customerResult.data;
      const country = getCountryFromLocale(locale);

      // Get product and calculate totals based on quantity
      const { productsRepository } = await import(
        "../../products/repository-client"
      );
      const product = productsRepository.getProduct(
        ProductIds.CREDIT_PACK,
        locale,
        "one_time",
      );
      const totalAmount = product.price * data.quantity;
      const totalCredits = product.credits * data.quantity;

      // Create checkout session using provider abstraction
      // Note: We calculate total on our side and send as single line item to Stripe
      logger.debug("About to create checkout session", {
        userId,
        productId: ProductIds.CREDIT_PACK,
        interval: "one_time",
        country,
        customerId: customerResult.data.customerId,
        quantity: data.quantity,
        totalAmount,
        totalCredits,
      });

      const session = await provider.createCheckoutSession(
        {
          userId,
          productId: ProductIds.CREDIT_PACK,
          interval: "one_time",
          country,
          locale,
          successUrl: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/subscription?payment=success&type=credits&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/subscription?payment=canceled&type=credits`,
          metadata: {
            userId,
            type: "credit_pack",
            productId: ProductIds.CREDIT_PACK,
            quantity: data.quantity.toString(),
            totalAmount: totalAmount.toString(),
            totalCredits: totalCredits.toString(),
          },
        },
        customer.customerId,
        logger,
      );

      logger.debug("Checkout session result", {
        success: session.success,
      });

      if (!session.success) {
        return session;
      }

      const sessionData = session.data;

      return success({
        checkoutUrl: sessionData.checkoutUrl,
        sessionId: sessionData.sessionId,
        totalAmount,
        totalCredits,
      });
    } catch (error) {
      logger.error("Failed to create credit pack checkout session", {
        error: parseError(error),
        userId,
        quantity: data.quantity,
      });
      return fail({
        message:
          "app.api.v1.core.agent.chat.credits.purchase.post.errors.server.title",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}

export const creditPurchaseRepository = new CreditPurchaseRepositoryImpl();
