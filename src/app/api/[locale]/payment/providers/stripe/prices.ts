/**
 * Dynamic Stripe Price Creation
 * Creates Stripe products and prices on-the-fly without caching
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import type Stripe from "stripe";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Countries, CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { TOTAL_MODEL_COUNT } from "../../../agent/models/models";
import {
  type ProductIds,
  productsRepository,
} from "../../../products/repository-client";
import type { PaymentInterval } from "../types";
import { stripe } from "./repository";

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
      const product = productsRepository.getProduct(
        productId,
        locale,
        interval,
      );

      const { t } = simpleT(locale);

      // Translate product name and description with interpolation
      const productName = t(product.name);
      const productDescription = t(product.description, {
        subCredits: product.credits,
        modelCount: TOTAL_MODEL_COUNT,
      });

      logger.info("Creating Stripe price with locale-adjusted pricing", {
        productId,
        requestedCountry: country,
        derivedCountryFromLocale: product.country,
        locale,
        interval,
        price: product.price,
        currency: product.currency,
        unitAmountCents: Math.round(product.price * 100),
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

      return success<StripePriceResult>({
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
      return fail({
        message:
          "app.api.payment.providers.stripe.errors.priceCreationFailed.title",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: parseError(error).message, productId },
      });
    }
  }
}

export const stripePriceManager = new StripePriceManager();
