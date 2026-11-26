/** Journal storage scale is four decimal places. */
export function ledgerDecimalUnits(value: string): bigint {
  const [whole, fraction = ""] = value.replace(/^-/, "").split(".");
  const units =
    BigInt(whole) * BigInt(10_000) + BigInt(fraction.padEnd(4, "0"));
  return value.startsWith("-") ? -units : units;
}

export function ledgerUnitsDecimal(units: bigint): string {
  const negative = units < BigInt(0);
  const magnitude = negative ? -units : units;
  const denominator = BigInt(10_000);
  return `${negative ? "-" : ""}${magnitude / denominator}.${(magnitude % denominator).toString().padStart(4, "0")}`;
}

export function ledgerAmountTotal(rows: readonly { amount: string }[]): bigint {
  return rows.reduce(
    (total, { amount }) => total + ledgerDecimalUnits(amount),
    BigInt(0),
  );
}
