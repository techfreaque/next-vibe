import { expect, it } from "bun:test";

import type { CountryLanguage } from "../../../../core/i18n/core/config";
import { utcDayFromPickerDate } from "./calendar-date";
import {
  createCalendarDateDisplayFormatter,
  createCalendarDateFormatter,
  parseCalendarDate,
} from "./local-date";

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

it("shows the B6 display format and reads it back as the same ISO day", () => {
  const locales: CountryLanguage[] = [
    "en-US",
    "de-DE",
    "pl-PL",
    "fr-FR",
    "it-IT",
    "es-ES",
    "sk-SK",
  ];
  const expected: Partial<Record<CountryLanguage, string>> = {
    "en-US": "Nov 24, 2026",
    "de-DE": "24. Nov. 2026",
    "sk-SK": "24. 11. 2026",
  };
  for (const locale of locales) {
    const shown = createCalendarDateDisplayFormatter(locale).format(
      new Date(2026, 10, 24),
    );
    if (expected[locale]) {
      expect(shown).toBe(expected[locale]);
    }
    expect(
      utcDayFromPickerDate(
        parseCalendarDate(shown, createCalendarDateFormatter(locale)),
      )?.toISOString(),
    ).toBe("2026-11-24T00:00:00.000Z");
  }
});

it("reads typed month names in the viewer's language", () => {
  const de = createCalendarDateFormatter("de-DE");
  expect(
    utcDayFromPickerDate(parseCalendarDate("3. März 2026", de))?.toISOString(),
  ).toBe("2026-03-03T00:00:00.000Z");
  const en = createCalendarDateFormatter("en-US");
  expect(
    utcDayFromPickerDate(parseCalendarDate("Feb 3, 2026", en))?.toISOString(),
  ).toBe("2026-02-03T00:00:00.000Z");
  expect(parseCalendarDate("Foo 3, 2026", en)).toBeUndefined();
});
