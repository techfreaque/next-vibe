/** Decimal coefficients avoid losing half-unit ties before PostgreSQL's four-place rounding. */
function decimalParts(value: number): {
  coefficient: bigint;
  exponent: number;
} {
  const [mantissa, scientificExponent] = value.toString().split("e");
  const point = mantissa.indexOf(".");
  const fractionalDigits = point < 0 ? 0 : mantissa.length - point - 1;
  return {
    coefficient: BigInt(mantissa.replace(".", "")),
    exponent: Number(scientificExponent ?? 0) - fractionalDigits,
  };
}

function roundCoefficient(coefficient: bigint, exponent: number): bigint {
  const magnitude = BigInt(`1${"0".repeat(Math.abs(exponent))}`);
  if (exponent >= 0) {
    return coefficient * magnitude;
  }
  const divisor = magnitude;
  const adjustment =
    coefficient < 0 ? -(divisor / BigInt(2)) : divisor / BigInt(2);
  return (coefficient + adjustment) / divisor;
}

function roundedProductUnits(left: number, right: number): bigint {
  const a = decimalParts(left),
    b = decimalParts(right);
  return roundCoefficient(
    a.coefficient * b.coefficient,
    a.exponent + b.exponent + 4,
  );
}

function applyRate(units: bigint, rate: number): bigint {
  const { coefficient, exponent } = decimalParts(rate);
  return roundCoefficient(units * coefficient, exponent);
}

export class TaxCalculator {
  static roundToFour(value: number): number {
    return Number.isFinite(value)
      ? Number(roundedProductUnits(value, 1)) / 10_000
      : value;
  }

  static calculateLineItemTax(params: {
    unitPrice: number;
    quantity: number;
    taxRate: number;
    discountPercent?: number;
  }): {
    subtotal: number;
    discountAmount: number;
    taxableAmount: number;
    taxAmount: number;
    total: number;
  } {
    const { unitPrice, quantity, taxRate, discountPercent = 0 } = params;
    if (
      ![unitPrice, quantity, taxRate, discountPercent].every(Number.isFinite)
    ) {
      return {
        subtotal: Number.NaN,
        discountAmount: Number.NaN,
        taxableAmount: Number.NaN,
        taxAmount: Number.NaN,
        total: Number.NaN,
      };
    }
    const gross = roundedProductUnits(unitPrice, quantity);
    const subtotal = Number(gross) / 10_000;
    const discount = applyRate(gross, discountPercent);
    const base = gross - discount;
    const taxableAmount = Number(base) / 10_000;
    const tax = applyRate(base, taxRate);
    return {
      subtotal,
      discountAmount: Number(discount) / 10_000,
      taxableAmount,
      taxAmount: Number(tax) / 10_000,
      total: Number(base + tax) / 10_000,
    };
  }
}
