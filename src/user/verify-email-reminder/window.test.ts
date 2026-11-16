import { describe, expect, it } from "vitest";

import { HOUR_MS, REMINDER_DELAY_HOURS, reminderWindow } from "./window";

describe("verify reminder window", () => {
  it("covers the clock hour that is REMINDER_DELAY_HOURS old", () => {
    const now = new Date("2026-11-16T13:00:07Z");
    const { from, to } = reminderWindow(now);
    expect(to.toISOString()).toBe("2026-11-15T13:00:00.000Z");
    expect(from.toISOString()).toBe("2026-11-15T12:00:00.000Z");
    expect(REMINDER_DELAY_HOURS).toBe(24);
  });

  it("is stable for late runs within the same hour", () => {
    const a = reminderWindow(new Date("2026-11-16T13:00:01Z"));
    const b = reminderWindow(new Date("2026-11-16T13:59:59Z"));
    expect(a.from.getTime()).toBe(b.from.getTime());
    expect(a.to.getTime()).toBe(b.to.getTime());
  });

  it("tiles consecutive hourly runs without gaps or overlap", () => {
    const first = reminderWindow(new Date("2026-11-16T13:00:00Z"));
    const next = reminderWindow(new Date(Date.UTC(2026, 10, 16, 14, 0, 0)));
    expect(next.from.getTime()).toBe(first.to.getTime());
    expect(next.to.getTime() - next.from.getTime()).toBe(HOUR_MS);
  });
});
