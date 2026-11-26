interface RefundAmounts {
  grossMinor: number;
  taxMinor: number;
}

export function allocateVerifiedRefund(
  original: RefundAmounts,
  used: RefundAmounts,
  grossMinor: number,
  explicitTaxMinor: number | null,
): RefundAmounts | undefined {
  const grossRemaining = original.grossMinor - used.grossMinor;
  const taxRemaining = original.taxMinor - used.taxMinor;
  const netRemaining = grossRemaining - taxRemaining;
  const taxMinor =
    explicitTaxMinor ??
    (taxRemaining === 0 || grossMinor === grossRemaining
      ? taxRemaining
      : undefined);
  if (
    grossMinor <= 0 ||
    grossMinor > grossRemaining ||
    taxMinor === undefined ||
    taxMinor < 0 ||
    taxMinor > taxRemaining ||
    taxMinor > grossMinor ||
    grossMinor - taxMinor > netRemaining
  ) {
    return undefined;
  }
  return { grossMinor, taxMinor };
}
