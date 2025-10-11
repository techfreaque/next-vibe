/**
 * Tests for localization utilities, specifically timezone handling
 * in consultation business hours validation
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

import { CONSULTATION_CONFIG } from "@/app/api/[locale]/v1/core/consultation/consultation-config/repository";

import type { CountryLanguage } from "../config";
import {
  formatTimeInTimezone,
  getLocalizedBusinessHours,
  isTimeWithinBusinessHours,
} from "../localization-utils";

describe("Localization Utils - Timezone Handling", () => {
  // Test with consistent dates to avoid DST issues in tests
  const winterTestDate = new Date("2024-01-15T00:00:00.000Z"); // Monday in winter (no DST)
  const summerTestDate = new Date("2024-07-15T00:00:00.000Z"); // Monday in summer (DST)

  beforeEach(() => {
    // Reset any mocks before each test
    vi.clearAllMocks();
  });

  describe("isTimeWithinBusinessHours", () => {
    // Business hours are 7:00 AM - 3:00 PM UTC (from config)

    describe("UTC timezone", () => {
      const timezone = "UTC";

      it("should accept times within business hours", () => {
        expect(
          isTimeWithinBusinessHours("07:00", timezone, winterTestDate),
        ).toBe(true);
        expect(
          isTimeWithinBusinessHours("10:00", timezone, winterTestDate),
        ).toBe(true);
        expect(
          isTimeWithinBusinessHours("12:00", timezone, winterTestDate),
        ).toBe(true);
        expect(
          isTimeWithinBusinessHours("15:00", timezone, winterTestDate),
        ).toBe(true);
      });

      it("should reject times outside business hours", () => {
        expect(
          isTimeWithinBusinessHours("06:59", timezone, winterTestDate),
        ).toBe(false);
        expect(
          isTimeWithinBusinessHours("15:01", timezone, winterTestDate),
        ).toBe(false);
        expect(
          isTimeWithinBusinessHours("16:00", timezone, winterTestDate),
        ).toBe(false);
        expect(
          isTimeWithinBusinessHours("00:00", timezone, winterTestDate),
        ).toBe(false);
        expect(
          isTimeWithinBusinessHours("23:59", timezone, winterTestDate),
        ).toBe(false);
      });

      it("should handle boundary times correctly", () => {
        // Exact start and end times should be valid
        expect(
          isTimeWithinBusinessHours("07:00", timezone, winterTestDate),
        ).toBe(true);
        expect(
          isTimeWithinBusinessHours("15:00", timezone, winterTestDate),
        ).toBe(true);

        // One minute before/after should be invalid
        expect(
          isTimeWithinBusinessHours("06:59", timezone, winterTestDate),
        ).toBe(false);
        expect(
          isTimeWithinBusinessHours("15:01", timezone, winterTestDate),
        ).toBe(false);
      });
    });

    describe("German timezone (Europe/Berlin) - The main issue case", () => {
      const timezone = "Europe/Berlin";

      describe("Winter time (CET = UTC+1)", () => {
        // In winter, Germany is UTC+1
        // Business hours 7:00-15:00 UTC = 8:00-16:00 CET

        it("should accept times within business hours in German winter time", () => {
          expect(
            isTimeWithinBusinessHours("08:00", timezone, winterTestDate),
          ).toBe(true);
          expect(
            isTimeWithinBusinessHours("10:00", timezone, winterTestDate),
          ).toBe(true);
          expect(
            isTimeWithinBusinessHours("12:00", timezone, winterTestDate),
          ).toBe(true);
          expect(
            isTimeWithinBusinessHours("14:00", timezone, winterTestDate),
          ).toBe(true);
          expect(
            isTimeWithinBusinessHours("16:00", timezone, winterTestDate),
          ).toBe(true);
        });

        it("should reject times outside business hours in German winter time", () => {
          expect(
            isTimeWithinBusinessHours("07:59", timezone, winterTestDate),
          ).toBe(false);
          expect(
            isTimeWithinBusinessHours("16:01", timezone, winterTestDate),
          ).toBe(false);
          expect(
            isTimeWithinBusinessHours("17:00", timezone, winterTestDate),
          ).toBe(false);
          expect(
            isTimeWithinBusinessHours("06:00", timezone, winterTestDate),
          ).toBe(false);
          expect(
            isTimeWithinBusinessHours("00:00", timezone, winterTestDate),
          ).toBe(false);
        });

        it("should handle boundary times correctly in German winter time", () => {
          // Exact converted times should be valid
          expect(
            isTimeWithinBusinessHours("08:00", timezone, winterTestDate),
          ).toBe(true);
          expect(
            isTimeWithinBusinessHours("16:00", timezone, winterTestDate),
          ).toBe(true);

          // One minute before/after should be invalid
          expect(
            isTimeWithinBusinessHours("07:59", timezone, winterTestDate),
          ).toBe(false);
          expect(
            isTimeWithinBusinessHours("16:01", timezone, winterTestDate),
          ).toBe(false);
        });
      });

      describe("Summer time (CEST = UTC+2)", () => {
        // In summer, Germany is UTC+2 due to DST
        // Business hours 7:00-15:00 UTC = 9:00-17:00 CEST

        it("should accept times within business hours in German summer time", () => {
          expect(
            isTimeWithinBusinessHours("09:00", timezone, summerTestDate),
          ).toBe(true);
          expect(
            isTimeWithinBusinessHours("11:00", timezone, summerTestDate),
          ).toBe(true);
          expect(
            isTimeWithinBusinessHours("13:00", timezone, summerTestDate),
          ).toBe(true);
          expect(
            isTimeWithinBusinessHours("15:00", timezone, summerTestDate),
          ).toBe(true);
          expect(
            isTimeWithinBusinessHours("17:00", timezone, summerTestDate),
          ).toBe(true);
        });

        it("should reject times outside business hours in German summer time", () => {
          expect(
            isTimeWithinBusinessHours("08:59", timezone, summerTestDate),
          ).toBe(false);
          expect(
            isTimeWithinBusinessHours("17:01", timezone, summerTestDate),
          ).toBe(false);
          expect(
            isTimeWithinBusinessHours("18:00", timezone, summerTestDate),
          ).toBe(false);
          expect(
            isTimeWithinBusinessHours("07:00", timezone, summerTestDate),
          ).toBe(false);
        });
      });
    });

    describe("US Eastern timezone (America/New_York)", () => {
      const timezone = "America/New_York";

      describe("Winter time (EST = UTC-5)", () => {
        // In winter, US Eastern is UTC-5
        // Business hours 7:00-15:00 UTC = 2:00-10:00 EST

        it("should accept times within business hours in US Eastern winter time", () => {
          expect(
            isTimeWithinBusinessHours("02:00", timezone, winterTestDate),
          ).toBe(true);
          expect(
            isTimeWithinBusinessHours("06:00", timezone, winterTestDate),
          ).toBe(true);
          expect(
            isTimeWithinBusinessHours("08:00", timezone, winterTestDate),
          ).toBe(true);
          expect(
            isTimeWithinBusinessHours("10:00", timezone, winterTestDate),
          ).toBe(true);
        });

        it("should reject times outside business hours in US Eastern winter time", () => {
          expect(
            isTimeWithinBusinessHours("01:59", timezone, winterTestDate),
          ).toBe(false);
          expect(
            isTimeWithinBusinessHours("10:01", timezone, winterTestDate),
          ).toBe(false);
          expect(
            isTimeWithinBusinessHours("12:00", timezone, winterTestDate),
          ).toBe(false);
          expect(
            isTimeWithinBusinessHours("15:00", timezone, winterTestDate),
          ).toBe(false);
        });
      });

      describe("Summer time (EDT = UTC-4)", () => {
        // In summer, US Eastern is UTC-4 due to DST
        // Business hours 7:00-15:00 UTC = 3:00-11:00 EDT

        it("should accept times within business hours in US Eastern summer time", () => {
          expect(
            isTimeWithinBusinessHours("03:00", timezone, summerTestDate),
          ).toBe(true);
          expect(
            isTimeWithinBusinessHours("07:00", timezone, summerTestDate),
          ).toBe(true);
          expect(
            isTimeWithinBusinessHours("09:00", timezone, summerTestDate),
          ).toBe(true);
          expect(
            isTimeWithinBusinessHours("11:00", timezone, summerTestDate),
          ).toBe(true);
        });

        it("should reject times outside business hours in US Eastern summer time", () => {
          expect(
            isTimeWithinBusinessHours("02:59", timezone, summerTestDate),
          ).toBe(false);
          expect(
            isTimeWithinBusinessHours("11:01", timezone, summerTestDate),
          ).toBe(false);
          expect(
            isTimeWithinBusinessHours("13:00", timezone, summerTestDate),
          ).toBe(false);
        });
      });
    });

    describe("Edge cases and error handling", () => {
      const timezone = "UTC";

      it("should handle invalid time formats gracefully", () => {
        expect(
          isTimeWithinBusinessHours("invalid", timezone, winterTestDate),
        ).toBe(false);
        expect(
          isTimeWithinBusinessHours("25:00", timezone, winterTestDate),
        ).toBe(false);
        expect(
          isTimeWithinBusinessHours("12:60", timezone, winterTestDate),
        ).toBe(false);
        expect(isTimeWithinBusinessHours("", timezone, winterTestDate)).toBe(
          false,
        );
        expect(isTimeWithinBusinessHours("12", timezone, winterTestDate)).toBe(
          false,
        );
        expect(
          isTimeWithinBusinessHours("12:30:45", timezone, winterTestDate),
        ).toBe(false);
      });

      it("should handle invalid timezones gracefully", () => {
        // Should not throw errors for invalid timezones
        const result1 = isTimeWithinBusinessHours(
          "10:00",
          "Invalid/Timezone",
          winterTestDate,
        );
        const result2 = isTimeWithinBusinessHours("10:00", "", winterTestDate);
        const result3 = isTimeWithinBusinessHours(
          "10:00",
          "NotATimezone",
          winterTestDate,
        );

        // Results should be boolean (not throw errors)
        expect(typeof result1).toBe("boolean");
        expect(typeof result2).toBe("boolean");
        expect(typeof result3).toBe("boolean");
      });

      it("should handle edge time values", () => {
        // Test with times that might cause parsing issues
        expect(
          isTimeWithinBusinessHours("00:00", timezone, winterTestDate),
        ).toBe(false);
        expect(
          isTimeWithinBusinessHours("23:59", timezone, winterTestDate),
        ).toBe(false);
        expect(
          isTimeWithinBusinessHours("12:00", timezone, winterTestDate),
        ).toBe(true);
        expect(
          isTimeWithinBusinessHours("07:00", timezone, winterTestDate),
        ).toBe(true);
        expect(
          isTimeWithinBusinessHours("15:00", timezone, winterTestDate),
        ).toBe(true);
      });

      it("should handle different date objects consistently", () => {
        const date1 = new Date("2024-01-15T00:00:00.000Z");
        const date2 = new Date("2024-01-15T12:00:00.000Z");
        const date3 = new Date("2024-01-15T23:59:59.999Z");

        // Same day, different times - should give same result for business hours validation
        expect(isTimeWithinBusinessHours("10:00", timezone, date1)).toBe(true);
        expect(isTimeWithinBusinessHours("10:00", timezone, date2)).toBe(true);
        expect(isTimeWithinBusinessHours("10:00", timezone, date3)).toBe(true);
      });
    });

    describe("Configuration consistency", () => {
      it("should use the correct business hours from config", () => {
        expect(CONSULTATION_CONFIG.businessStartHourUTC).toBe(7);
        expect(CONSULTATION_CONFIG.businessEndHourUTC).toBe(15);
      });

      it("should validate that business hours make sense", () => {
        expect(CONSULTATION_CONFIG.businessStartHourUTC).toBeLessThan(
          CONSULTATION_CONFIG.businessEndHourUTC,
        );
        expect(CONSULTATION_CONFIG.businessStartHourUTC).toBeGreaterThanOrEqual(
          0,
        );
        expect(CONSULTATION_CONFIG.businessEndHourUTC).toBeLessThanOrEqual(24);
      });
    });
  });

  describe("formatTimeInTimezone", () => {
    it("should format time correctly in different timezones", () => {
      const testTime = new Date("2024-01-15T12:00:00.000Z"); // 12:00 UTC

      expect(formatTimeInTimezone(testTime, "UTC")).toBe("12:00");
      expect(formatTimeInTimezone(testTime, "Europe/Berlin")).toBe("13:00"); // UTC+1 in winter
      expect(formatTimeInTimezone(testTime, "America/New_York")).toBe("07:00"); // UTC-5 in winter
    });

    it("should handle invalid timezones gracefully", () => {
      const testTime = new Date("2024-01-15T12:00:00.000Z");

      // Should not throw errors and return a valid time string
      const result = formatTimeInTimezone(testTime, "Invalid/Timezone");
      expect(typeof result).toBe("string");
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe("getLocalizedBusinessHours", () => {
    it("should return correct business hours for different locales", () => {
      // Test German locale (should convert UTC to CET/CEST)
      const germanHours = getLocalizedBusinessHours("de-DE");
      expect(germanHours.startHour).toBe("08"); // 7 UTC = 8 CET in winter
      expect(germanHours.endHour).toBe("16"); // 15 UTC = 16 CET in winter

      // Test US locale (should convert UTC to EST/EDT)
      const usHours = getLocalizedBusinessHours("en-GLOBAL");
      expect(usHours.startHour).toBe("02"); // 7 UTC = 2 EST in winter
      expect(usHours.endHour).toBe("10"); // 15 UTC = 10 EST in winter

      // Test UTC locale (should remain the same)
      const utcHours = getLocalizedBusinessHours("en-GB" as CountryLanguage);
      expect(utcHours.startHour).toBe("07"); // 7 UTC = 7 UTC
      expect(utcHours.endHour).toBe("15"); // 15 UTC = 15 UTC
    });
  });
});
