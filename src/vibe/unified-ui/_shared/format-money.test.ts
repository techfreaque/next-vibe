import { expect, test } from "bun:test";
import { formatMoney, formatMoneyAmount, formatPercent } from "./format-money";

test("shows two decimals and the document's currency in the viewer's locale", () => {
  expect(formatMoney("123.615", "EUR", "en-US")).toBe("€123.62");
  expect(formatMoney(25.1251, "EUR", "de-DE")).toBe("25,13\u00a0€");
  expect(formatMoney(-71.25, "USD", "en-US")).toBe("-$71.25");
  expect(formatMoney(10, "PLN", "pl-PL")).toBe("10,00\u00a0zł");
  expect(formatMoney("", "EUR", "en-US")).toBe("-");
  expect(formatMoneyAmount(4.995, "fr-FR")).toBe("5,00");
});

test("retains fractional VAT rates in the viewer's locale", () => {
  expect(formatPercent(0.055, "en-US")).toBe("5.5%");
  expect(formatPercent(0.055, "sk-SK")).toBe("5,5\u00a0%");
});
