/**
 * Credit Purchase Repository
 * Handles payment provider checkout session creation for credit packs
 */

import "server-only";

import { randomBytes } from "node:crypto";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";

import { PaymentProvider } from "../../payment/enum";
import { getPaymentProvider } from "../../payment/providers";
import { ProductIds } from "../../products/repository-client";
import { SubscriptionStatus } from "../../subscription/enum";
import { UserDetailLevel } from "../../user/enum";
import { UserRepository } from "../../user/repository";
import type {
  CreditsPurchasePostRequestOutput,
  CreditsPurchasePostResponseOutput,
} from "./definition";

/**
 * Credit Purchase Repository
 */
export class CreditPurchaseRepository {
  /**
   * Generate a secure callback token for payment redirects
   */
  private static generateCallbackToken(): string {
    // Generate a secure random token (32 bytes = 64 hex characters)
    return randomBytes(32).toString("hex");
  }

  /**
   * Create a payment provider checkout session for credit pack purchase
   */
  static async createCheckoutSession(
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

      logger.debug("About to get user by ID");

      const userResult = await UserRepository.getUserById(
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
      const { SubscriptionRepository } = await import("../../subscription/repository");
      const subscriptionResult = await SubscriptionRepository.getSubscription(
        userId,
        logger,
        locale,
      );

      if (!subscriptionResult.success) {
        logger.warn("Credit pack purchase attempted without active subscription", {
          userId,
        });
        return fail({
          message: "app.api.credits.purchase.post.errors.noActiveSubscription.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
          cause: subscriptionResult,
        });
      }

      const subscription = subscriptionResult.data;
      if (subscription.status !== SubscriptionStatus.ACTIVE) {
        logger.warn("Credit pack purchase attempted with inactive subscription", {
          userId,
          subscriptionStatus: subscription.status,
        });
        return fail({
          message: "app.api.credits.purchase.post.errors.noActiveSubscription.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Get payment provider from request data or default to stripe
      const providerKey = data.provider === PaymentProvider.NOWPAYMENTS ? "nowpayments" : "stripe";
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
      const { productsRepository } = await import("../../products/repository-client");
      const product = productsRepository.getProduct(ProductIds.CREDIT_PACK, locale, "one_time");
      const totalAmount = product.price * data.quantity;
      const totalCredits = product.credits * data.quantity;

      // Generate secure callback token for redirect verification
      const callbackToken = this.generateCallbackToken();

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
          successUrl: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/subscription?payment=success&type=credits&token=${callbackToken}`,
          cancelUrl: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/subscription?payment=canceled&type=credits&token=${callbackToken}`,
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
        callbackToken,
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
        message: "app.api.agent.chat.credits.purchase.post.errors.server.title",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
