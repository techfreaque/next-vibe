import { TaxCalculator } from "@/tax/calculator";

export function calculateBillLine(line: {
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

export function summarizeBillLines(
  lines: readonly ReturnType<typeof calculateBillLine>[],
): {
  subtotal: number;
  taxAmount: number;
  total: number;
  taxByRate: ReadonlyMap<number, number>;
  valid: boolean;
} {
  const taxUnitsByRate = new Map<number, number>();
  let grossUnits = 0;
  let taxUnits = 0;
  let valid = true;
  for (const line of lines) {
    const lineGross = Math.round(line.lineTotal * 10_000);
    const lineTax = Math.round(line.taxAmount * 10_000);
    grossUnits += lineGross;
    taxUnits += lineTax;
    taxUnitsByRate.set(
      line.taxRate,
      (taxUnitsByRate.get(line.taxRate) ?? 0) + lineTax,
    );
    valid =
      valid &&
      line.quantity > 0 &&
      line.quantity <= 99_999_999.9999 &&
      line.unitPrice >= 0 &&
      line.unitPrice <= 99_999_999.9999 &&
      line.taxRate >= 0 &&
      line.taxRate <= 1;
  }
  return {
    subtotal: (grossUnits - taxUnits) / 10_000,
    taxAmount: taxUnits / 10_000,
    total: grossUnits / 10_000,
    taxByRate: new Map(
      [...taxUnitsByRate].map(([rate, units]) => [rate, units / 10_000]),
    ),
    valid:
      valid &&
      Number.isSafeInteger(grossUnits) &&
      grossUnits <= 999_999_999_999,
  };
}
