/**
 * Credits → money, in the visitor's own currency.
 * Anchored to what one credit actually costs when bought (credit pack, one-time
 * price), so "≈ $0.03" in the model selector matches the checkout page.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";

import { FREE_CREDIT_SIGNED_IN_TOTAL } from "./constants";
import { ProductIds, productsRepository } from "./repository-client";

/** Price of a single credit in the locale's checkout currency. */
export function getCreditUnitPrice(locale: CountryLanguage): {
  amount: number;
  currency: string;
} {
  const pack = productsRepository.getProduct(
    ProductIds.CREDIT_PACK,
    locale,
    "one_time",
  );
  return {
    amount: pack.credits > 0 ? pack.price / pack.credits : 0,
    currency: pack.currency,
  };
}

function formatMoney(
  amount: number,
  currency: string,
  locale: CountryLanguage,
): string {
  return new Intl.NumberFormat(getLanguageFromLocale(locale), {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Money value of a credit amount: "≈ $0.03", "< $0.01" for dust, null for free.
 */
export function formatCreditsAsMoney(
  credits: number,
  locale: CountryLanguage,
): string | null {
  if (credits <= 0) {
    return null;
  }
  const { amount, currency } = getCreditUnitPrice(locale);
  const value = credits * amount;
  if (value < 0.01) {
    return `< ${formatMoney(0.01, currency, locale)}`;
  }
  return `≈ ${formatMoney(value, currency, locale)}`;
}

/** Formatted price of one credit, e.g. "$0.01" / "0,08 zł". */
export function formatCreditUnitPrice(locale: CountryLanguage): string {
  const { amount, currency } = getCreditUnitPrice(locale);
  return formatMoney(amount, currency, locale);
}

/**
 * How many messages at this per-message cost the signed-in free allowance covers.
 * null when the cost is zero (unlimited) or the allowance can't cover one message.
 */
export function freePlanMessageCount(creditsPerMessage: number): number | null {
  if (creditsPerMessage <= 0) {
    return null;
  }
  const count = Math.floor(FREE_CREDIT_SIGNED_IN_TOTAL / creditsPerMessage);
  return count > 0 ? count : null;
}

/** Signed-in free allowance per month (credits), before the newsletter bonus. */
export const FREE_PLAN_MONTHLY_CREDITS = FREE_CREDIT_SIGNED_IN_TOTAL;
