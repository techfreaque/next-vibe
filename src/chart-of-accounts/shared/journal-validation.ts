import { LineType, type LineTypeValue } from "../enum";

export function journalLineType(type: string): typeof LineTypeValue | null {
  switch (type) {
    case "DEBIT":
    case LineType.DEBIT:
      return LineType.DEBIT;
    case "CREDIT":
    case LineType.CREDIT:
      return LineType.CREDIT;
    default:
      return null;
  }
}

/** Convert a valid chart amount to the exact storage-scale units. */
export function journalAmountUnits(amount: number): bigint | null {
  const units = Math.round(amount * 10_000);
  if (
    !Number.isSafeInteger(units) ||
    units <= 0 ||
    units >= 100_000_000_000_000 ||
    units / 10_000 !== amount
  ) {
    return null;
  }

  return BigInt(units);
}

/** Format nonnegative ledger totals with two to four places without a float conversion. */
export function formatJournalUnits(
  units: bigint,
  formatter: Intl.NumberFormat,
): string {
  const scale = BigInt(10_000);
  const fraction = (units % scale)
    .toString()
    .padStart(4, "0")
    .replace(/0{1,2}$/, "");
  return formatter
    .formatToParts(units / scale)
    .map((part) => (part.type === "fraction" ? fraction : part.value))
    .join("");
}

export function validateJournalLines(
  lines: readonly { type: string; amount: number; currency: string }[],
  companyCurrency: string,
): "empty" | "currency" | "line" | "balance" | null {
  if (lines.length < 2) {
    return "empty";
  }

  let balance = BigInt(0);
  for (const line of lines) {
    if (line.currency !== companyCurrency) {
      return "currency";
    }

    const units = journalAmountUnits(line.amount);
    const type = journalLineType(line.type);
    if (!type || units === null) {
      return "line";
    }

    balance += type === LineType.DEBIT ? units : -units;
  }

  return balance === BigInt(0) ? null : "balance";
}

export function accountingDay(date: Date): Date {
  const day = new Date(date);
  day.setUTCHours(0, 0, 0, 0);
  return day;
}

export function nextAccountingDay(date: Date): Date {
  const day = accountingDay(date);
  day.setUTCDate(day.getUTCDate() + 1);
  return day;
}
