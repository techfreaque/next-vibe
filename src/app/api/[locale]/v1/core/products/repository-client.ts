/**
 * Centralized Products & Pricing Repository
 * Single source of truth for all pricing and product data across the platform
 */

import type { JSX } from "react";
import type { TranslationKey } from "@/i18n/core/static-types";
import type {
  Countries,
  CountryLanguage,
  Currencies,
} from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";
import { SubscriptionPlan } from "@/app/api/[locale]/v1/core/subscription/enum";
import type { SubscriptionPlanValue } from "@/app/api/[locale]/v1/core/subscription/enum";

export type PaymentInterval = "month" | "year" | "one_time";

/**
 * Product definition with pricing per country
 */
export interface ProductDefinition {
  name: TranslationKey;
  description: TranslationKey;
  priceByCountry: {
    [key in Countries]: {
      price: number;
      currency: Currencies;
    };
  };
  yearlyPriceByCountry?: {
    [key in Countries]: {
      price: number;
      currency: Currencies;
    };
  };
  oneTimePriceByCountry?: {
    [key in Countries]: {
      price: number;
      currency: Currencies;
    };
  };
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
      DE: { price: 0, currency: "EUR" },
      PL: { price: 0, currency: "PLN" },
      GLOBAL: { price: 0, currency: "USD" },
    },
    credits: 20,
    isSubscription: true,
    allowedIntervals: ["month" as const],
    status: "active" as const,
  },
  subscription: {
    name: "app.api.v1.core.products.subscription.name" as const,
    description: "app.api.v1.core.products.subscription.description" as const,
    priceByCountry: {
      DE: { price: 10, currency: "EUR" },
      PL: { price: 10, currency: "PLN" },
      GLOBAL: { price: 10, currency: "USD" },
    },
    yearlyPriceByCountry: {
      DE: { price: 100, currency: "EUR" },
      PL: { price: 100, currency: "PLN" },
      GLOBAL: { price: 100, currency: "USD" },
    },
    oneTimePriceByCountry: {
      DE: { price: 15, currency: "EUR" },
      PL: { price: 15, currency: "PLN" },
      GLOBAL: { price: 15, currency: "USD" },
    },
    credits: 1000,
    isSubscription: true,
    allowedIntervals: ["month" as const, "year" as const, "one_time" as const],
    status: "active" as const,
  },
  credit_pack: {
    name: "app.api.v1.core.products.creditPack.name" as const,
    description: "app.api.v1.core.products.creditPack.description" as const,
    priceByCountry: {
      DE: { price: 5, currency: "EUR" },
      PL: { price: 5, currency: "PLN" },
      GLOBAL: { price: 5, currency: "USD" },
    },
    oneTimePriceByCountry: {
      DE: { price: 5, currency: "EUR" },
      PL: { price: 5, currency: "PLN" },
      GLOBAL: { price: 5, currency: "USD" },
    },
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

    // Get price and currency based on interval and country
    let priceData: { price: number; currency: Currencies };
    if (interval === "year" && "yearlyPriceByCountry" in definition) {
      priceData = definition.yearlyPriceByCountry[country];
    } else if (
      interval === "one_time" &&
      "oneTimePriceByCountry" in definition
    ) {
      priceData = definition.oneTimePriceByCountry[country];
    } else {
      priceData = definition.priceByCountry[country];
    }

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
      status: definition.status || "active",
      deprecatedAt: ("deprecatedAt" in definition
        ? definition.deprecatedAt
        : undefined) as Date | undefined,
      replacedBy: ("replacedBy" in definition
        ? definition.replacedBy
        : undefined) as ProductIds | undefined,
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
      [ProductIds.CREDIT_PACK]: this.getProduct(ProductIds.CREDIT_PACK, locale),
    };
  }

  /**
   * Get a specific product with translated strings
   * Single source of truth for all product display text
   */
  getTranslatedProduct(
    productId: ProductIds,
    locale: CountryLanguage,
    interval: PaymentInterval = "month",
  ): TranslatedProduct {
    const product = this.getProduct(productId, locale, interval);
    const [language] = locale.split("-") as ["en" | "de" | "pl", string];

    // Get translated strings based on product ID and language
    const translations = this.getProductTranslations(
      productId,
      language,
      product,
    );

    return {
      ...product,
      name: translations.name,
      description: translations.description,
      longDescription: translations.longDescription,
      features: translations.features,
    };
  }

  /**
   * Get all products with translated strings for a specific locale
   */
  getTranslatedProducts(
    locale: CountryLanguage,
  ): Record<ProductIds, TranslatedProduct> {
    return {
      [ProductIds.FREE_TIER]: this.getTranslatedProduct(
        ProductIds.FREE_TIER,
        locale,
      ),
      [ProductIds.SUBSCRIPTION]: this.getTranslatedProduct(
        ProductIds.SUBSCRIPTION,
        locale,
      ),
      [ProductIds.CREDIT_PACK]: this.getTranslatedProduct(
        ProductIds.CREDIT_PACK,
        locale,
      ),
    };
  }

  /**
   * Get hardcoded translations for a product
   * This is the single source of truth for product text in all languages
   */
  private getProductTranslations(
    productId: ProductIds,
    language: "en" | "de" | "pl",
    product: Product,
  ): {
    name: string;
    description: string;
    longDescription?: string;
    features?: string[];
  } {
    const { price, currency, credits } = product;
    const currencySymbol =
      currency === "EUR" ? "€" : currency === "PLN" ? "zł" : "$";

    switch (productId) {
      case ProductIds.FREE_TIER:
        return this.getFreeTierTranslations(language, credits);

      case ProductIds.SUBSCRIPTION:
        return this.getSubscriptionTranslations(
          language,
          price,
          currencySymbol,
          credits,
        );

      case ProductIds.CREDIT_PACK:
        return this.getCreditPackTranslations(
          language,
          price,
          currencySymbol,
          credits,
        );

      default:
        // Fallback to English
        return {
          name: "Unknown Product",
          description: "Product information not available",
        };
    }
  }

  /**
   * Free Tier translations
   */
  private getFreeTierTranslations(
    language: "en" | "de" | "pl",
    credits: number,
  ): {
    name: string;
    description: string;
    longDescription?: string;
    features?: string[];
  } {
    switch (language) {
      case "de":
        return {
          name: "Kostenlos",
          description:
            "Starten Sie mit kostenlosen Credits - keine Karte erforderlich",
          longDescription: `${credits} kostenlose Credits zum Ausprobieren`,
          features: [
            `${credits} Credits zum Start`,
            "Zugriff auf alle 40+ KI-Modelle",
            "Alle Ordnertypen (privat, inkognito, geteilt, öffentlich)",
            "Community-Personas verwenden",
            "Community-Support",
          ],
        };

      case "pl":
        return {
          name: "Darmowy plan",
          description: "Zacznij z darmowymi kredytami - bez karty kredytowej",
          longDescription: `${credits} darmowych kredytów do wypróbowania`,
          features: [
            `${credits} kredytów na start`,
            "Dostęp do wszystkich 40+ modeli AI",
            "Wszystkie typy folderów (prywatne, incognito, współdzielone, publiczne)",
            "Korzystanie z person społeczności",
            "Wsparcie społeczności",
          ],
        };

      default: // en
        return {
          name: "Free Tier",
          description: "Get started with free credits - no card required",
          longDescription: `${credits} free credits to try out`,
          features: [
            `${credits} credits to start`,
            "Access to all 40+ AI models",
            "All folder types (private, incognito, shared, public)",
            "Use community personas",
            "Community support",
          ],
        };
    }
  }

  /**
   * Subscription translations
   */
  private getSubscriptionTranslations(
    language: "en" | "de" | "pl",
    price: number,
    currencySymbol: string,
    credits: number,
  ): {
    name: string;
    description: string;
    longDescription?: string;
    features?: string[];
  } {
    switch (language) {
      case "de":
        return {
          name: "Monatsabonnement",
          description: `${currencySymbol}${price}/Monat - Für alle zugänglich`,
          longDescription: `Erschwinglicher KI-Zugang mit ${credits} Credits monatlich`,
          features: [
            `${credits} Credits pro Monat`,
            "Alle 40+ KI-Modelle",
            "Alle Funktionen enthalten",
            "Jederzeit kündbar",
            "Credits laufen monatlich ab",
          ],
        };

      case "pl":
        return {
          name: "Subskrypcja miesięczna",
          description: `${currencySymbol}${price}/miesiąc - Dostępne dla wszystkich`,
          longDescription: `Przystępny dostęp do AI z ${credits} kredytów miesięcznie`,
          features: [
            `${credits} kredytów miesięcznie`,
            "Wszystkie 40+ modeli AI",
            "Wszystkie funkcje włączone",
            "Anuluj w dowolnym momencie",
            "Kredyty wygasają co miesiąc",
          ],
        };

      default: // en
        return {
          name: "Monthly Subscription",
          description: `${currencySymbol}${price}/month - Accessible for everyone`,
          longDescription: `Affordable AI access with ${credits} credits monthly`,
          features: [
            `${credits} credits per month`,
            "All 40+ AI models",
            "All features included",
            "Cancel anytime",
            "Credits expire monthly",
          ],
        };
    }
  }

  /**
   * Credit Pack translations
   */
  private getCreditPackTranslations(
    language: "en" | "de" | "pl",
    price: number,
    currencySymbol: string,
    credits: number,
  ): {
    name: string;
    description: string;
    longDescription?: string;
    features?: string[];
  } {
    switch (language) {
      case "de":
        return {
          name: "Credit-Paket",
          description: "Zusätzliche Credits für Power-User",
          longDescription: `${currencySymbol}${price} für ${credits} Credits, die nie ablaufen`,
          features: [
            `${credits} Credits pro Paket`,
            "Alle KI-Modelle enthalten",
            "Alle Funktionen enthalten",
            "Mehrere Pakete kaufen",
            "Credits laufen nie ab",
          ],
        };

      case "pl":
        return {
          name: "Pakiet kredytów",
          description: "Dodatkowe kredyty dla zaawansowanych użytkowników",
          longDescription: `${currencySymbol}${price} za ${credits} kredytów, które nigdy nie wygasają`,
          features: [
            `${credits} kredytów na pakiet`,
            "Wszystkie modele AI włączone",
            "Wszystkie funkcje włączone",
            "Kup wiele pakietów",
            "Kredyty nigdy nie wygasają",
          ],
        };

      default: // en
        return {
          name: "Credit Pack",
          description: "Extra credits for power users",
          longDescription: `${currencySymbol}${price} for ${credits} credits that never expire`,
          features: [
            `${credits} credits per pack`,
            "All AI models included",
            "All features included",
            "Buy multiple packs",
            "Credits never expire",
          ],
        };
    }
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
    const replacedBy = (
      "replacedBy" in definition ? definition.replacedBy : undefined
    ) as ProductIds | undefined;
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

/**
 * ============================================================================
 * PRICING PLAN INTERFACES AND HELPERS
 * Replaces story/pricing/_components/pricing.tsx
 * ============================================================================
 */

/**
 * Pricing plan interface for UI display
 * Contains all information needed to render pricing cards
 */
export interface PricingPlan {
  id: typeof SubscriptionPlanValue;
  name: TranslationKey;
  description: TranslationKey;
  features: TranslationKey[];
  premiumFeatures?: {
    feature: TranslationKey;
    className?: string;
    icon: JSX.Element;
  }[];
  priceByCountry: {
    [key in Countries]: {
      monthly: number;
      annual: number;
      currency: Currencies;
    };
  };
  pricing: TranslationKey;
  cta: TranslationKey;
  highlighted: boolean;
  icon?: JSX.Element; // Optional - must be provided by client components
  badge?: TranslationKey;
}

/**
 * Get price for a specific plan, country, and billing interval
 */
export function getPlanPriceForCountry(
  plan: PricingPlan,
  country: Countries,
  isAnnual: boolean,
): number {
  return isAnnual
    ? plan.priceByCountry[country].annual
    : plan.priceByCountry[country].monthly;
}

/**
 * Calculate average savings percentage when choosing annual over monthly billing
 */
export function calculateSavingsPercent(locale: CountryLanguage): number {
  const plans = getPricingPlansArray(locale);
  const country = getCountryFromLocale(locale);
  let totalSavingsPercent = 0;
  let validPlansCount = 0;

  for (const plan of plans) {
    const monthlyPrice = plan.priceByCountry[country].monthly;
    const annualMonthlyPrice = plan.priceByCountry[country].annual;

    if (monthlyPrice > 0 && annualMonthlyPrice > 0) {
      const savings = monthlyPrice - annualMonthlyPrice;
      const savingsPercent = (savings / monthlyPrice) * 100;

      totalSavingsPercent += savingsPercent;
      validPlansCount++;
    }
  }

  return validPlansCount === 0
    ? 0
    : Math.round(totalSavingsPercent / validPlansCount);
}

/**
 * Build pricing plans with icon components
 * Note: Icons are lazy-loaded to avoid circular dependencies
 */
function buildPricingPlans(
  locale: CountryLanguage,
  icon?: JSX.Element,
): Record<typeof SubscriptionPlanValue, PricingPlan> {
  const definitions = productsRepository.getProductDefinitions();
  const subscriptionDef = definitions[ProductIds.SUBSCRIPTION];

  // Helper to get price and currency for specific country and interval
  const getPriceData = (
    country: Countries,
    interval: PaymentInterval,
  ): { price: number; currency: Currencies } => {
    if (interval === "year" && subscriptionDef.yearlyPriceByCountry) {
      return subscriptionDef.yearlyPriceByCountry[country];
    }
    return subscriptionDef.priceByCountry[country];
  };

  return {
    [SubscriptionPlan.SUBSCRIPTION]: {
      id: SubscriptionPlan.SUBSCRIPTION,
      name: subscriptionDef.name,
      description: subscriptionDef.description,
      features: [
        "app.story.pricing.plans.STARTER.features.messages" as TranslationKey,
        "app.story.pricing.plans.STARTER.features.models" as TranslationKey,
        "app.story.pricing.plans.STARTER.features.folders" as TranslationKey,
        "app.story.pricing.plans.STARTER.features.personas" as TranslationKey,
      ],
      priceByCountry: {
        DE: {
          monthly: getPriceData("DE", "month").price,
          annual: getPriceData("DE", "year").price,
          currency: getPriceData("DE", "month").currency,
        },
        PL: {
          monthly: getPriceData("PL", "month").price,
          annual: getPriceData("PL", "year").price,
          currency: getPriceData("PL", "month").currency,
        },
        GLOBAL: {
          monthly: getPriceData("GLOBAL", "month").price,
          annual: getPriceData("GLOBAL", "year").price,
          currency: getPriceData("GLOBAL", "month").currency,
        },
      },
      pricing: "app.story.pricing.plans.STARTER.price" as TranslationKey,
      cta: "app.story.pricing.plans.STARTER.cta" as TranslationKey,
      highlighted: false,
      icon: icon,
    },
  };
}

/**
 * Get all pricing plans for a locale as a record
 */
export function getPricingPlans(
  locale: CountryLanguage,
  icon?: JSX.Element,
): Record<typeof SubscriptionPlanValue, PricingPlan> {
  return buildPricingPlans(locale, icon);
}

/**
 * Get specific plan details by ID
 */
export function getPlanDetails(
  planId: typeof SubscriptionPlanValue,
  locale: CountryLanguage,
  icon?: JSX.Element,
): PricingPlan {
  return getPricingPlans(locale, icon)[planId];
}

/**
 * Get all pricing plans as an array
 */
export function getPricingPlansArray(
  locale: CountryLanguage,
  icon?: JSX.Element,
): PricingPlan[] {
  return Object.values(getPricingPlans(locale, icon));
}

/**
 * Pricing comparison feature interfaces
 */
export interface PricingFeature {
  name: TranslationKey;
  [SubscriptionPlan.SUBSCRIPTION]: boolean;
}

export interface PricingTextFeature {
  name: TranslationKey;
  type: "text";
  [SubscriptionPlan.SUBSCRIPTION]: TranslationKey;
}

export type PricingComparisonFeature = PricingFeature | PricingTextFeature;

/**
 * Pricing comparison features data
 * Currently empty - add features as needed
 */
export const pricingComparisonFeatures: PricingComparisonFeature[] = [];
