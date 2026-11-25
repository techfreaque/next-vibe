import type { CountryLanguage } from "../../core/i18n/core/config";

/** Use the document currency. A legacy response can have an amount without a denomination. */
export function formatMoney(
  amount: number | string,
  currency: string | null | undefined,
  locale: string,
): string {
  const value = Number(amount);
  if (
    !Number.isFinite(value) ||
    (typeof amount === "string" && !amount.trim())
  ) {
    return "-";
  }
  const code = currency?.trim().toUpperCase();
  if (!code || !/^[A-Z]{3}$/u.test(code)) {
    const formatted = formatMoneyAmount(value, locale);
    return code ? `${formatted} ${code}` : formatted;
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatMoneyAmount(amount: number, locale: string): string {
  return Number.isFinite(amount)
    ? new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    : "-";
}

export function formatQuantity(
  amount: number,
  locale: CountryLanguage,
): string {
  return Number.isFinite(amount)
    ? new Intl.NumberFormat(locale, { maximumFractionDigits: 4 }).format(amount)
    : "-";
}

export function formatPercent(rate: number, locale: CountryLanguage): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(rate);
}

export function formatDocDate(
  date: Date | string | number,
  locale: CountryLanguage,
): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}
