/**
 * Centralized Products & Pricing Repository
 * Single source of truth for all pricing and product data across the platform
 */

import type { TranslationKey } from "@/i18n/core/static-types";
import type { Countries, CountryLanguage, Currencies } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";

/**
 * Product definition with pricing per country
 */
export interface ProductDefinition {
  name: TranslationKey;
  description: TranslationKey;
  priceByCountry: {
    [key in Countries]: number;
  };
  currency: Currencies;
  isSubscription: boolean;
  credits: number;
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
  credits: number;
  country: Countries;
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
  },
  subscription: {
    name: "app.api.v1.core.products.subscription.name" as const,
    description: "app.api.v1.core.products.subscription.description" as const,
    priceByCountry: {
      DE: 10,
      PL: 10,
      GLOBAL: 10,
    },
    currency: "EUR" as const,
    credits: 1000,
    isSubscription: true,
  },
  credit_pack: {
    name: "app.api.v1.core.products.creditPack.name" as const,
    description: "app.api.v1.core.products.creditPack.description" as const,
    priceByCountry: {
      DE: 5,
      PL: 5,
      GLOBAL: 5,
    },
    currency: "EUR" as const,
    credits: 500,
    isSubscription: false,
  },
} as const satisfies Record<ProductIds, ProductDefinition>;

/**
 * Products Repository Interface
 */
export interface ProductsRepository {
  /**
   * Get a specific product for a locale
   */
  getProduct(productId: ProductIds, locale: CountryLanguage): Product;

  /**
   * Get all products for a specific locale
   */
  getProducts(locale: CountryLanguage): Record<ProductIds, Product>;

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
   * Get a specific product for a locale
   */
  getProduct(productId: ProductIds, locale: CountryLanguage): Product {
    const country = getCountryFromLocale(locale);
    const definition = productDefinitions[productId];

    return {
      id: productId,
      name: definition.name,
      description: definition.description,
      price: definition.priceByCountry[country],
      currency: definition.currency,
      isSubscription: definition.isSubscription,
      credits: definition.credits,
      country,
    };
  }

  /**
   * Get all products for a specific locale
   */
  getProducts(locale: CountryLanguage): Record<ProductIds, Product> {
    const country = getCountryFromLocale(locale);

    return {
      [ProductIds.FREE_TIER]: this.getProduct(ProductIds.FREE_TIER, locale),
      [ProductIds.SUBSCRIPTION]: this.getProduct(ProductIds.SUBSCRIPTION, locale),
      [ProductIds.CREDIT_PACK]: this.getProduct(ProductIds.CREDIT_PACK, locale),
    };
  }

  /**
   * Get raw product definitions (for backward compatibility)
   */
  getProductDefinitions(): Record<ProductIds, ProductDefinition> {
    return productDefinitions;
  }
}

export const productsRepository = new ProductsRepositoryImpl();
