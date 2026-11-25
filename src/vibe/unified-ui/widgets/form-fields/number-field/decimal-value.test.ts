import { expect, test } from "bun:test";

import { decimalInputText, parseDecimalInput } from "./decimal-value";

test("edits localized percentages as percentage points and keeps the API fraction", () => {
  expect(decimalInputText(0.055, "sk-SK", "percent", false)).toBe("5,5");
  expect(parseDecimalInput("5,5", "sk-SK", "percent")).toBe(0.055);
  expect(parseDecimalInput("8.25", "en-US", "percent")).toBe(0.0825);
  expect(parseDecimalInput("0", "de-DE", "percent")).toBe(0);
  expect(parseDecimalInput("100", "sk-SK", "percent")).toBe(1);
});

test("shows cents at rest and retains precision on focus", () => {
  expect(decimalInputText(12.3456, "sk-SK", "money", false)).toBe("12,35");
  expect(decimalInputText(12.3456, "sk-SK", "money", true)).toBe("12,3456");
  expect(parseDecimalInput("12,3456", "sk-SK", "money")).toBe(12.3456);
  expect(parseDecimalInput("", "en-US", "quantity")).toBeNaN();
  expect(parseDecimalInput("1,2.3", "de-DE", "money")).toBeNaN();
});
