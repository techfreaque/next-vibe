import { expect, test } from "bun:test";

import { formatExecutionDate } from "./format-execution-date";

test("formats local dates and JSON task execution timestamps identically", () => {
  const timestamp = "2024-01-15T10:00:00.000Z";
  expect(formatExecutionDate(timestamp)).toBe("2024-01-15 10:00:00");
  expect(formatExecutionDate(new Date(timestamp))).toBe(
    formatExecutionDate(timestamp),
  );
});
