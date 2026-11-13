/**
 * Referral commission base: revenue in USD cents, proportional reversal.
 */

import { describe, expect, it } from "vitest";

import {
  checkoutRevenueUsdCents,
  commissionAfterReversal,
  paidMinorToUsdCents,
} from "./commission";

describe("paidMinorToUsdCents", () => {
  it("passes USD through", () => {
    expect(paidMinorToUsdCents(8800, "usd")).toBe(8800);
    expect(paidMinorToUsdCents(800, "USD")).toBe(800);
  });

  it("converts EUR and PLN with the finance FX table", () => {
    expect(paidMinorToUsdCents(8800, "eur")).toBe(9504);
    expect(paidMinorToUsdCents(33000, "PLN")).toBe(8250);
  });

  it("returns null for a currency without a rate", () => {
    expect(paidMinorToUsdCents(1000, "jpy")).toBeNull();
  });
});

describe("checkoutRevenueUsdCents", () => {
  it("prefers the provider-reported charged amount (promotion codes applied)", () => {
    expect(
      checkoutRevenueUsdCents({
        amountTotalMinor: 4400,
        amountTotalCurrency: "usd",
        transactionAmount: "88.00",
        transactionCurrency: "USD",
      }),
    ).toBe(4400);
  });

  it("falls back to the stored transaction amount (NOWPayments)", () => {
    expect(
      checkoutRevenueUsdCents({
        amountTotalMinor: undefined,
        amountTotalCurrency: undefined,
        transactionAmount: "88.00",
        transactionCurrency: "USD",
      }),
    ).toBe(8800);
  });

  it("a fully discounted checkout brought in nothing", () => {
    expect(
      checkoutRevenueUsdCents({
        amountTotalMinor: 0,
        amountTotalCurrency: "usd",
        transactionAmount: "8.00",
        transactionCurrency: "USD",
      }),
    ).toBe(0);
  });
});

describe("commissionAfterReversal", () => {
  it("keeps the unreversed share, rounded down", () => {
    expect(commissionAfterReversal(880, 0)).toBe(880);
    expect(commissionAfterReversal(880, 0.5)).toBe(440);
    expect(commissionAfterReversal(881, 0.5)).toBe(440);
    expect(commissionAfterReversal(880, 0.25)).toBe(660);
  });

  it("a full reversal leaves nothing", () => {
    expect(commissionAfterReversal(880, 1)).toBe(0);
    expect(commissionAfterReversal(880, 1.5)).toBe(0);
  });
});
