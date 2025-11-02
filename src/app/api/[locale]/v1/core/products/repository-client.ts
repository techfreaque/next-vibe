/**
 * Centralized Products & Pricing Repository
 * Single source of truth for all pricing and product data across the platform
 */

import type { TranslationKey } from "@/i18n/core/static-types";
import type { Countries, CountryLanguage, Currencies } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";

export type PaymentInterval = "month" | "year" | "one_time";

/**
 * Product definition with pricing per country
 */
export interface ProductDefinition {
  name: TranslationKey;
  description: TranslationKey;
  priceByCountry: {
    [key in Countries]: number;
  };
  yearlyPriceByCountry?: {
    [key in Countries]: number;
  };
  oneTimePriceByCountry?: {
    [key in Countries]: number;
  };
  currency: Currencies;
  isSubscription: boolean;
  allowedIntervals: PaymentInterval[];
  credits: number;
  status?: "active" | "deprecated";
  deprecatedAt?: Date;
  replacedBy?: ProductIds;
}

/**
 * Product with price for specific locale
 */
export interface Product {
  id: ProductIds;
  name: TranslationKey;
  description: TranslationKey;
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
  SUBSCRIPTION = "subscription",
  CREDIT_PACK = "credit_pack",
}

/**
 * Internal product definitions with pricing for all countries
 */
const productDefinitions = {
  free_tier: {
    name: "app.api.v1.core.products.free.name" as const,
    description: "app.api.v1.core.products.free.description" as const,
    priceByCountry: {
      DE: 0,
      PL: 0,
      GLOBAL: 0,
    },
    currency: "EUR" as const,
    credits: 20,
    isSubscription: true,
    allowedIntervals: ["month" as const],
    status: "active" as const,
  },
  subscription: {
    name: "app.api.v1.core.products.subscription.name" as const,
    description: "app.api.v1.core.products.subscription.description" as const,
    priceByCountry: {
      DE: 10,
      PL: 10,
      GLOBAL: 10,
    },
    yearlyPriceByCountry: {
      DE: 100,
      PL: 100,
      GLOBAL: 100,
    },
    oneTimePriceByCountry: {
      DE: 15,
      PL: 15,
      GLOBAL: 15,
    },
    currency: "EUR" as const,
    credits: 1000,
    isSubscription: true,
    allowedIntervals: ["month" as const, "year" as const, "one_time" as const],
    status: "active" as const,
  },
  credit_pack: {
    name: "app.api.v1.core.products.creditPack.name" as const,
    description: "app.api.v1.core.products.creditPack.description" as const,
    priceByCountry: {
      DE: 5,
      PL: 5,
      GLOBAL: 5,
    },
    oneTimePriceByCountry: {
      DE: 5,
      PL: 5,
      GLOBAL: 5,
    },
    currency: "EUR" as const,
    credits: 500,
    isSubscription: false,
    allowedIntervals: ["one_time" as const],
    status: "active" as const,
  },
} as const satisfies Record<ProductIds, ProductDefinition>;

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
    const definition = productDefinitions[productId];

    // Get price based on interval
    let price: number;
    if (interval === "year" && "yearlyPriceByCountry" in definition) {
      price = definition.yearlyPriceByCountry[country];
    } else if (interval === "one_time" && "oneTimePriceByCountry" in definition) {
      price = definition.oneTimePriceByCountry[country];
    } else {
      price = definition.priceByCountry[country];
    }

    return {
      id: productId,
      name: definition.name,
      description: definition.description,
      price,
      currency: definition.currency,
      isSubscription: definition.isSubscription,
      allowedIntervals: definition.allowedIntervals,
      credits: definition.credits,
      country,
      status: definition.status || "active",
      deprecatedAt: ("deprecatedAt" in definition ? definition.deprecatedAt : undefined) as Date | undefined,
      replacedBy: ("replacedBy" in definition ? definition.replacedBy : undefined) as ProductIds | undefined,
    };
  }

  /**
   * Get all products for a specific locale
   */
  getProducts(locale: CountryLanguage): Record<ProductIds, Product> {
    return {
      [ProductIds.FREE_TIER]: this.getProduct(ProductIds.FREE_TIER, locale),
      [ProductIds.SUBSCRIPTION]: this.getProduct(ProductIds.SUBSCRIPTION, locale),
      [ProductIds.CREDIT_PACK]: this.getProduct(ProductIds.CREDIT_PACK, locale),
    };
  }

  /**
   * Check if a product can be purchased (not deprecated)
   */
  canPurchase(productId: ProductIds): boolean {
    const definition = productDefinitions[productId];
    return (definition.status || "active") === "active";
  }

  /**
   * Check if a product is deprecated (for existing subscribers check)
   */
  isDeprecated(productId: ProductIds): boolean {
    const definition = productDefinitions[productId];
    const status = (definition.status || "active") as "active" | "deprecated";
    return status === "deprecated";
  }

  /**
   * Get replacement product ID for a deprecated product
   */
  getReplacementProduct(productId: ProductIds): ProductIds | null {
    const definition = productDefinitions[productId];
    const replacedBy = ("replacedBy" in definition ? definition.replacedBy : undefined) as ProductIds | undefined;
    return replacedBy || null;
  }

  /**
   * Get raw product definitions (for backward compatibility)
   */
  getProductDefinitions(): Record<ProductIds, ProductDefinition> {
    return productDefinitions;
  }
}

export const productsRepository = new ProductsRepositoryImpl();
