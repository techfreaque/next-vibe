import { TaxCalculator } from "@/tax/calculator";

export function calculateInvoiceLine(line: {
  quantity: number;
  unitPrice: number;
  taxRate: number;
}): {
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
} {
  const quantity = TaxCalculator.roundToFour(line.quantity);
  const unitPrice = TaxCalculator.roundToFour(line.unitPrice);
  const taxRate = TaxCalculator.roundToFour(line.taxRate);
  const { taxAmount, total: lineTotal } = TaxCalculator.calculateLineItemTax({
    quantity,
    unitPrice,
    taxRate,
  });
  return { quantity, unitPrice, taxRate, taxAmount, lineTotal };
}
