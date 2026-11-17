/**
 * What unlocks the API, in one place: the /v1 402 message, the API key page,
 * /docs/api and the blog posts all read the page and the prices from here.
 * The rule itself lives in ./paid.ts (any plan or any credit purchase). Copy
 * names only the plans: a credit pack needs an active plan, so "any plan, from
 * {{subPrice}} a month" is the whole offer.
 *
 * Client-safe: no server-only imports.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { formatCurrency } from "next-vibe/core/i18n/core/localization-utils";

import { ProductIds, productsRepository } from "@/products/repository-client";

/** Page that sells the plans (relative to /<locale>). */
export const API_UNLOCK_PATH = "subscription/buy" as const;

// A type alias (not an interface) so it passes straight in as i18n params.
export interface ApiAccessPrices {
  /** One-time credit pack price, localized (e.g. "$5"). */
  packPrice: string;
  /** Cheapest monthly plan price, localized ("any plan, from $8 a month"). */
  subPrice: string;
}

export function getApiAccessPrices(locale: CountryLanguage): ApiAccessPrices {
  const products = productsRepository.getProducts(locale);
  const pack = products[ProductIds.CREDIT_PACK];
  const subscription = products[ProductIds.SUBSCRIPTION];
  return {
    packPrice: formatWholePrice(
      formatCurrency(pack.price, pack.currency, locale),
    ),
    subPrice: formatWholePrice(
      formatCurrency(subscription.price, subscription.currency, locale),
    ),
  };
}

/** "$5.00" -> "$5", "5,00 €" -> "5 €": whole prices read cleaner in copy. */
function formatWholePrice(formatted: string): string {
  return formatted.replace(/[.,]00(?=\D*$)/, "");
}

/** Absolute URL of the unlock page, for messages read outside the app. */
export function buildApiUnlockUrl(
  origin: string,
  locale: CountryLanguage,
): string {
  return `${origin.replace(/\/+$/, "")}/${locale}/${API_UNLOCK_PATH}`;
}
