/**
 * Money SQL helpers for the payment analytics reports.
 * Payments are stored in major units in their own currency. Report totals are
 * "approx. USD": converted with the finance monitor's static FX table
 * (FINANCE_CONFIG.fxToUsd), the same rates users-stats and finance-status use.
 * Currencies without a rate count as 0, never guessed.
 */

import "server-only";

import { type SQL, sql } from "drizzle-orm";

import { FINANCE_CONFIG } from "@/finance/config";

/** Static rates shown next to every USD total so the conversion is visible. */
export const REVENUE_FX_RATES: ReadonlyArray<{
  currency: string;
  usdRate: number;
}> = Object.entries(FINANCE_CONFIG.fxToUsd)
  .filter(([code, rate]) => /^[a-z]{3}$/.test(code) && Number.isFinite(rate))
  .map(([code, rate]) => ({ currency: code.toUpperCase(), usdRate: rate }));

/**
 * `amount` (major units) in `currency` converted to approx. USD. Arguments are
 * raw SQL column references; the rates are static config, so inlining is safe.
 */
export function usdSql(amount: string, currency: string): SQL {
  const cases = REVENUE_FX_RATES.map(
    ({ currency: code, usdRate }) => `WHEN '${code}' THEN ${usdRate}`,
  ).join(" ");
  return sql.raw(
    `(${amount}::numeric * (CASE upper(${currency}) ${cases} ELSE 0 END))`,
  );
}

/** Timestamp literal comparable with UTC timestamp-without-time-zone columns. */
export function utcTs(date: Date): SQL {
  return sql`(${date.toISOString()}::timestamptz AT TIME ZONE 'UTC')`;
}
