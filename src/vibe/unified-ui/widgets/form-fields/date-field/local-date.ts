import type { CountryLanguage } from "../../../../core/i18n/core/config";
import { parseFormDate } from "../_shared/date-value";

/** Numeric calendar date in the viewer's locale (26.11.2026, 11/26/2026). */
export function createCalendarDateFormatter(
  locale: CountryLanguage,
): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * Display format for a calendar date (B6): "26 Nov 2026", "26. Nov. 2026",
 * "Nov 26, 2026". Unambiguous across locales, so it is what an input shows
 * while the value underneath stays an ISO day.
 */
export function createCalendarDateDisplayFormatter(
  locale: CountryLanguage | string,
): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizeMonthToken(value: string): string {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[.\s]/g, "");
}

/** Month names (short and long, format and standalone) mapped to 1..12. */
function monthNamesFor(locale: string): Map<string, number> {
  const names = new Map<string, number>();
  const styles: ("short" | "long")[] = ["short", "long"];
  for (let month = 0; month < 12; month++) {
    const date = new Date(2026, month, 15);
    for (const style of styles) {
      const inDate = new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: style,
        year: "numeric",
      })
        .formatToParts(date)
        .find(({ type }) => type === "month")?.value;
      const standalone = new Intl.DateTimeFormat(locale, {
        month: style,
      }).format(date);
      for (const name of [inDate, standalone]) {
        const token = name ? normalizeMonthToken(name) : "";
        if (token && !/^\d+$/.test(token) && !names.has(token)) {
          names.set(token, month + 1);
        }
      }
    }
  }
  return names;
}

const monthNameCache = new Map<string, Map<string, number>>();

/** "26 Nov 2026", "26. Nov. 2026", "Nov 26, 2026", "26 lis 2026". */
function parseNamedMonthDate(
  value: string,
  locale: string,
): string | undefined {
  const words = value.match(/\p{L}+\.?/gu);
  const numbers = value.match(/\d+/g);
  if (!words || words.length !== 1 || !numbers || numbers.length !== 2) {
    return undefined;
  }
  let names = monthNameCache.get(locale);
  if (!names) {
    names = monthNamesFor(locale);
    monthNameCache.set(locale, names);
  }
  const token = normalizeMonthToken(words[0] ?? "");
  const month =
    names.get(token) ??
    [...names.entries()].find(
      ([name]) => token.length >= 3 && name.startsWith(token),
    )?.[1];
  const year = numbers.find((part) => part.length === 4);
  const day = numbers.find((part) => part.length <= 2);
  if (!month || !year || !day) {
    return undefined;
  }
  return `${year}-${String(month).padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function parseCalendarDate(
  value: string,
  formatter?: Intl.DateTimeFormat,
): Date | undefined {
  const isoDate = parseFormDate(value.trim());
  if (isoDate || !formatter) {
    return isoDate;
  }

  const named = parseNamedMonthDate(value, formatter.resolvedOptions().locale);
  if (named) {
    return parseFormDate(named);
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
