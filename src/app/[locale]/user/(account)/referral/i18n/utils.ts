import type { CountryLanguage } from "@/i18n/core/config";
import {
  REFERRAL_CONFIG,
  computeLevelPercentages,
} from "@/app/api/[locale]/referral/config";

import type { ReferralPageT } from ".";

export interface CommissionRow {
  who: string;
  pct: string;
  example: string;
  /** Earning per month with 10 subscribers at the example price */
  tenPersonEarning: string;
  /** 0–100, relative to level-1 earning for bar width */
  barPct: number;
}

export interface ChainScenario {
  levelCount: number;
  earning: string;
  addedEarning: string;
  totalBarPct: number;
}

const WHO_LABEL_KEYS = [
  "commissionTable.whoLabel0",
  "commissionTable.whoLabel1",
  "commissionTable.whoLabel2",
  "commissionTable.whoLabel3",
  "commissionTable.whoLabel4",
  "commissionTable.whoLabel5",
] as const;

/**
 * Format a decimal fraction as a percentage string.
 * Uses the minimum decimals needed to show the exact halving sequence:
 * 0.1 → "10%", 0.05 → "5%", 0.025 → "2.5%", 0.0125 → "1.25%", 0.00625 → "0.625%"
 */
function fmtPct(value: number): string {
  const pct = value * 100;
  const r3 = Math.round(pct * 1000) / 1000;
  if (r3 % 1 === 0) {
    return `${r3.toFixed(0)}%`;
  }
  const r1 = Math.round(pct * 10) / 10;
  if (r1 === r3) {
    return `${r1.toFixed(1)}%`;
  }
  const r2 = Math.round(pct * 100) / 100;
  if (r2 === r3) {
    return `${r2.toFixed(2)}%`;
  }
  return `${r3.toFixed(3)}%`;
}

/**
 * Format cents as a locale-aware USD amount.
 * e.g. en-US: $20.00, de-DE: 20,00 $, pl-PL: 20,00 USD
 * Omits decimal places when the amount is a whole dollar.
 */
function fmtUSD(cents: number, locale: CountryLanguage): string {
  const dollars = cents / 100;
  const hasDecimals = cents % 100 !== 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(dollars);
}

/**
 * All interpolation params derived from REFERRAL_CONFIG.
 * Pass these as the second argument to every t() call that contains {{}} placeholders.
 */
export function getReferralParams(
  locale: CountryLanguage,
): Record<string, string> {
  const percentages = computeLevelPercentages();
  const examplePrice = REFERRAL_CONFIG.EXAMPLE_PRICE_CENTS;
  const directPct = fmtPct(REFERRAL_CONFIG.DIRECT_PERCENTAGE);
  const uplinePct = fmtPct(REFERRAL_CONFIG.UPLINE_PERCENTAGE);
  const totalPct = fmtPct(
    REFERRAL_CONFIG.DIRECT_PERCENTAGE + REFERRAL_CONFIG.UPLINE_PERCENTAGE,
  );

  const skillBonusPct = percentages[1] ?? 0;
  const skillTotalPct = REFERRAL_CONFIG.DIRECT_PERCENTAGE + skillBonusPct;

  const noobUsers = 10;
  const midUsers = 50;
  const proUsers = 200;
  const subPrice = examplePrice;

  const noobEarningCents = Math.round(
    noobUsers * subPrice * REFERRAL_CONFIG.DIRECT_PERCENTAGE,
  );
  const midEarningCents = Math.round(
    30 * subPrice * REFERRAL_CONFIG.DIRECT_PERCENTAGE +
      20 * subPrice * skillTotalPct +
      10 * subPrice * (percentages[1] ?? 0),
  );
  const proEarningCents = Math.round(
    120 * subPrice * REFERRAL_CONFIG.DIRECT_PERCENTAGE +
      80 * subPrice * skillTotalPct +
      50 * subPrice * (percentages[1] ?? 0),
  );

  return {
    directPct,
    uplinePct,
    totalPct,
    skillBonusPct: fmtPct(skillBonusPct),
    skillPct: fmtPct(skillTotalPct),
    level2Pct: fmtPct(percentages[1] ?? 0),
    level3Pct: fmtPct(percentages[2] ?? 0),
    maxUplineLevels: String(REFERRAL_CONFIG.MAX_UPLINE_LEVELS),
    examplePrice: fmtUSD(examplePrice, locale),
    exampleDirectEarning: fmtUSD(
      Math.round(examplePrice * REFERRAL_CONFIG.DIRECT_PERCENTAGE),
      locale,
    ),
    minPayout: fmtUSD(REFERRAL_CONFIG.MIN_PAYOUT_CENTS, locale),
    cryptoPayoutHours: String(REFERRAL_CONFIG.CRYPTO_PAYOUT_HOURS),
    story_noob_users: String(noobUsers),
    story_noob_earning: fmtUSD(noobEarningCents, locale),
    story_mid_users: String(midUsers),
    story_mid_earning: fmtUSD(midEarningCents, locale),
    story_pro_users: String(proUsers),
    story_pro_earning: fmtUSD(proEarningCents, locale),
  };
}

/**
 * Builds commission table rows using the scoped t() for all translated strings.
 */
export function buildCommissionRows(
  locale: CountryLanguage,
  t: ReferralPageT,
): CommissionRow[] {
  const percentages = computeLevelPercentages();
  const examplePrice = REFERRAL_CONFIG.EXAMPLE_PRICE_CENTS;
  const TEN_USERS = 10;
  const level1Earning = Math.round(
    examplePrice * (percentages[0] ?? 0) * TEN_USERS,
  );
  const perMonth = t("commissionTable.perMonth");

  return percentages.map((pct, i) => {
    const tenPersonCents = Math.round(examplePrice * pct * TEN_USERS);
    const whoKey =
      WHO_LABEL_KEYS[i] ?? WHO_LABEL_KEYS[WHO_LABEL_KEYS.length - 1];
    return {
      who: t(whoKey),
      pct: fmtPct(pct),
      example: `${fmtUSD(Math.round(examplePrice * pct), locale)} ${perMonth}`,
      tenPersonEarning: fmtUSD(tenPersonCents, locale),
      barPct:
        level1Earning > 0
          ? Math.round((tenPersonCents / level1Earning) * 100)
          : 0,
    };
  });
}

/**
 * Total monthly earning across all chain levels with 10 subscribers.
 */
export function getChainTotal(locale: CountryLanguage): string {
  const percentages = computeLevelPercentages();
  const examplePrice = REFERRAL_CONFIG.EXAMPLE_PRICE_CENTS;
  const TEN_USERS = 10;
  const totalCents = percentages.reduce(
    (sum, pct) => sum + Math.round(examplePrice * pct * TEN_USERS),
    0,
  );
  return fmtUSD(totalCents, locale);
}

/**
 * Cumulative scenario: how earnings grow as each chain level activates.
 */
export function getChainScenarios(locale: CountryLanguage): ChainScenario[] {
  const percentages = computeLevelPercentages();
  const examplePrice = REFERRAL_CONFIG.EXAMPLE_PRICE_CENTS;
  const TEN_USERS = 10;

  const levelEarnings = percentages.map((pct) =>
    Math.round(examplePrice * pct * TEN_USERS),
  );
  const fullTotal = levelEarnings.reduce((s, v) => s + v, 0);

  const result: ChainScenario[] = [];
  for (let i = 0; i < levelEarnings.length; i++) {
    const cumulative = levelEarnings.slice(0, i + 1).reduce((s, v) => s + v, 0);
    result.push({
      levelCount: i + 1,
      earning: fmtUSD(cumulative, locale),
      addedEarning: fmtUSD(levelEarnings[i] ?? 0, locale),
      totalBarPct:
        fullTotal > 0 ? Math.round((cumulative / fullTotal) * 100) : 0,
    });
  }
  return result;
}
