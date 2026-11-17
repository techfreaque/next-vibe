/**
 * Stripe Prices
 *
 * Every (product, interval, currency, amount, language) combination maps to
 * exactly one Stripe price, found by its lookup key and created on first use.
 * No price ids in .env: the lookup key IS the id, so test and live mode, dev
 * and prod resolve the same way, and a price change in the product config
 * creates a new price instead of silently reusing the old one.
 *
 * `ensureAllPrices` pre-creates every combination (run it once per Stripe
 * account, e.g. right after a deploy with new prices) and reports the ids.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { CountryLanguageValues } from "next-vibe/core/i18n/core/config";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import Stripe from "stripe";

import { scopedTranslation as productsScopedTranslation } from "../../../products/i18n";
import {
  CREDIT_PACK_PRODUCT_IDS,
  type ProductIds,
  productsRepository,
  SUBSCRIPTION_TIER_PRODUCT_IDS,
} from "../../../products/repository-client";
import { getEnvAvailability } from "../../../vibe/agent/env-availability";
import { getAvailableChatModelCount } from "../../../vibe/agent/models/all-models";
import type { PaymentInterval } from "../types";
import { scopedTranslation } from "./i18n";
import { StripeProvider } from "./repository";

export interface StripePriceResult {
  priceId: string;
  productId: string;
  lookupKey: string;
  /** Monthly/yearly/one-time amount in minor units */
  unitAmount: number;
  currency: string;
  /** existing = found by lookup key, created = made now, missing = dry run */
  status: "existing" | "created" | "missing";
}

/** Stable Stripe lookup key for one sellable price. */
export function stripePriceLookupKey(params: {
  productId: ProductIds;
  interval: PaymentInterval;
  currency: string;
  unitAmount: number;
  language: string;
}): string {
  return [
    "ub",
    params.productId,
    params.interval,
    params.currency.toLowerCase(),
    String(params.unitAmount),
    params.language,
  ].join("_");
}

/** Stripe product id per internal product and language (custom ids allowed). */
export function stripeProductId(
  productId: ProductIds,
  language: string,
): string {
  return `ub_${productId}_${language}`;
}

function isStripeErrorCode(error: Error, code: string): boolean {
  return error instanceof Stripe.errors.StripeError && error.code === code;
}

/**
 * Stripe Price Manager
 */
export class StripePriceManager {
  /**
   * Find the price for this product/locale/interval, creating the Stripe
   * product and price on first use. Idempotent.
   */
  async ensurePrice(
    productId: ProductIds,
    locale: CountryLanguage,
    interval: PaymentInterval,
    logger: EndpointLogger,
    options: { create: boolean } = { create: true },
  ): Promise<ResponseType<StripePriceResult>> {
    const { t: tStripe } = scopedTranslation.scopedT(locale);
    const stripe = StripeProvider.getStripe();
    if (!stripe) {
      return fail({
        message: tStripe("errors.notConfigured.title"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    try {
      const product = productsRepository.getProduct(
        productId,
        locale,
        interval,
      );
      const language = getLanguageFromLocale(locale);
      const unitAmount = Math.round(product.price * 100);
      const currency = product.currency.toLowerCase();
      const recurring = product.isSubscription && interval !== "one_time";
      const lookupKey = stripePriceLookupKey({
        productId,
        interval,
        currency,
        unitAmount,
        language,
      });

      const existing = await stripe.prices.list({
        lookup_keys: [lookupKey],
        active: true,
        limit: 1,
      });
      const found = existing.data[0];
      if (found) {
        return success<StripePriceResult>({
          priceId: found.id,
          productId:
            typeof found.product === "string"
              ? found.product
              : found.product.id,
          lookupKey,
          unitAmount,
          currency,
          status: "existing",
        });
      }
      if (!options.create) {
        return success<StripePriceResult>({
          priceId: "",
          productId: stripeProductId(productId, language),
          lookupKey,
          unitAmount,
          currency,
          status: "missing",
        });
      }

      const ensuredProduct = await this.ensureProduct(
        stripe,
        productId,
        locale,
        language,
      );
      if (ensuredProduct instanceof Error) {
        logger.error("Failed to ensure Stripe product", {
          error: parseError(ensuredProduct),
          productId,
          locale,
        });
        return fail({
          message: tStripe("errors.priceCreationFailed.detail", {
            error: ensuredProduct.message,
            productId,
          }),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      const stripeProduct = ensuredProduct;

      const priceParams: Stripe.PriceCreateParams = {
        product: stripeProduct,
        currency,
        unit_amount: unitAmount,
        lookup_key: lookupKey,
        // Two first-time checkouts racing both create a price; the later one
        // takes over the key and the earlier stays valid for its session.
        transfer_lookup_key: true,
        metadata: {
          internalProductId: productId,
          interval,
          credits: String(product.credits),
        },
      };
      if (recurring) {
        priceParams.recurring = {
          interval: interval === "year" ? "year" : "month",
        };
      }
      const price = await stripe.prices.create(priceParams);

      logger.info("Created Stripe price", {
        productId,
        locale,
        interval,
        lookupKey,
        stripePriceId: price.id,
        stripeProductId: stripeProduct,
      });

      return success<StripePriceResult>({
        priceId: price.id,
        productId: stripeProduct,
        lookupKey,
        unitAmount,
        currency,
        status: "created",
      });
    } catch (error) {
      logger.error("Failed to ensure Stripe price", {
        error: parseError(error),
        productId,
        locale,
        interval,
      });
      return fail({
        message: tStripe("errors.priceCreationFailed.detail", {
          error: parseError(error).message,
          productId,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
  }

  /**
   * Retrieve or create the Stripe product for an internal product in one
   * language. Keeps its name and description in sync with the config.
   */
  private async ensureProduct(
    stripe: Stripe,
    productId: ProductIds,
    locale: CountryLanguage,
    language: string,
  ): Promise<string | Error> {
    const id = stripeProductId(productId, language);
    const product = productsRepository.getProduct(productId, locale);
    const { t } = productsScopedTranslation.scopedT(locale);
    const name = t(product.name);
    const description = t(product.description, {
      subCredits: new Intl.NumberFormat(language).format(product.credits),
      modelCount: getAvailableChatModelCount(false, await getEnvAvailability()),
    });
    const metadata = { internalProductId: productId, language };

    try {
      const current = await stripe.products.retrieve(id);
      if (
        current.name !== name ||
        current.description !== description ||
        !current.active
      ) {
        await stripe.products.update(id, {
          name,
          description,
          active: true,
          metadata,
        });
      }
      return id;
    } catch (error) {
      const parsed = parseError(error);
      if (
        !isStripeErrorCode(
          error instanceof Error ? error : parsed,
          "resource_missing",
        )
      ) {
        return parsed;
      }
    }

    try {
      await stripe.products.create({ id, name, description, metadata });
    } catch (error) {
      const parsed = parseError(error);
      // A concurrent first checkout created it a moment ago.
      if (
        !isStripeErrorCode(
          error instanceof Error ? error : parsed,
          "resource_already_exists",
        )
      ) {
        return parsed;
      }
    }
    return id;
  }

  /**
   * Ensure every sellable price exists: each subscription tier and credit
   * pack, in every interval it sells, for every locale's currency and
   * language. Idempotent: existing prices are reported, not recreated.
   */
  async ensureAllPrices(
    logger: EndpointLogger,
    options: { create: boolean } = { create: true },
  ): Promise<ResponseType<StripePriceResult[]>> {
    const results: StripePriceResult[] = [];
    const seen = new Set<string>();
    const productIds: ProductIds[] = [
      ...SUBSCRIPTION_TIER_PRODUCT_IDS,
      ...CREDIT_PACK_PRODUCT_IDS,
    ];
    const definitions = productsRepository.getProductDefinitions();
    for (const productId of productIds) {
      if (!productsRepository.canPurchase(productId)) {
        continue;
      }
      for (const interval of definitions[productId].allowedIntervals) {
        for (const locale of Object.values(CountryLanguageValues)) {
          const product = productsRepository.getProduct(
            productId,
            locale,
            interval,
          );
          const key = stripePriceLookupKey({
            productId,
            interval,
            currency: product.currency,
            unitAmount: Math.round(product.price * 100),
            language: getLanguageFromLocale(locale),
          });
          if (seen.has(key)) {
            continue;
          }
          seen.add(key);
          const result = await this.ensurePrice(
            productId,
            locale,
            interval,
            logger,
            options,
          );
          if (!result.success) {
            return result;
          }
          results.push(result.data);
        }
      }
    }
    return success(results);
  }
}

export const stripePriceManager = new StripePriceManager();
