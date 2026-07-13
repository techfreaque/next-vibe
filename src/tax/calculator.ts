/**
 * Tax Calculator
 * Pure math utilities for tax calculations — no DB, no ResponseType, no throw
 */

export class TaxCalculator {
  static roundToFour(value: number): number {
    return Math.round(value * 10000) / 10000;
  }

  static calculateLineItemTax(params: {
    unitPrice: number;
    quantity: number;
    taxRate: number; // e.g. 0.2000 for 20%
    discountPercent?: number; // e.g. 0.1000 for 10%
  }): {
    subtotal: number;
    discountAmount: number;
    taxableAmount: number;
    taxAmount: number;
    total: number;
  } {
    const gross = TaxCalculator.roundToFour(params.unitPrice * params.quantity);
    const discountAmount = TaxCalculator.roundToFour(
      gross * (params.discountPercent ?? 0),
    );
    const taxableAmount = TaxCalculator.roundToFour(gross - discountAmount);
    const taxAmount = TaxCalculator.roundToFour(taxableAmount * params.taxRate);
    const total = TaxCalculator.roundToFour(taxableAmount + taxAmount);
    return { subtotal: gross, discountAmount, taxableAmount, taxAmount, total };
  }
}
