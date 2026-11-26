import { describe, expect, it } from "bun:test";

import {
  calculateSettledTaxLine,
  getLineSettlementPolicy,
  LINE_SETTLEMENT_V1,
} from "@/tax/line-settlement";

import { calculateInvoiceLine } from "./amounts";

describe("invoice line settlement", () => {
  it("adds displayed VAT and gross by line and keeps legacy calculation available", () => {
    const input = { quantity: 1, unitPrice: 1.07, taxRate: 0.23 };
    expect(calculateInvoiceLine(input, LINE_SETTLEMENT_V1)).toMatchObject({
      taxAmount: 0.25,
      lineTotal: 1.32,
    });
    expect(calculateInvoiceLine(input)).toMatchObject({
      taxAmount: 0.2461,
      lineTotal: 1.3161,
    });
  });

  it("rounds exact net and VAT half ties away from zero, without a second rounding step", () => {
    for (const sign of [1, -1]) {
      const line = calculateSettledTaxLine({
        quantity: 1,
        unitPrice: sign * 0.025,
        taxRate: 0.2,
      });
      expect(line).toMatchObject({
        netAmount: sign * 0.03,
        taxAmount: sign * 0.01,
        lineTotal: sign * 0.04,
      });
      expect(
        calculateSettledTaxLine({
          quantity: 1,
          unitPrice: sign * 1.0249,
          taxRate: 1,
        }),
      ).toMatchObject({
        netAmount: sign * 1.02,
        taxAmount: sign * 1.02,
        lineTotal: sign * 2.04,
      });
    }
  });

  it("requires the validated marker and a supported currency", () => {
    for (const currency of ["EUR", "USD", "PLN"]) {
      expect(
        getLineSettlementPolicy(currency, {
          lineSettlement: LINE_SETTLEMENT_V1,
        }),
      ).toBe(LINE_SETTLEMENT_V1);
      expect(
        getLineSettlementPolicy(currency, { lineSettlement: "future" }),
      ).toBeUndefined();
      expect(getLineSettlementPolicy(currency, null)).toBeUndefined();
    }
    expect(
      getLineSettlementPolicy("JPY", { lineSettlement: LINE_SETTLEMENT_V1 }),
    ).toBeUndefined();
  });
});
