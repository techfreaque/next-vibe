import { describe, expect, it } from "vitest";

import {
  REMINDER_DELAY_HOURS,
  REMINDER_MAX_AGE_HOURS,
  reminderDedupeKey,
  reminderDueRange,
} from "./window";

describe("signup reminder window", () => {
  it("covers last sends between 24 h and 2 h ago", () => {
    const { sentAfter, sentBefore } = reminderDueRange(
      new Date("2026-11-23T14:00:00Z"),
    );
    expect(sentBefore.toISOString()).toBe("2026-11-23T12:00:00.000Z");
    expect(sentAfter.toISOString()).toBe("2026-11-22T14:00:00.000Z");
  });

  it("never reminds while the 30 minute code could still be used", () => {
    expect(REMINDER_DELAY_HOURS * 60).toBeGreaterThan(30);
    expect(REMINDER_MAX_AGE_HOURS).toBeGreaterThan(REMINDER_DELAY_HOURS);
  });

  it("gives each pending signup one dedupe key", () => {
    expect(reminderDedupeKey("abc")).toBe("reminder:abc");
  });
});
