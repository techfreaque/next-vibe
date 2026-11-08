/**
 * Credit Purchase Repository
 * Handles payment provider checkout session creation for credit packs.
 * Packs are pay-as-you-go: no subscription required.
 */

import "server-only";

import { randomBytes } from "node:crypto";

import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { UserDetailLevel } from "next-vibe/identity/user/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import type { EndpointLogger } from "next-vibe/logger/types";

import { getPaymentProvider } from "../../payment/providers";
import type {
  CreditsPurchasePostRequestOutput,
  CreditsPurchasePostResponseOutput,
} from "./definition";
import type { CreditsPurchaseT } from "./i18n";

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
    t: CreditsPurchaseT,
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

      const provider = getPaymentProvider(data.provider);

      logger.debug("Using payment provider", {
        providerKey: data.provider,
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
        locale,
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
      const { productsRepository } =
        await import("../../products/repository-client");
      // No subscription required: any authenticated user may buy a pack.
      const packProductId = data.productId;
      if (!productsRepository.canPurchase(packProductId)) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const product = productsRepository.getProduct(
        packProductId,
        locale,
        "one_time",
      );
      const totalAmount = product.price * data.quantity;
      const totalCredits = product.credits * data.quantity;

      // Generate secure callback token for redirect verification
      const callbackToken = this.generateCallbackToken();

      // Create checkout session using provider abstraction
      // Note: We calculate total on our side and send as single line item to Stripe
      logger.debug("About to create checkout session", {
        userId,
        productId: packProductId,
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
          productId: packProductId,
          interval: "one_time",
          country,
          locale,
          successUrl: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/subscription/overview?cbtoken=${callbackToken}&payment=success&type=credits`,
          cancelUrl: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}/subscription/overview?payment=canceled&type=credits`,
          metadata: {
            userId,
            type: "credit_pack",
            productId: packProductId,
            quantity: data.quantity.toString(),
            totalAmount: totalAmount.toString(),
            totalCredits: totalCredits.toString(),
          },
        },
        customer.customerId,
        logger,
        callbackToken,
        locale,
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
        message: t("post.errors.server.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
  }
}
