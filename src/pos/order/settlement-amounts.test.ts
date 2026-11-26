import { describe, expect, it } from "bun:test";

import { TaxCalculator } from "@/tax/calculator";

import { isPosMinorUnitAmount, posSettlementAmounts } from "./settlement-amounts";

describe("POS settlement money", () => {
  it("collects and returns integer minor units for a fractional VAT line", () => {
    const line = TaxCalculator.calculateLineItemTax({
      quantity: 1,
      unitPrice: 19.99,
      taxRate: 0.23,
    });
    expect(line).toMatchObject({ taxAmount: 4.5977, total: 24.5877 });
    const settlement = posSettlementAmounts(line.total, line.taxAmount);
    expect(settlement).toEqual({ subtotal: 19.99, taxAmount: 4.6, total: 24.59 });
    expect(2_500 - Math.round(settlement.total * 100)).toBe(41);
  });

  it("rounds the grouped gross and grouped VAT independently and balances net", () => {
    const line = TaxCalculator.calculateLineItemTax({
      quantity: 1,
      unitPrice: 1.07,
      taxRate: 0.23,
    });
    expect(posSettlementAmounts(line.total * 2, line.taxAmount * 2)).toEqual({
      subtotal: 2.14,
      taxAmount: 0.49,
      total: 2.63,
    });
    expect(posSettlementAmounts(0.005, 0.0049)).toEqual({
      subtotal: 0.01,
      taxAmount: 0,
      total: 0.01,
    });
  });

  it("accepts exact EUR/USD/PLN minor units and detects earlier finer tender amounts", () => {
    expect([19.99, 24.59, 0.41, 0, 1.01].every(isPosMinorUnitAmount)).toBe(true);
    expect([19.999, 0.4123, 0.001, Infinity].some(isPosMinorUnitAmount)).toBe(false);
  });
});
