import { TaxCalculator } from "@/tax/calculator";
import {
  calculateSettledTaxLine,
  type LINE_SETTLEMENT_V1,
} from "@/tax/line-settlement";

export function calculateInvoiceLine(
  line: {
    quantity: number;
    unitPrice: number;
    taxRate: number;
  },
  settlement?: typeof LINE_SETTLEMENT_V1,
): {
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
} {
  if (settlement) {
    const { quantity, unitPrice, taxRate, taxAmount, lineTotal } =
      calculateSettledTaxLine(line);
    return { quantity, unitPrice, taxRate, taxAmount, lineTotal };
  }
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
