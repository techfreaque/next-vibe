/**
 * Cron due-selection (catch-up semantics).
 *
 * Guards the fix for the prod bug where `finance-balances-hourly` missed most
 * of its hourly ticks: the old fixed 60-second due window required a pulse to
 * land in the first minute of every scheduled period, so pulse drift silently
 * skipped whole hours/days. Due-selection is now based on `lastExecutedAt`, so a
 * missed tick is picked up on the next pulse and never lost.
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { describe, expect, it } from "vitest";

import { isCronTaskDue } from "./cron-formatter";

const logger = createEndpointLogger(false, defaultLocale);

const HOURLY = "0 * * * *";
const EVERY_MINUTE = "* * * * *";
const DAILY_6AM = "0 6 * * *";

describe("isCronTaskDue - catch-up semantics", () => {
  it("manual schedule is never due", () => {
    expect(isCronTaskDue(logger, "manual", new Date(), null)).toBe(false);
  });

  it("a task that never ran is due on the next pulse (startup catch-up)", () => {
    expect(
      isCronTaskDue(logger, HOURLY, new Date("2026-11-09T14:37:00Z"), null),
    ).toBe(true);
    expect(
      isCronTaskDue(logger, DAILY_6AM, new Date("2026-11-09T14:37:00Z"), null),
    ).toBe(true);
  });

  describe("hourly task", () => {
    it("is due when the last run was in a previous hour", () => {
      expect(
        isCronTaskDue(
          logger,
          HOURLY,
          new Date("2026-11-09T14:00:30Z"),
          new Date("2026-11-09T13:00:10Z"),
        ),
      ).toBe(true);
    });

    it("REGRESSION: is due even when the pulse lands mid-hour (outside the old 60s window)", () => {
      // The pulse drifted and only fires at :37 past the hour. The old window
      // check (now - prevScheduled < 60s) returned false here and skipped the
      // whole hour. Catch-up must fire it.
      expect(
        isCronTaskDue(
          logger,
          HOURLY,
          new Date("2026-11-09T14:37:00Z"),
          new Date("2026-11-09T13:05:00Z"),
        ),
      ).toBe(true);
    });

    it("is NOT due again within the same hour after it already ran", () => {
      expect(
        isCronTaskDue(
          logger,
          HOURLY,
          new Date("2026-11-09T14:45:00Z"),
          new Date("2026-11-09T14:05:00Z"),
        ),
      ).toBe(false);
    });
  });

  describe("every-minute task (db-health parity)", () => {
    it("is due when the last run was in a previous minute", () => {
      expect(
        isCronTaskDue(
          logger,
          EVERY_MINUTE,
          new Date("2026-11-09T14:01:30Z"),
          new Date("2026-11-09T14:00:30Z"),
        ),
      ).toBe(true);
    });

    it("does not double-fire twice within the same minute", () => {
      expect(
        isCronTaskDue(
          logger,
          EVERY_MINUTE,
          new Date("2026-11-09T14:00:50Z"),
          new Date("2026-11-09T14:00:10Z"),
        ),
      ).toBe(false);
    });
  });

  describe("daily task", () => {
    it("is due once today's scheduled time has passed since yesterday's run", () => {
      expect(
        isCronTaskDue(
          logger,
          DAILY_6AM,
          new Date("2026-11-09T06:12:00Z"),
          new Date("2026-11-08T06:00:05Z"),
        ),
      ).toBe(true);
    });

    it("is not due before today's scheduled time", () => {
      expect(
        isCronTaskDue(
          logger,
          DAILY_6AM,
          new Date("2026-11-09T05:30:00Z"),
          new Date("2026-11-08T06:00:05Z"),
        ),
      ).toBe(false);
    });

    it("is not due again after today's run", () => {
      expect(
        isCronTaskDue(
          logger,
          DAILY_6AM,
          new Date("2026-11-09T18:00:00Z"),
          new Date("2026-11-09T06:00:05Z"),
        ),
      ).toBe(false);
    });
  });

  describe("runOnce (anchored on createdAt) - fire at schedule, never at boot", () => {
    const DAILY_8AM = "0 8 * * *";
    // Real prod incident: newsletter-nov-2026-blast row created at boot
    // 2026-11-09T22:05:53Z with schedule 08:00 UTC fired 10s later.
    const created = new Date("2026-11-09T22:05:53Z");

    it("REGRESSION: is NOT due right after boot/creation", () => {
      expect(
        isCronTaskDue(
          logger,
          DAILY_8AM,
          new Date("2026-11-09T22:06:03Z"),
          null,
          created,
        ),
      ).toBe(false);
    });

    it("stays not due until the next scheduled occurrence", () => {
      expect(
        isCronTaskDue(
          logger,
          DAILY_8AM,
          new Date("2026-11-10T07:59:30Z"),
          null,
          created,
        ),
      ).toBe(false);
    });

    it("is due once the first occurrence after creation has elapsed", () => {
      expect(
        isCronTaskDue(
          logger,
          DAILY_8AM,
          new Date("2026-11-10T08:00:20Z"),
          null,
          created,
        ),
      ).toBe(true);
      // Pulse drift / downtime past the slot still catches up.
      expect(
        isCronTaskDue(
          logger,
          DAILY_8AM,
          new Date("2026-11-10T13:00:00Z"),
          null,
          created,
        ),
      ).toBe(true);
    });

    it("every-minute one-shot (import jobs) still fires within a minute", () => {
      const at = new Date("2026-11-09T14:00:30Z");
      expect(
        isCronTaskDue(logger, EVERY_MINUTE, new Date("2026-11-09T14:00:45Z"), null, at),
      ).toBe(false);
      expect(
        isCronTaskDue(logger, EVERY_MINUTE, new Date("2026-11-09T14:01:05Z"), null, at),
      ).toBe(true);
    });

    it("unanchored never-ran tasks keep startup catch-up", () => {
      expect(
        isCronTaskDue(logger, DAILY_8AM, new Date("2026-11-09T22:06:03Z"), null, null),
      ).toBe(true);
    });
  });
});
