/**
 * Centralized Products & Pricing Repository
 * Single source of truth for all pricing and product data across the platform
 */

import { languageConfig } from "next-vibe/core/i18n";
import type {
  Countries,
  CountryLanguage,
  Currencies,
} from "next-vibe/core/i18n/core/config";
import { getCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";

import type { SubscriptionPlanValue } from "@/subscription/enum";
import { SubscriptionPlan } from "@/subscription/enum";

import type { PaymentInterval } from "../payment/providers/types";
import {
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_MAX_TOTAL,
  FREE_CREDIT_SIGNED_IN_TOTAL,
} from "./constants";
import type { ProductsTranslationKey } from "./i18n";

/**
 * ============================================================================
 * PRICING CONFIGURATION
 * Single source of truth for all feature pricing
 * ============================================================================
 */

/**
 * Credit Value Definition
 * 1 credit = €0.01 = $0.01. PLN converts every price at 3.75 zł per $/€
 * (8 -> 30 zł, rounded to whole złoty): pack 19 zł / 500 credits.
 */
export const CREDIT_VALUE_USD = 0.01;

/**
 * Standard markup percentage applied to all external API costs
 */
export const STANDARD_MARKUP_PERCENTAGE = 0.3; // 30% markup

/**
 * TTS and STT have no flat rate: each voice / transcription route bills its
 * own provider price x STANDARD_MARKUP_PERCENTAGE (calculateTtsCharge in
 * text-to-speech/models.ts, calculateSttCharge in speech-to-text/models.ts).
 */

/**
 * Brave Search Pricing
 * Base: $5.00/1,000 requests
 * With 30% markup: $6.50/1,000 requests
 * Per request: $0.0065 = 0.65 credits
 *
 * NOTE: Rounded to 2 decimal places to avoid floating point display issues
 */
const BRAVE_SEARCH_BASE_COST_PER_1000_USD = 5.0;
const BRAVE_SEARCH_COST_WITH_MARKUP_USD =
  BRAVE_SEARCH_BASE_COST_PER_1000_USD * (1 + STANDARD_MARKUP_PERCENTAGE);
const BRAVE_SEARCH_COST_PER_REQUEST_USD =
  BRAVE_SEARCH_COST_WITH_MARKUP_USD / 1000;
const BRAVE_SEARCH_COST_CALCULATED =
  BRAVE_SEARCH_COST_PER_REQUEST_USD / CREDIT_VALUE_USD;
export const BRAVE_SEARCH_COST_PER_REQUEST =
  Math.round(BRAVE_SEARCH_COST_CALCULATED * 100) / 100;

/**
 * Scrappey (URL Fetcher) Pricing
 * Base: $10.00/10,000 requests
 * With 30% markup: $13.00/10,000 requests
 * Per request: $0.0013 = 0.13 credits
 *
 * NOTE: Rounded to 2 decimal places to avoid floating point display issues
 */
const SCRAPPEY_BASE_COST_PER_10K_USD = 10.0;
const SCRAPPEY_COST_WITH_MARKUP_USD =
  SCRAPPEY_BASE_COST_PER_10K_USD * (1 + STANDARD_MARKUP_PERCENTAGE);
const SCRAPPEY_COST_PER_REQUEST_USD = SCRAPPEY_COST_WITH_MARKUP_USD / 10000;
const SCRAPPEY_COST_CALCULATED =
  SCRAPPEY_COST_PER_REQUEST_USD / CREDIT_VALUE_USD;
export const SCRAPPEY_COST_PER_REQUEST =
  Math.round(SCRAPPEY_COST_CALCULATED * 100) / 100;

/**
 * Kagi Search Pricing
 * Base: $0.015 per request (1.5 cents)
 * With 30% markup: $0.0195 per request
 * Per request: $0.0195 = 1.95 credits
 *
 * NOTE: Rounded to 2 decimal places to avoid floating point display issues
 */
const KAGI_SEARCH_BASE_COST_PER_REQUEST_USD = 0.015;
const KAGI_SEARCH_COST_WITH_MARKUP_USD =
  KAGI_SEARCH_BASE_COST_PER_REQUEST_USD * (1 + STANDARD_MARKUP_PERCENTAGE);
const KAGI_SEARCH_COST_CALCULATED =
  KAGI_SEARCH_COST_WITH_MARKUP_USD / CREDIT_VALUE_USD;
export const KAGI_SEARCH_COST_PER_REQUEST =
  Math.round(KAGI_SEARCH_COST_CALCULATED * 100) / 100;

/**
 * Feature Costs Object
 * Consolidated pricing for all non-model features
 */
export const FEATURE_COSTS = {
  /**
   * Brave Search: 0.65 credits per search
   * Based on $5/1000 requests + 30% markup
   */
  BRAVE_SEARCH: BRAVE_SEARCH_COST_PER_REQUEST,

  /**
   * Kagi Search: 1.95 credits per search
   * Based on $0.015/request (1.5 cents) + 30% markup
   */
  KAGI_SEARCH: KAGI_SEARCH_COST_PER_REQUEST,

  /**
   * Fetch URL Content (Scrappey): 0.13 credits per request
   * Based on $10/10,000 requests + 30% markup
   */
  FETCH_URL_CONTENT: SCRAPPEY_COST_PER_REQUEST,
} as const;

/**
 * Product definition with pricing per country
 */
type PriceMarket = "DE" | "FR" | "PL" | "US" | "GLOBAL";

function priceMarket(country: Countries): PriceMarket {
  if (country === "US" || country === "FR" || country === "PL") {
    return country;
  }
  return languageConfig.countryInfo[country].currency === "EUR"
    ? "DE"
    : "GLOBAL";
}

export interface ProductDefinition {
  name: ProductsTranslationKey;
  description: ProductsTranslationKey;
  priceByCountry: {
    [key in PriceMarket]: {
      price: number;
      currency: Currencies;
    };
  };
  yearlyPriceByCountry?: {
    [key in PriceMarket]: {
      price: number;
      currency: Currencies;
    };
  };
  oneTimePriceByCountry?: {
    [key in PriceMarket]: {
      price: number;
      currency: Currencies;
    };
  };
  isSubscription: boolean;
  allowedIntervals: PaymentInterval[];
  credits: number;
  status: "active" | "deprecated";
  deprecatedAt?: Date;
  replacedBy?: ProductIds;
}

/**
 * Product with price for specific locale
 */
export interface Product {
  id: ProductIds;
  name: ProductsTranslationKey;
  description: ProductsTranslationKey;
  price: number;
  currency: Currencies;
  isSubscription: boolean;
  allowedIntervals: PaymentInterval[];
  credits: number;
  country: Countries;
  status: "active" | "deprecated";
  deprecatedAt?: Date;
  replacedBy?: ProductIds;
}

export enum ProductIds {
  FREE_TIER = "free_tier",
  /** Starter plan ($8/month). Keeps its original id: existing subscribers. */
  SUBSCRIPTION = "subscription",
  SUBSCRIPTION_PLUS = "subscription_plus",
  SUBSCRIPTION_PRO = "subscription_pro",
  SUBSCRIPTION_ULTRA = "subscription_ultra",
  CREDIT_PACK = "credit_pack",
  CREDIT_PACK_LARGE = "credit_pack_large",
}

/**
 * Credit pack products a user can buy (one-time top-up, requires an active
 * plan). Ordered small to large. Retired packs stay in ProductIds (old
 * purchases and ledger rows reference them) but are left out of this list.
 */
export const CREDIT_PACK_PRODUCT_IDS = [ProductIds.CREDIT_PACK] as const;

/**
 * Subscription tiers, cheapest first. Each tier is one product and one
 * SubscriptionPlan value; the plan is what the subscription row stores.
 * Higher tiers carry more credits per dollar; that bonus lives only in the
 * credit numbers below and is never advertised as a percentage.
 */
export const SUBSCRIPTION_TIER_PRODUCT_IDS = [
  ProductIds.SUBSCRIPTION,
  ProductIds.SUBSCRIPTION_PLUS,
  ProductIds.SUBSCRIPTION_PRO,
  ProductIds.SUBSCRIPTION_ULTRA,
] as const;

export type SubscriptionTierProductId =
  (typeof SUBSCRIPTION_TIER_PRODUCT_IDS)[number];

/** Plan value stored on the subscription row, per tier product. */
const TIER_PLAN_BY_PRODUCT: Record<
  SubscriptionTierProductId,
  typeof SubscriptionPlanValue
> = {
  [ProductIds.SUBSCRIPTION]: SubscriptionPlan.SUBSCRIPTION,
  [ProductIds.SUBSCRIPTION_PLUS]: SubscriptionPlan.PLUS,
  [ProductIds.SUBSCRIPTION_PRO]: SubscriptionPlan.PRO,
  [ProductIds.SUBSCRIPTION_ULTRA]: SubscriptionPlan.ULTRA,
};

export function isSubscriptionTierProductId(
  productId: string,
): productId is SubscriptionTierProductId {
  return SUBSCRIPTION_TIER_PRODUCT_IDS.some((id) => id === productId);
}

/** Plan value for a tier product. */
export function getPlanForTierProduct(
  productId: SubscriptionTierProductId,
): typeof SubscriptionPlanValue {
  return TIER_PLAN_BY_PRODUCT[productId];
}

/**
 * Tier product for a stored plan id. Accepts the legacy prefixed values
 * ('app.api.subscription.enums.plan.subscription') still found in old rows.
 * Unknown plan ids return null.
 */
export function getTierProductForPlan(
  planId: string,
): SubscriptionTierProductId | null {
  for (const productId of SUBSCRIPTION_TIER_PRODUCT_IDS) {
    const plan = TIER_PLAN_BY_PRODUCT[productId];
    if (planId === plan || planId.endsWith(`.${plan}`)) {
      return productId;
    }
  }
  return null;
}

/**
 * Internal product definitions with pricing for all countries
 */
const productDefinitions: Record<ProductIds, ProductDefinition> = {
  free_tier: {
    name: "free.name",
    description: "free.description",
    priceByCountry: {
      DE: { price: 0, currency: "EUR" as const },
      FR: { price: 0, currency: "EUR" as const },
      PL: { price: 0, currency: "PLN" as const },
      US: { price: 0, currency: "USD" as const },
      GLOBAL: { price: 0, currency: "USD" as const },
    },
    credits: FREE_CREDIT_ALLOWANCE.guest,
    isSubscription: true,
    allowedIntervals: ["month" as const],
    status: "active" as const,
  },
  subscription: {
    name: "subscription.name",
    description: "subscription.description",
    priceByCountry: {
      DE: { price: 8, currency: "EUR" as const },
      FR: { price: 8, currency: "EUR" as const },
      PL: { price: 30, currency: "PLN" as const },
      US: { price: 8, currency: "USD" as const },
      GLOBAL: { price: 8, currency: "USD" as const },
    },
    yearlyPriceByCountry: {
      DE: { price: 88, currency: "EUR" as const },
      FR: { price: 88, currency: "EUR" as const },
      PL: { price: 330, currency: "PLN" as const },
      US: { price: 88, currency: "USD" as const },
      GLOBAL: { price: 88, currency: "USD" as const },
    },
    credits: 800,
    isSubscription: true,
    allowedIntervals: ["month" as const, "year" as const],
    status: "active" as const,
  },
  // PLN: every price x3.75 (8 USD = 30 zł), whole złoty. Yearly = 11 months.
  subscription_plus: {
    name: "subscriptionPlus.name",
    description: "subscription.description",
    priceByCountry: {
      DE: { price: 20, currency: "EUR" as const },
      FR: { price: 20, currency: "EUR" as const },
      PL: { price: 75, currency: "PLN" as const },
      US: { price: 20, currency: "USD" as const },
      GLOBAL: { price: 20, currency: "USD" as const },
    },
    yearlyPriceByCountry: {
      DE: { price: 220, currency: "EUR" as const },
      FR: { price: 220, currency: "EUR" as const },
      PL: { price: 825, currency: "PLN" as const },
      US: { price: 220, currency: "USD" as const },
      GLOBAL: { price: 220, currency: "USD" as const },
    },
    credits: 2050,
    isSubscription: true,
    allowedIntervals: ["month" as const, "year" as const],
    status: "active" as const,
  },
  subscription_pro: {
    name: "subscriptionPro.name",
    description: "subscription.description",
    priceByCountry: {
      DE: { price: 100, currency: "EUR" as const },
      FR: { price: 100, currency: "EUR" as const },
      PL: { price: 375, currency: "PLN" as const },
      US: { price: 100, currency: "USD" as const },
      GLOBAL: { price: 100, currency: "USD" as const },
    },
    yearlyPriceByCountry: {
      DE: { price: 1100, currency: "EUR" as const },
      FR: { price: 1100, currency: "EUR" as const },
      PL: { price: 4125, currency: "PLN" as const },
      US: { price: 1100, currency: "USD" as const },
      GLOBAL: { price: 1100, currency: "USD" as const },
    },
    credits: 10500,
    isSubscription: true,
    allowedIntervals: ["month" as const, "year" as const],
    status: "active" as const,
  },
  subscription_ultra: {
    name: "subscriptionUltra.name",
    description: "subscription.description",
    priceByCountry: {
      DE: { price: 200, currency: "EUR" as const },
      FR: { price: 200, currency: "EUR" as const },
      PL: { price: 750, currency: "PLN" as const },
      US: { price: 200, currency: "USD" as const },
      GLOBAL: { price: 200, currency: "USD" as const },
    },
    yearlyPriceByCountry: {
      DE: { price: 2200, currency: "EUR" as const },
      FR: { price: 2200, currency: "EUR" as const },
      PL: { price: 8250, currency: "PLN" as const },
      US: { price: 2200, currency: "USD" as const },
      GLOBAL: { price: 2200, currency: "USD" as const },
    },
    credits: 22000,
    isSubscription: true,
    allowedIntervals: ["month" as const, "year" as const],
    status: "active" as const,
  },
  credit_pack: {
    name: "creditPack.name",
    description: "creditPack.description",
    // Must equal oneTimePriceByCountry (what checkout charges): a pack has no
    // other interval, and some surfaces read the default price.
    priceByCountry: {
      DE: { price: 5, currency: "EUR" as const },
      FR: { price: 5, currency: "EUR" as const },
      PL: { price: 19, currency: "PLN" as const },
      US: { price: 5, currency: "USD" as const },
      GLOBAL: { price: 5, currency: "USD" as const },
    },
    oneTimePriceByCountry: {
      DE: { price: 5, currency: "EUR" as const },
      FR: { price: 5, currency: "EUR" as const },
      PL: { price: 19, currency: "PLN" as const },
      US: { price: 5, currency: "USD" as const },
      GLOBAL: { price: 5, currency: "USD" as const },
    },
    credits: 500,
    isSubscription: false,
    allowedIntervals: ["one_time" as const],
    status: "active" as const,
  },
  // Retired 2026-11-13: $20 / 2500 credits ($0.008 per credit) lost money after
  // Stripe fees. Kept so historical purchases still resolve; not for sale.
  credit_pack_large: {
    name: "creditPackLarge.name",
    description: "creditPackLarge.description",
    priceByCountry: {
      DE: { price: 20, currency: "EUR" as const },
      FR: { price: 20, currency: "EUR" as const },
      PL: { price: 160, currency: "PLN" as const },
      US: { price: 20, currency: "USD" as const },
      GLOBAL: { price: 20, currency: "USD" as const },
    },
    oneTimePriceByCountry: {
      DE: { price: 20, currency: "EUR" as const },
      FR: { price: 20, currency: "EUR" as const },
      PL: { price: 160, currency: "PLN" as const },
      US: { price: 20, currency: "USD" as const },
      GLOBAL: { price: 20, currency: "USD" as const },
    },
    credits: 2500,
    isSubscription: false,
    allowedIntervals: ["one_time" as const],
    status: "deprecated" as const,
    deprecatedAt: new Date("2026-11-13T00:00:00Z"),
    replacedBy: ProductIds.CREDIT_PACK,
  },
};

/**
 * Products Repository Interface
 */
export interface ProductsRepository {
  /**
   * Get a specific product for a locale with optional interval
   */
  getProduct(
    productId: ProductIds,
    locale: CountryLanguage,
    interval?: PaymentInterval,
  ): Product;

  /**
   * Get all products for a specific locale
   */
  getProducts(locale: CountryLanguage): Record<ProductIds, Product>;

  /**
   * Check if a product can be purchased (not deprecated)
   */
  canPurchase(productId: ProductIds): boolean;

  /**
   * Check if a product is deprecated (for existing subscribers check)
   */
  isDeprecated(productId: ProductIds): boolean;

  /**
   * Get replacement product ID for a deprecated product
   */
  getReplacementProduct(productId: ProductIds): ProductIds | null;

  /**
   * Get raw product definitions (internal use only)
   */
  getProductDefinitions(): Record<ProductIds, ProductDefinition>;

  /**
   * Get a summary of all products in a single sentence
   * Single source of truth for product summary text
   */
  getProductsSummary(
    locale: CountryLanguage,
    t: (key: string, params?: Record<string, string | number>) => string,
  ): string;
}

/**
 * Products Repository Implementation
 */
export class ProductsRepositoryImpl implements ProductsRepository {
  /**
   * Get a specific product for a locale with optional interval
   */
  getProduct(
    productId: ProductIds,
    locale: CountryLanguage,
    interval: PaymentInterval = "month",
  ): Product {
    const country = getCountryFromLocale(locale);
    const market = priceMarket(country);
    const definition = productDefinitions[productId];
    // An interval the product is not sold in falls back to its first one, so a
    // credit pack read without "one_time" still shows the checkout price.
    const effectiveInterval = definition.allowedIntervals.includes(interval)
      ? interval
      : (definition.allowedIntervals[0] ?? interval);

    // Get price and currency based on interval and country
    // Let TypeScript infer the literal type from the data
    const priceData =
      effectiveInterval === "year" && definition.yearlyPriceByCountry
        ? definition.yearlyPriceByCountry[market]
        : effectiveInterval === "one_time" && definition.oneTimePriceByCountry
          ? definition.oneTimePriceByCountry[market]
          : definition.priceByCountry[market];

    return {
      id: productId,
      name: definition.name,
      description: definition.description,
      price: priceData.price,
      currency: priceData.currency,
      isSubscription: definition.isSubscription,
      allowedIntervals: definition.allowedIntervals,
      credits: definition.credits,
      country,
      status: definition.status,
      deprecatedAt: definition.deprecatedAt,
      replacedBy: definition.replacedBy,
    };
  }

  /**
   * Get all products for a specific locale
   */
  getProducts(locale: CountryLanguage): Record<ProductIds, Product> {
    return {
      [ProductIds.FREE_TIER]: this.getProduct(ProductIds.FREE_TIER, locale),
      [ProductIds.SUBSCRIPTION]: this.getProduct(
        ProductIds.SUBSCRIPTION,
        locale,
      ),
      [ProductIds.SUBSCRIPTION_PLUS]: this.getProduct(
        ProductIds.SUBSCRIPTION_PLUS,
        locale,
      ),
      [ProductIds.SUBSCRIPTION_PRO]: this.getProduct(
        ProductIds.SUBSCRIPTION_PRO,
        locale,
      ),
      [ProductIds.SUBSCRIPTION_ULTRA]: this.getProduct(
        ProductIds.SUBSCRIPTION_ULTRA,
        locale,
      ),
      [ProductIds.CREDIT_PACK]: this.getProduct(
        ProductIds.CREDIT_PACK,
        locale,
        "one_time",
      ),
      [ProductIds.CREDIT_PACK_LARGE]: this.getProduct(
        ProductIds.CREDIT_PACK_LARGE,
        locale,
        "one_time",
      ),
    };
  }

  /**
   * Check if a product can be purchased (not deprecated)
   */
  canPurchase(productId: ProductIds): boolean {
    const definition = productDefinitions[productId];
    return definition.status === "active";
  }

  /**
   * Check if a product is deprecated (for existing subscribers check)
   */
  isDeprecated(productId: ProductIds): boolean {
    return productDefinitions[productId].status === "deprecated";
  }

  /**
   * Get replacement product ID for a deprecated product
   */
  getReplacementProduct(productId: ProductIds): ProductIds | null {
    return productDefinitions[productId].replacedBy ?? null;
  }

  /**
   * Get raw product definitions (for backward compatibility)
   */
  getProductDefinitions(): Record<ProductIds, ProductDefinition> {
    return productDefinitions;
  }

  /**
   * Get a summary of all products in a single sentence
   * Single source of truth for product summary text
   */
  getProductsSummary(
    locale: CountryLanguage,
    t: (key: string, params?: Record<string, string | number>) => string,
  ): string {
    const params = getPricingParams(locale);
    return t("summary", {
      freeCredits: params.freeCredits,
      freeCreditsSignedIn: params.freeCreditsSignedIn,
      freeCreditsMax: params.freeCreditsMax,
      subPrice: params.subscriptionPrice,
      subCredits: params.subscriptionCredits,
      plusPrice: params.plusPrice,
      plusCredits: params.plusCredits,
      proPrice: params.proPrice,
      proCredits: params.proCredits,
      ultraPrice: params.ultraPrice,
      ultraCredits: params.ultraCredits,
      packPrice: params.packPrice,
      packCredits: params.packCredits,
    });
  }
}

export const productsRepository = new ProductsRepositoryImpl();

function currencySymbol(c: string): string {
  return c === "EUR" ? "€" : c === "PLN" ? "zł" : "$";
}

/**
 * "$5", "€8", "19 zł": the złoty sign follows the amount, and so does the
 * euro sign on German, French, Italian, Spanish and Slovak pages ("8 €"), the way
 * those readers write prices (and how Intl formats the same amounts).
 */
function formatPriceLabel(
  price: number,
  currency: string,
  locale?: CountryLanguage,
): string {
  const symbolAfter =
    currency === "PLN" ||
    (currency === "EUR" &&
      locale !== undefined &&
      /^(de|fr|it|es|sk)-/.test(locale));
  return symbolAfter
    ? `${price} ${currencySymbol(currency)}`
    : `${currencySymbol(currency)}${price}`;
}

/**
 * Returns interpolation params for pricing-related i18n strings.
 * Use as second argument to t() calls that contain {{subscriptionCredits}},
 * {{packCredits}}, {{packPrice}}, {{freeCredits}}, {{subscriptionPrice}} etc.
 *
 * For emails/server-side use getPricingParamsForLocale(locale) instead.
 */
export function getPricingParams(
  locale: CountryLanguage,
): Record<string, string> {
  const country = priceMarket(getCountryFromLocale(locale));
  const free = productDefinitions[ProductIds.FREE_TIER];
  const sub = productDefinitions[ProductIds.SUBSCRIPTION];
  const pack = productDefinitions[ProductIds.CREDIT_PACK];
  const subPriceData = sub.priceByCountry[country];
  // Packs are one-time purchases: checkout charges oneTimePriceByCountry
  const packPriceData = (pack.oneTimePriceByCountry ?? pack.priceByCountry)[
    country
  ];

  const tierParams = getSubscriptionTiers(locale);
  const tierOf = (id: SubscriptionTierProductId): SubscriptionTier => {
    const tier = tierParams.find((entry) => entry.productId === id);
    // Every tier id is in SUBSCRIPTION_TIER_PRODUCT_IDS, so this always hits.
    return tier ?? tierParams[0];
  };
  const plus = tierOf(ProductIds.SUBSCRIPTION_PLUS);
  const pro = tierOf(ProductIds.SUBSCRIPTION_PRO);
  const ultra = tierOf(ProductIds.SUBSCRIPTION_ULTRA);

  return {
    freeCredits: String(free.credits),
    freeCreditsGuest: String(FREE_CREDIT_ALLOWANCE.guest),
    freeCreditsSignedIn: String(FREE_CREDIT_SIGNED_IN_TOTAL),
    freeCreditsNewsletterBonus: String(FREE_CREDIT_ALLOWANCE.newsletterBonus),
    freeCreditsMax: String(FREE_CREDIT_MAX_TOTAL),
    subscriptionCredits: String(sub.credits),
    packCredits: String(pack.credits),
    subscriptionPrice: formatPriceLabel(
      subPriceData.price,
      subPriceData.currency,
      locale,
    ),
    packPrice: formatPriceLabel(
      packPriceData.price,
      packPriceData.currency,
      locale,
    ),
    /** Cheapest plan price, e.g. "$8" (same as subscriptionPrice). */
    planPriceMin: formatPriceLabel(
      subPriceData.price,
      subPriceData.currency,
      locale,
    ),
    planPriceMax: ultra.priceLabel,
    planCreditsMax: ultra.creditsLabel,
    plusPrice: plus.priceLabel,
    plusCredits: plus.creditsLabel,
    proPrice: pro.priceLabel,
    proCredits: pro.creditsLabel,
    ultraPrice: ultra.priceLabel,
    ultraCredits: ultra.creditsLabel,
  };
}

/**
 * One subscription tier, priced for a locale. Every surface that lists plans
 * (subscription page, out-of-credits card, pricing copy, llms.txt, JSON-LD)
 * renders from this list.
 */
export interface SubscriptionTier {
  productId: SubscriptionTierProductId;
  planId: typeof SubscriptionPlanValue;
  name: ProductsTranslationKey;
  /** Monthly price in the locale's currency. */
  price: number;
  currency: Currencies;
  /** "$8", "30 zł", "8 €" */
  priceLabel: string;
  /** Credits granted per month. */
  credits: number;
  /** "2,050" / "2.050" / "2 050" */
  creditsLabel: string;
  /** Yearly price where the tier sells yearly , else null. */
  yearlyPrice: number | null;
  yearlyPriceLabel: string | null;
}

function formatCreditsLabel(credits: number, locale: CountryLanguage): string {
  return new Intl.NumberFormat(locale.split("-")[0]).format(credits);
}

/** All active subscription tiers for a locale, cheapest first. */
export function getSubscriptionTiers(
  locale: CountryLanguage,
): SubscriptionTier[] {
  const country = priceMarket(getCountryFromLocale(locale));
  return SUBSCRIPTION_TIER_PRODUCT_IDS.filter(
    (productId) => productDefinitions[productId].status === "active",
  ).map((productId) => {
    const def = productDefinitions[productId];
    const monthly = def.priceByCountry[country];
    const yearly =
      def.allowedIntervals.includes("year") && def.yearlyPriceByCountry
        ? def.yearlyPriceByCountry[country]
        : null;
    return {
      productId,
      planId: TIER_PLAN_BY_PRODUCT[productId],
      name: def.name,
      price: monthly.price,
      currency: monthly.currency,
      priceLabel: formatPriceLabel(monthly.price, monthly.currency, locale),
      credits: def.credits,
      creditsLabel: formatCreditsLabel(def.credits, locale),
      yearlyPrice: yearly ? yearly.price : null,
      yearlyPriceLabel: yearly
        ? formatPriceLabel(yearly.price, yearly.currency, locale)
        : null,
    };
  });
}

/** Monthly credits of a tier product. */
export function getTierCredits(productId: SubscriptionTierProductId): number {
  return productDefinitions[productId].credits;
}

/**
 * USD list prices in cents, for USD-denominated illustrations (referral
 * earnings examples are paid and shown in USD).
 */
export function getUsdPriceCents(): {
  subscriptionMonthly: number;
  creditPack: number;
} {
  const sub = productDefinitions[ProductIds.SUBSCRIPTION];
  const pack = productDefinitions[ProductIds.CREDIT_PACK];
  const packPrices = pack.oneTimePriceByCountry ?? pack.priceByCountry;
  return {
    subscriptionMonthly: Math.round(sub.priceByCountry.US.price * 100),
    creditPack: Math.round(packPrices.US.price * 100),
  };
}
