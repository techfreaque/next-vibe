/**
 * POS Order Totals unit tests
 *
 * Tests the order line item math logic extracted from
 * pos/order/[orderId]/add-item/repository.ts.
 *
 * The repository calculates per-item and order totals as:
 *   lineNet    = quantity * unitPrice
 *   taxAmount  = round(lineNet * taxRate, 4)
 *   lineTotal  = lineNet + taxAmount
 *   orderTotal = sum of all item lineTotals (subtotal includes tax)
 *   subtotal   = orderTotal - sum(taxAmounts)   (net of tax)
 *   taxAmount  = sum of all item taxAmounts
 *
 * No DB required — pure math validation.
 */

import { describe, expect, it } from "bun:test";

// ── Pure line item calculation (mirrors add-item/repository.ts) ──────────────

interface LineItemInput {
  unitPrice: number;
  quantity: number;
  taxRate?: number; // defaults to 0
}

interface LineItemResult {
  lineNet: number;
  taxAmount: number;
  lineTotal: number;
}

/**
 * Calculates a single line item's amounts.
 * Mirrors the logic in PosOrderAddItemRepository.addItem exactly.
 */
function calcLineItem(input: LineItemInput): LineItemResult {
  const taxRate = input.taxRate ?? 0;
  const lineNet = input.quantity * input.unitPrice;
  const taxAmount = Math.round(lineNet * taxRate * 10000) / 10000;
  const lineTotal = lineNet + taxAmount;
  return { lineNet, taxAmount, lineTotal };
}

// ── Pure order totals aggregation (mirrors the DB sum logic) ─────────────────

interface OrderTotals {
  subtotal: number; // net of tax (gross - tax)
  taxAmount: number; // sum of all item taxAmounts
  total: number; // gross (sum of all lineTotals = subtotal + tax)
}

/**
 * Aggregates multiple line items into order totals.
 * Mirrors what the repository does via DB SUM() + update.
 */
function calcOrderTotals(items: LineItemResult[]): OrderTotals {
  const totalLineTotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const totalTaxAmount = items.reduce((sum, i) => sum + i.taxAmount, 0);
  return {
    subtotal: totalLineTotal - totalTaxAmount,
    taxAmount: totalTaxAmount,
    total: totalLineTotal,
  };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("POS Order Line Item Calculation", () => {
  it("lineTotal = quantity * unitPrice + taxAmount", () => {
    const result = calcLineItem({ unitPrice: 10, quantity: 2, taxRate: 0.19 });

    // lineNet = 20, tax = 20 * 0.19 = 3.8, lineTotal = 23.8
    expect(result.lineNet).toBe(20);
    expect(result.taxAmount).toBe(3.8);
    expect(result.lineTotal).toBe(23.8);
  });

  it("zero tax rate: lineTotal equals lineNet", () => {
    const result = calcLineItem({ unitPrice: 50, quantity: 3, taxRate: 0 });

    expect(result.taxAmount).toBe(0);
    expect(result.lineTotal).toBe(result.lineNet);
    expect(result.lineTotal).toBe(150);
  });

  it("undefined taxRate defaults to 0", () => {
    const result = calcLineItem({ unitPrice: 100, quantity: 1 });

    expect(result.taxAmount).toBe(0);
    expect(result.lineTotal).toBe(100);
  });

  it("taxAmount is rounded to 4 decimal places", () => {
    // lineNet = 1/3 * 1 = 0.3333..., tax at 0.19 = 0.0633...
    const result = calcLineItem({ unitPrice: 1 / 3, quantity: 1, taxRate: 0.19 });

    const decimals = result.taxAmount.toString().split(".")[1] ?? "";
    expect(decimals.length).toBeLessThanOrEqual(4);
  });

  it("high quantity with tax: correct scaling", () => {
    const result = calcLineItem({ unitPrice: 5.99, quantity: 100, taxRate: 0.2 });

    // lineNet = 599, tax = 119.8, total = 718.8
    expect(result.lineNet).toBe(599);
    expect(result.taxAmount).toBe(119.8);
    expect(result.lineTotal).toBe(718.8);
  });
});

describe("POS Order Totals Aggregation", () => {
  it("single item: order total = lineTotal", () => {
    const item = calcLineItem({ unitPrice: 100, quantity: 1, taxRate: 0.19 });
    const totals = calcOrderTotals([item]);

    expect(totals.total).toBe(item.lineTotal); // 119
    expect(totals.taxAmount).toBe(item.taxAmount); // 19
    expect(totals.subtotal).toBe(item.lineNet); // 100
  });

  it("multiple items: total = sum of lineTotals", () => {
    const item1 = calcLineItem({ unitPrice: 10, quantity: 2, taxRate: 0.19 }); // 20 + 3.8 = 23.8
    const item2 = calcLineItem({ unitPrice: 50, quantity: 1, taxRate: 0.1 }); // 50 + 5 = 55
    const item3 = calcLineItem({ unitPrice: 7.5, quantity: 4, taxRate: 0 }); // 30 + 0 = 30

    const totals = calcOrderTotals([item1, item2, item3]);

    const expectedTotal = 23.8 + 55 + 30; // 108.8
    const expectedTax = 3.8 + 5 + 0; // 8.8
    const expectedSubtotal = expectedTotal - expectedTax; // 100

    expect(totals.total).toBeCloseTo(expectedTotal, 4);
    expect(totals.taxAmount).toBeCloseTo(expectedTax, 4);
    expect(totals.subtotal).toBeCloseTo(expectedSubtotal, 4);
  });

  it("removing an item: order total decreases by that item's lineTotal", () => {
    const item1 = calcLineItem({ unitPrice: 100, quantity: 1, taxRate: 0.19 });
    const item2 = calcLineItem({ unitPrice: 50, quantity: 1, taxRate: 0.19 });

    const totalsBefore = calcOrderTotals([item1, item2]);
    const totalsAfter = calcOrderTotals([item1]); // item2 removed

    const diff = totalsBefore.total - totalsAfter.total;
    expect(diff).toBeCloseTo(item2.lineTotal, 4); // should equal item2's lineTotal
  });

  it("order with no items: all totals are zero", () => {
    const totals = calcOrderTotals([]);

    expect(totals.total).toBe(0);
    expect(totals.taxAmount).toBe(0);
    expect(totals.subtotal).toBe(0);
  });

  it("all zero-tax items: taxAmount=0, total=subtotal", () => {
    const item1 = calcLineItem({ unitPrice: 20, quantity: 2, taxRate: 0 });
    const item2 = calcLineItem({ unitPrice: 15, quantity: 1, taxRate: 0 });

    const totals = calcOrderTotals([item1, item2]);

    expect(totals.taxAmount).toBe(0);
    expect(totals.total).toBe(totals.subtotal);
    expect(totals.total).toBe(55);
  });

  it("order taxAmount = sum of all item taxAmounts", () => {
    const item1 = calcLineItem({ unitPrice: 100, quantity: 1, taxRate: 0.19 });
    const item2 = calcLineItem({ unitPrice: 200, quantity: 1, taxRate: 0.23 });

    const totals = calcOrderTotals([item1, item2]);

    const expectedTax = item1.taxAmount + item2.taxAmount;
    expect(totals.taxAmount).toBeCloseTo(expectedTax, 4);
  });
});

describe("POS Order Complete - Payment Validation", () => {
  // The complete repository checks: roundedPaid >= roundedTotal (4dp rounding)

  /**
   * Mirrors the payment validation in PosOrderCompleteRepository.completeOrder.
   * Returns true if payment is sufficient.
   */
  function isPaymentSufficient(
    orderTotal: number,
    totalPaid: number,
  ): boolean {
    const roundedTotal = Math.round(orderTotal * 10000) / 10000;
    const roundedPaid = Math.round(totalPaid * 10000) / 10000;
    return roundedPaid >= roundedTotal;
  }

  it("exact payment: roundedPaid === roundedTotal passes", () => {
    expect(isPaymentSufficient(119, 119)).toBe(true);
  });

  it("overpayment: paid > total passes", () => {
    expect(isPaymentSufficient(100, 150)).toBe(true);
  });

  it("underpayment: paid < total fails", () => {
    expect(isPaymentSufficient(100, 99.99)).toBe(false);
  });

  it("zero order, zero payment passes", () => {
    expect(isPaymentSufficient(0, 0)).toBe(true);
  });

  it("rounding: 100.00001 rounds to 100.0000 so 100 payment suffices", () => {
    // Math.round(100.00001 * 10000) / 10000 = Math.round(1000000.1) / 10000 = 1000000 / 10000 = 100
    expect(isPaymentSufficient(100.00001, 100)).toBe(true);
  });
});
