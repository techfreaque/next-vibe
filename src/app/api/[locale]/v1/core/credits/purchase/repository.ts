/**
 * Credit Purchase Repository
 * Handles payment provider checkout session creation for credit packs
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";

import { ProductIds } from "../../products/repository-client";
import { getPaymentProvider } from "../../payment/providers";
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
        hasData: !!userResult.data,
      });

      if (!userResult.success || !userResult.data) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.credits.purchase.post.errors.notFound.title",
          ErrorResponseTypes.NOT_FOUND,
          { userId },
        );
      }

      // Default to stripe provider
      const provider = getPaymentProvider("stripe");

      logger.debug("About to ensure customer");

      // Ensure customer exists with provider
      const customerResult = await provider.ensureCustomer(
        userId,
        userResult.data.email,
        userResult.data.publicName,
        logger,
      );

      logger.debug("Customer result", {
        success: customerResult.success,
        hasData: !!customerResult.data,
      });

      if (!customerResult.success) {
        return customerResult;
      }

      const country = getCountryFromLocale(locale);

      // Create checkout session using provider abstraction
      logger.debug("About to create checkout session", {
        userId,
        productId: ProductIds.CREDIT_PACK,
        interval: "one_time",
        country,
        customerId: customerResult.data.customerId,
      });

      const session = await provider.createCheckoutSession(
        {
          userId,
          productId: ProductIds.CREDIT_PACK,
          interval: "one_time",
          country,
          locale,
          successUrl: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/chat?credits_purchase=success&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/subscription?credits_purchase=canceled`,
          metadata: {
            userId,
            type: "credit_pack",
            productId: ProductIds.CREDIT_PACK,
            quantity: data.quantity.toString(),
          },
        },
        customerResult.data.customerId,
        logger,
      );

      logger.debug("Checkout session result", {
        success: session.success,
        hasData: !!session.data,
      });

      if (!session.success) {
        logger.error("Checkout session creation failed", {
          message: session.message,
          type: session.type,
        });
        return session;
      }

      // Get product to calculate totals
      const { productsRepository } = await import("../../products/repository-client");
      const product = productsRepository.getProduct(ProductIds.CREDIT_PACK, locale, "one_time");
      const totalAmount = product.price * data.quantity;
      const totalCredits = product.credits * data.quantity;

      return createSuccessResponse({
        checkoutUrl: session.data.checkoutUrl,
        sessionId: session.data.sessionId,
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
        "app.api.v1.core.agent.chat.credits.purchase.post.errors.server.title",
        ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        { error: parseError(error).message },
      );
    }
  }
}

export const creditPurchaseRepository = new CreditPurchaseRepositoryImpl();
