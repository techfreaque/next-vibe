import type { CountryLanguage } from "@/i18n/core/config";
import { createScopedTranslation } from "@/i18n/core/scoped-translation";
import {
  REFERRAL_CONFIG,
  computeLevelPercentages,
} from "@/app/api/[locale]/referral/config";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () => require("./de").translations,
  pl: () => require("./pl").translations,
});

export type ReferralPageTranslationKey =
  (typeof scopedTranslation)["ScopedTranslationKey"];

export type ReferralPageT = ReturnType<typeof scopedTranslation.scopedT>["t"];

export interface CommissionRow {
  who: string;
  pct: string;
  example: string;
}

/** Format a decimal fraction as a percentage string: 0.1 → "10%", 0.05156 → "5.2%" */
function fmtPct(value: number): string {
  const rounded = Math.round(value * 1000) / 10;
  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}%`;
}

/** Format cents as dollars: 200 → "$2", 250 → "$2.50" */
function fmtDollars(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

/**
 * All interpolation params derived from REFERRAL_CONFIG.
 * Pass these as the second argument to every t() call that contains {{}} placeholders.
 */
export function getReferralParams(): Record<string, string> {
  const percentages = computeLevelPercentages();
  const examplePrice = REFERRAL_CONFIG.EXAMPLE_PRICE_CENTS;
  const directPct = fmtPct(REFERRAL_CONFIG.DIRECT_PERCENTAGE);
  const uplinePct = fmtPct(REFERRAL_CONFIG.UPLINE_PERCENTAGE);
  const totalPct = fmtPct(
    REFERRAL_CONFIG.DIRECT_PERCENTAGE + REFERRAL_CONFIG.UPLINE_PERCENTAGE,
  );

  return {
    directPct,
    uplinePct,
    totalPct,
    level2Pct: fmtPct(percentages[1] ?? 0),
    level3Pct: fmtPct(percentages[2] ?? 0),
    maxUplineLevels: String(REFERRAL_CONFIG.MAX_UPLINE_LEVELS),
    examplePrice: fmtDollars(examplePrice),
    exampleDirectEarning: fmtDollars(
      Math.round(examplePrice * REFERRAL_CONFIG.DIRECT_PERCENTAGE),
    ),
    minPayout: fmtDollars(REFERRAL_CONFIG.MIN_PAYOUT_CENTS),
    cryptoPayoutHours: String(REFERRAL_CONFIG.CRYPTO_PAYOUT_HOURS),
  };
}

/**
 * Returns the locale-specific commission table rows with pct and example
 * computed from REFERRAL_CONFIG so they stay accurate if config changes.
 */
export function getCommissionRows(locale: CountryLanguage): CommissionRow[] {
  const lang = locale.split("-")[0];

  const whoLabels: string[] = (() => {
    if (lang === "de") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return (require("./de").translations as typeof enTranslations)
        .commissionTable.whoLabels as string[];
    }
    if (lang === "pl") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return (require("./pl").translations as typeof enTranslations)
        .commissionTable.whoLabels as string[];
    }
    return enTranslations.commissionTable.whoLabels;
  })();

  const percentages = computeLevelPercentages();
  const examplePrice = REFERRAL_CONFIG.EXAMPLE_PRICE_CENTS;

  return percentages.map((pct, i) => ({
    who: whoLabels[i] ?? `Level ${i + 1}`,
    pct: fmtPct(pct),
    example: `${fmtDollars(Math.round(examplePrice * pct))} / mo`,
  }));
}
