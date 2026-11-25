import { expect, it } from "bun:test";

import { pickerDateFromUtcDay, utcDayFromPickerDate } from "./calendar-date";

it("shows the same calendar day for canonical dates and serialized date values", () => {
  for (const raw of [
    new Date("2026-11-25T00:00:00Z"),
    "2026-11-25T00:00:00.000Z",
    "2026-11-25",
  ]) {
    const picked = pickerDateFromUtcDay(raw);
    expect(picked?.getFullYear()).toBe(2026);
    expect(picked?.getMonth()).toBe(10);
    expect(picked?.getDate()).toBe(25);
    expect(utcDayFromPickerDate(picked)?.toISOString()).toBe(
      "2026-11-25T00:00:00.000Z",
    );
  }
});

it("writes picker days at UTC midnight and keeps a cleared date unset", () => {
  expect(utcDayFromPickerDate(new Date(2026, 10, 25))?.toISOString()).toBe(
    "2026-11-25T00:00:00.000Z",
  );
  expect(utcDayFromPickerDate(undefined)).toBeUndefined();
  expect(pickerDateFromUtcDay(null)).toBeUndefined();
});
