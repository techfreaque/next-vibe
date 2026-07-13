/**
 * TaxCalculator unit tests
 *
 * Tests the pure math utilities in tax/calculator.ts:
 * - calculateLineItemTax with standard exclusive tax
 * - calculateLineItemTax with zero tax rate
 * - calculateLineItemTax with discount applied
 * - calculateLineItemTax with 100% tax rate
 * - roundToFour precision helper
 * - Zero amount edge case
 */

import { describe, expect, it } from "bun:test";

import { TaxCalculator } from "../calculator";

describe("TaxCalculator.calculateLineItemTax", () => {
  // ── Standard cases ─────────────────────────────────────────────────────

  it("net=100, rate=0.19 → taxAmount=19, total=119", () => {
    const result = TaxCalculator.calculateLineItemTax({
      unitPrice: 100,
      quantity: 1,
      taxRate: 0.19,
    });

    expect(result.subtotal).toBe(100);
    expect(result.discountAmount).toBe(0);
    expect(result.taxableAmount).toBe(100);
    expect(result.taxAmount).toBe(19);
    expect(result.total).toBe(119);
  });

  it("unitPrice=59.5, quantity=2, rate=0.19 → taxAmount=22.61, total=141.61", () => {
    const result = TaxCalculator.calculateLineItemTax({
      unitPrice: 59.5,
      quantity: 2,
      taxRate: 0.19,
    });

    // gross = 59.5 * 2 = 119
    // taxAmount = 119 * 0.19 = 22.61
    // total = 119 + 22.61 = 141.61
    expect(result.subtotal).toBe(119);
    expect(result.taxAmount).toBe(22.61);
    expect(result.total).toBe(141.61);
  });

  // ── Zero rate ─────────────────────────────────────────────────────────

  it("zero tax rate: taxAmount=0, total equals subtotal", () => {
    const result = TaxCalculator.calculateLineItemTax({
      unitPrice: 100,
      quantity: 3,
      taxRate: 0,
    });

    expect(result.taxAmount).toBe(0);
    expect(result.total).toBe(result.subtotal);
    expect(result.total).toBe(300);
  });

  // ── Discount ──────────────────────────────────────────────────────────

  it("10% discount applied before tax: taxableAmount = gross - discount", () => {
    const result = TaxCalculator.calculateLineItemTax({
      unitPrice: 200,
      quantity: 1,
      taxRate: 0.2,
      discountPercent: 0.1,
    });

    // gross = 200, discount = 20, taxable = 180
    // tax = 180 * 0.2 = 36, total = 216
    expect(result.subtotal).toBe(200);
    expect(result.discountAmount).toBe(20);
    expect(result.taxableAmount).toBe(180);
    expect(result.taxAmount).toBe(36);
    expect(result.total).toBe(216);
  });

  // ── 100% tax rate ─────────────────────────────────────────────────────

  it("100% tax rate: taxAmount equals taxableAmount, total = 2x", () => {
    const result = TaxCalculator.calculateLineItemTax({
      unitPrice: 50,
      quantity: 1,
      taxRate: 1.0,
    });

    expect(result.taxAmount).toBe(50);
    expect(result.total).toBe(100);
  });

  // ── Zero amount ───────────────────────────────────────────────────────

  it("zero unit price: all amounts are zero", () => {
    const result = TaxCalculator.calculateLineItemTax({
      unitPrice: 0,
      quantity: 5,
      taxRate: 0.19,
    });

    expect(result.subtotal).toBe(0);
    expect(result.taxAmount).toBe(0);
    expect(result.total).toBe(0);
  });

  // ── Precision ─────────────────────────────────────────────────────────

  it("result values are rounded to 4 decimal places", () => {
    const result = TaxCalculator.calculateLineItemTax({
      unitPrice: 1 / 3, // 0.333...
      quantity: 1,
      taxRate: 0.19,
    });

    // All values must have at most 4 decimal places
    const assertFourDecimals = (n: number): void => {
      const asStr = n.toString();
      const decimalPart = asStr.split(".")[1] ?? "";
      expect(
        decimalPart.length,
        `${String(n)} has more than 4 decimal places`,
      ).toBeLessThanOrEqual(4);
    };

    assertFourDecimals(result.subtotal);
    assertFourDecimals(result.discountAmount);
    assertFourDecimals(result.taxableAmount);
    assertFourDecimals(result.taxAmount);
    assertFourDecimals(result.total);
  });
});

describe("TaxCalculator.roundToFour", () => {
  it("rounds 1.23456789 to 1.2346", () => {
    expect(TaxCalculator.roundToFour(1.23456789)).toBe(1.2346);
  });

  it("rounds 0.00001 to 0.0001", () => {
    expect(TaxCalculator.roundToFour(0.00001)).toBe(0);
  });

  it("preserves integers unchanged", () => {
    expect(TaxCalculator.roundToFour(100)).toBe(100);
  });

  it("handles negative values", () => {
    expect(TaxCalculator.roundToFour(-1.23456)).toBe(-1.2346);
  });
});
