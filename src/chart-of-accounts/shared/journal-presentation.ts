import { formatJournalUnits } from "./journal-validation";

/** Render nonnegative ledger units at the standard two-place display precision. */
export function formatJournalCurrency(
  units: bigint,
  currency: string | undefined,
  locale: string,
): string {
  const code = currency?.trim().toUpperCase();
  const validCode = code && /^[A-Z]{3}$/u.test(code) ? code : undefined;
  const formatter = new Intl.NumberFormat(locale, {
    style: validCode ? "currency" : "decimal",
    currency: validCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const cent = BigInt(100);
  return formatJournalUnits(((units + BigInt(50)) / cent) * cent, formatter);
}
