import { z } from "zod";

import { TaxCalculator } from "./calculator";

export const LINE_SETTLEMENT_V1 = "line-cent-v1";

const settlementMetadata = z.object({
  lineSettlement: z.literal(LINE_SETTLEMENT_V1),
});

export function supportsLineCentSettlement(currency: string): boolean {
  return currency === "EUR" || currency === "USD" || currency === "PLN";
}

export function getLineSettlementPolicy(
  currency: string,
  metadata: Parameters<typeof settlementMetadata.safeParse>[0],
): typeof LINE_SETTLEMENT_V1 | undefined {
  if (
    supportsLineCentSettlement(currency) &&
    settlementMetadata.safeParse(metadata).success
  ) {
    return LINE_SETTLEMENT_V1;
  }
  return undefined;
}

function roundedMinorUnits(value: bigint, divisor: bigint): bigint {
  const half = divisor / BigInt(2);
  return (value + (value < BigInt(0) ? -half : half)) / divisor;
}

export function calculateSettledTaxLine(line: {
  quantity: number;
  unitPrice: number;
  taxRate: number;
}): {
  quantity: number;
  unitPrice: number;
  taxRate: number;
  netAmount: number;
  taxAmount: number;
  lineTotal: number;
} {
  const quantity = TaxCalculator.roundToFour(line.quantity);
  const unitPrice = TaxCalculator.roundToFour(line.unitPrice);
  const taxRate = TaxCalculator.roundToFour(line.taxRate);
  const quantityUnits = Math.round(quantity * 10_000);
  const unitPriceUnits = Math.round(unitPrice * 10_000);
  const rateUnits = Math.round(taxRate * 10_000);
  if (![quantityUnits, unitPriceUnits, rateUnits].every(Number.isSafeInteger)) {
    return {
      quantity,
      unitPrice,
      taxRate,
      netAmount: Number.NaN,
      taxAmount: Number.NaN,
      lineTotal: Number.NaN,
    };
  }

  // Normalized inputs have four decimal places. Net and VAT each round
  // directly from their exact products to cents, with halves away from zero.
  const base = BigInt(quantityUnits) * BigInt(unitPriceUnits);
  const net = roundedMinorUnits(base, BigInt(1_000_000));
  const vat = roundedMinorUnits(
    base * BigInt(rateUnits),
    BigInt(10_000_000_000),
  );
  return {
    quantity,
    unitPrice,
    taxRate,
    netAmount: Number(net) / 100,
    taxAmount: Number(vat) / 100,
    lineTotal: Number(net + vat) / 100,
  };
}
