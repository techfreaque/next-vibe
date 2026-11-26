/** A user-confirmed taxable base and percentage, both from a specific supplier bill. */
export function reverseChargeDecision(
  base: number | undefined,
  ratePercent: number | undefined,
  billTotal: number,
): { base: number; ratePercent: number; amount: number } | null | false {
  if (base === undefined && ratePercent === undefined) {
    return null;
  }
  if (
    base === undefined ||
    ratePercent === undefined ||
    base <= 0 ||
    base > billTotal ||
    ratePercent <= 0 ||
    ratePercent > 100
  ) {
    return false;
  }
  const cents = Math.round(base * 100);
  const rateUnits = Math.round(ratePercent * 10_000);
  if (
    !Number.isSafeInteger(cents) ||
    cents / 100 !== base ||
    !Number.isSafeInteger(rateUnits) ||
    rateUnits / 10_000 !== ratePercent
  ) {
    return false;
  }
  const amount =
    Number(
      (BigInt(cents) * BigInt(rateUnits) + BigInt(500_000)) / BigInt(1_000_000),
    ) / 100;
  return amount > 0 ? { base, ratePercent, amount } : false;
}
