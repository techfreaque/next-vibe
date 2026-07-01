/**
 * Tests for object utilities to verify type preservation
 */

import { describe, expect, test } from "bun:test";

import { objectEntries, objectEntriesNumericEnum } from "./object";

// Test enum definitions to match the ones used in cron stats
enum TestPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  CRITICAL = "critical",
}

enum TestWeekday {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

// Test data structures
const priorityRecord: Partial<Record<TestPriority, number>> = {
  [TestPriority.LOW]: 5,
  [TestPriority.HIGH]: 10,
  // NORMAL and CRITICAL are missing to test partial records
};

const weekdayRecord: Partial<Record<TestWeekday, number>> = {
  [TestWeekday.MONDAY]: 100,
  [TestWeekday.FRIDAY]: 80,
  // Other days are missing
};

// Test type preservation
describe("Object utilities type preservation", () => {
  test("objectEntries preserves enum types for priority", () => {
    const entries = objectEntries(priorityRecord);

    // This should compile without type errors and preserve enum types
    entries.forEach(([priority, count]) => {
      // priority should be of type TestPriority
      // count should be of type number
      expect(Object.values(TestPriority)).toContain(priority);
      expect(typeof count).toBe("number");
    });

    expect(entries.length).toBe(2); // Only LOW and HIGH are defined
  });

  test("objectEntriesNumericEnum preserves enum types for weekday", () => {
    const entries = objectEntriesNumericEnum(weekdayRecord);

    // This should compile without type errors and preserve enum types
    entries.forEach(([weekday, count]) => {
      // weekday should be of type TestWeekday (number enum)
      // count should be of type number
      expect(typeof weekday).toBe("number");
      expect(Object.values(TestWeekday)).toContain(weekday);
      expect(typeof count).toBe("number");
    });

    expect(entries.length).toBe(2); // Only MONDAY and FRIDAY are defined
  });

  test("filtered entries only include defined values", () => {
    const partialRecord: Partial<Record<TestPriority, number>> = {
      [TestPriority.LOW]: 5,
      [TestPriority.NORMAL]: undefined, // This should be filtered out
      [TestPriority.HIGH]: 10,
    };

    const entries = objectEntries(partialRecord);
    expect(entries.length).toBe(2); // undefined values should be filtered
    expect(entries.every(([, value]) => value !== undefined)).toBe(true);
  });
});
