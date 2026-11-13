/**
 * Referral commission base: what a payment actually brought in.
 *
 * Commission is a share of real revenue (the amount the buyer paid, in USD
 * cents), never of the credits the purchase granted: an annual plan grants one
 * month of credits up front but pays twelve months of money.
 *
 * Earned commission is paid out as credits at 1 credit = $0.01, so a commission
 * of N USD cents becomes N earned credits.
 *
 * Client+server safe. No server imports.
 */

import { FINANCE_CONFIG } from "@/finance/config";

/**
 * Convert an amount in the currency's minor unit (cents, groszy) to USD cents.
 * Uses the same static FX table the finance monitor uses. A currency missing
 * from the table returns null (never guessed).
 */
export function paidMinorToUsdCents(
  amountMinor: number,
  currency: string,
): number | null {
  const rate = FINANCE_CONFIG.fxToUsd[currency.toLowerCase()];
  if (rate === undefined || !Number.isFinite(amountMinor)) {
    return null;
  }
  return Math.max(0, Math.round(amountMinor * rate));
}

/**
 * Amount remaining of an earning after a cumulative share of its payment was
 * reversed (0..1). Rounded down so a reversal never leaves more than earned.
 */
export function commissionAfterReversal(
  originalCents: number,
  reversedFraction: number,
): number {
  const fraction = Math.min(1, Math.max(0, reversedFraction));
  if (fraction >= 1) {
    return 0;
  }
  return Math.max(0, Math.floor(originalCents * (1 - fraction)));
}

/**
 * Revenue a completed checkout brought in, in USD cents.
 * Prefers what the provider reports as charged (Stripe `amount_total`, after
 * promotion codes, in the session currency); falls back to the amount stored on
 * the payment transaction at checkout (NOWPayments: the fixed fiat invoice).
 * Null when the currency has no USD rate.
 */
export function checkoutRevenueUsdCents(input: {
  /** Provider-reported charged amount in minor units, if any */
  amountTotalMinor: number | null | undefined;
  /** Currency of amountTotalMinor */
  amountTotalCurrency: string | null | undefined;
  /** Stored transaction amount in major units (numeric string) */
  transactionAmount: string;
  transactionCurrency: string;
}): number | null {
  if (typeof input.amountTotalMinor === "number" && input.amountTotalCurrency) {
    return paidMinorToUsdCents(
      input.amountTotalMinor,
      input.amountTotalCurrency,
    );
  }
  return paidMinorToUsdCents(
    Math.round(Number(input.transactionAmount) * 100),
    input.transactionCurrency,
  );
}
