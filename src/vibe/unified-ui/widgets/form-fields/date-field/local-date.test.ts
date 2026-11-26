import { expect, it } from "bun:test";

import type { CountryLanguage } from "../../../../core/i18n/core/config";
import { utcDayFromPickerDate } from "./calendar-date";
import { createCalendarDateFormatter, parseCalendarDate } from "./local-date";

it("reads each supported calendar date presentation as the same ISO day", () => {
  const locales: CountryLanguage[] = [
    "en-US",
    "de-DE",
    "pl-PL",
    "fr-FR",
    "it-IT",
    "es-ES",
    "sk-SK",
  ];
  for (const locale of locales) {
    const formatter = createCalendarDateFormatter(locale);
    const local = formatter.format(new Date(2026, 10, 24));
    expect(
      utcDayFromPickerDate(parseCalendarDate(local, formatter))?.toISOString(),
    ).toBe("2026-11-24T00:00:00.000Z");
  }
});

it("keeps ISO entry available and rejects an invalid local day", () => {
  const formatter = createCalendarDateFormatter("de-DE");
  expect(
    utcDayFromPickerDate(
      parseCalendarDate("2026-11-24", formatter),
    )?.toISOString(),
  ).toBe("2026-11-24T00:00:00.000Z");
  expect(parseCalendarDate("31.11.2026", formatter)).toBeUndefined();
  expect(parseCalendarDate("abc11.def12.2026", formatter)).toBeUndefined();
});
