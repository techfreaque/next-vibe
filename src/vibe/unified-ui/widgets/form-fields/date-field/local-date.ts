import type { CountryLanguage } from "../../../../core/i18n/core/config";
import { parseFormDate } from "../_shared/date-value";

export function createCalendarDateFormatter(
  locale: CountryLanguage,
): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function parseCalendarDate(
  value: string,
  formatter?: Intl.DateTimeFormat,
): Date | undefined {
  const isoDate = parseFormDate(value);
  if (isoDate || !formatter) {
    return isoDate;
  }

  const parts = formatter
    .formatToParts(new Date(2026, 10, 24))
    .filter(
      ({ type }) => type === "year" || type === "month" || type === "day",
    );
  const numericDate =
    /^\s*(\d{1,4})\s*[./-]\s*(\d{1,4})\s*[./-]\s*(\d{1,4})\.?\s*$/.exec(value);
  if (!numericDate) {
    return undefined;
  }
  const year = numericDate[parts.findIndex(({ type }) => type === "year") + 1];
  const month =
    numericDate[parts.findIndex(({ type }) => type === "month") + 1];
  const day = numericDate[parts.findIndex(({ type }) => type === "day") + 1];
  if (!year || year.length !== 4 || !month || !day) {
    return undefined;
  }
  return parseFormDate(
    `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
  );
}
