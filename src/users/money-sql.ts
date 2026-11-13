/**
 * Money SQL helpers for the admin user tools.
 * Payments are stored in major units (numeric 10,2) in their own currency.
 * Business totals are normalized to USD with the finance monitor's static FX
 * table, so users-list, users-view and users-stats agree with finance-status.
 */

import "server-only";

import { type AnyColumn, type SQL, sql } from "drizzle-orm";

import { FINANCE_CONFIG } from "@/finance/config";

/** Internal value of one credit in USD (1 credit = $0.01). */
export const CREDIT_VALUE_USD = FINANCE_CONFIG.creditValueUsd;

/**
 * SQL expression converting `amount` (major units) in `currency` to USD.
 * Currencies without an FX rate count as 0, never guessed.
 * Rates come from a static config table, so inlining them is injection-safe.
 */
export function usdAmountSql(amount: AnyColumn, currency: AnyColumn): SQL {
  const cases = Object.entries(FINANCE_CONFIG.fxToUsd)
    .filter(([code, rate]) => /^[a-z]{3}$/.test(code) && Number.isFinite(rate))
    .map(([code, rate]) => `WHEN '${code}' THEN ${rate}`)
    .join(" ");
  return sql`(${amount}::numeric * (CASE lower(${currency}) ${sql.raw(cases)} ELSE 0 END))`;
}

/** Round to cents. */
export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
