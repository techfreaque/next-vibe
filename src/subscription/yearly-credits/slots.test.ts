/**
 * Monthly slots of a yearly period: 12 calendar months, clamped month ends,
 * the first grant of a yearly period lasts one month.
 */

import { describe, expect, test } from "bun:test";

import {
  addUtcMonths,
  currentMonthSlot,
  monthSlots,
  periodGrantExpiry,
  yearlyMonthGrantKey,
} from "./slots";

const start = new Date("2026-04-09T10:00:00.000Z");
const end = new Date("2027-04-09T10:00:00.000Z");

describe("yearly month slots", () => {
  test("a yearly period has 12 monthly slots ending at the period end", () => {
    const slots = monthSlots(start, end);
    expect(slots).toHaveLength(12);
    expect(slots[0].start.toISOString()).toBe("2026-04-09T10:00:00.000Z");
    expect(slots[1].start.toISOString()).toBe("2026-05-09T10:00:00.000Z");
    expect(slots[11].end.toISOString()).toBe(end.toISOString());
    for (let i = 1; i < slots.length; i++) {
      expect(slots[i].start.getTime()).toBe(slots[i - 1].end.getTime());
    }
  });

  test("a 365-day crypto year still gets 12 slots", () => {
    const cryptoStart = new Date("2026-01-01T00:00:00.000Z");
    const cryptoEnd = new Date(cryptoStart.getTime() + 365 * 86_400_000);
    expect(monthSlots(cryptoStart, cryptoEnd)).toHaveLength(12);
  });

  test("month ends clamp (Jan 31 -> Feb 28)", () => {
    expect(
      addUtcMonths(new Date("2026-01-31T00:00:00.000Z"), 1).toISOString(),
    ).toBe("2026-02-28T00:00:00.000Z");
  });

  test("current slot", () => {
    const slot = currentMonthSlot(
      start,
      end,
      new Date("2026-11-17T12:00:00.000Z"),
    );
    expect(slot?.index).toBe(7);
    expect(slot?.start.toISOString()).toBe("2026-11-09T10:00:00.000Z");
    expect(currentMonthSlot(start, end, new Date("2027-05-01"))).toBeNull();
  });

  test("first grant expiry: monthly = period end, yearly = first month", () => {
    expect(periodGrantExpiry(false, start, end).getTime()).toBe(end.getTime());
    expect(periodGrantExpiry(true, start, end).toISOString()).toBe(
      "2026-05-09T10:00:00.000Z",
    );
  });

  test("grant key is stable per subscription and month", () => {
    expect(yearlyMonthGrantKey("sub_1", start)).toBe(
      `yearly-month:sub_1:${start.getTime()}`,
    );
  });
});
