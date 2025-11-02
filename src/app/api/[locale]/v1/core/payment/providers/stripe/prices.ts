/**
 * Dynamic Stripe Price Creation
 * Creates Stripe products and prices on-the-fly without caching
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import Stripe from "stripe";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import { env } from "@/config/env";
import type { Countries, CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import {
  productsRepository,
  type ProductIds,
} from "../../../products/repository-client";
import type { PaymentInterval } from "../types";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

export interface StripePriceResult {
  priceId: string;
  productId: string;
}

/**
 * Stripe Price Manager
 * Creates Stripe products and prices dynamically
 */
export class StripePriceManager {
  /**
   * Create Stripe product and price on-the-fly
   * NO CACHING - Creates fresh every time for simplicity
   *
   * For one-time purchases: Creates once, used once, done
   * For subscriptions: Price ID saved in subscription record for management
   */
  async createPrice(
    productId: ProductIds,
    country: Countries,
    locale: CountryLanguage,
    interval: PaymentInterval,
    logger: EndpointLogger,
  ): Promise<ResponseType<StripePriceResult>> {
    try {
      // Get product definition from code with correct interval
      const product = productsRepository.getProduct(productId, locale, interval);

      const { t } = simpleT(locale);

      // Translate product name and description
      const productName = t(product.name);
      const productDescription = t(product.description);

      logger.debug("Creating Stripe price", {
        productId,
        country,
        interval,
        price: product.price,
        currency: product.currency,
      });

      // Create Stripe Product
      const stripeProduct = await stripe.products.create({
        name: productName,
        description: productDescription,
        metadata: {
          internalProductId: productId,
          country: country,
          interval: interval,
        },
      });

      // Create Stripe Price
      const stripePriceConfig: Stripe.PriceCreateParams = {
        product: stripeProduct.id,
        currency: product.currency.toLowerCase(),
        unit_amount: Math.round(product.price * 100), // Convert to cents
        metadata: {
          internalProductId: productId,
          country: country,
          interval: interval,
        },
      };

      // Add recurring config if needed
      if (product.isSubscription && interval !== "one_time") {
        stripePriceConfig.recurring = {
          interval: interval === "year" ? "year" : "month",
        };
      }

      const stripePrice = await stripe.prices.create(stripePriceConfig);

      logger.info("Created Stripe price", {
        productId,
        country,
        interval,
        stripePriceId: stripePrice.id,
        stripeProductId: stripeProduct.id,
      });

      return createSuccessResponse<StripePriceResult>({
        priceId: stripePrice.id,
        productId: stripeProduct.id,
      });
    } catch (error) {
      logger.error("Failed to create Stripe price", {
        error: parseError(error),
        productId,
        country,
        interval,
      });
      return createErrorResponse(
        "app.api.v1.core.payment.providers.stripe.errors.priceCreationFailed.title",
        ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        { error: parseError(error).message, productId },
      );
    }
  }
}

export const stripePriceManager = new StripePriceManager();
