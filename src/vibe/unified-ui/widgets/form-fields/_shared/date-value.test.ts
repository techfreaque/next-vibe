import { expect, test } from "bun:test";
import { parseFormDate } from "./date-value";

test("restores serialized instants and preserves calendar days in the user's timezone", () => {
  const day = parseFormDate("2024-02-29");
  expect(day?.getFullYear()).toBe(2024);
  expect(day?.getMonth()).toBe(1);
  expect(day?.getDate()).toBe(29);
  expect(parseFormDate("2026-11-25T10:42:00+01:00")?.toISOString()).toBe(
    "2026-11-25T09:42:00.000Z",
  );
  expect(parseFormDate(day)).toBe(day);
  for (const bad of [
    "2026-02-29",
    "",
    "bad",
    null,
    undefined,
    new Date(Number.NaN),
  ]) {
    expect(parseFormDate(bad)).toBeUndefined();
  }
});
