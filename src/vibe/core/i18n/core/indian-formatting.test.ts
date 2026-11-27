import { describe, expect, it } from "bun:test";

import { formatCreditAmount } from "@/products/credit-money";

import { languageConfig } from "..";
import { getUniqueLanguages, htmlLang, toIntlLocale } from "./language-utils";
import { formatCurrency, formatDate } from "./localization-utils";

const devanagariDigits = /[०-९]/;

describe("Indian locales", () => {
  it("groups digits in lakh and crore for en-IN and hi-IN", () => {
    for (const locale of ["en-IN", "hi-IN", "hi-GLOBAL"] as const) {
      expect(new Intl.NumberFormat(toIntlLocale(locale)).format(1234567)).toBe(
        "12,34,567",
      );
      expect(formatCurrency(123456789.5, "USD", locale)).toContain(
        "12,34,56,789.50",
      );
      expect(formatCreditAmount(1234567, locale)).toBe("12,34,567");
    }
    expect(formatCreditAmount(1234567, "en-US")).toBe("1,234,567");
    expect(formatCreditAmount(1234567, "en-GLOBAL")).toBe("1,234,567");
  });

  it("keeps Western digits in Hindi numbers and dates", () => {
    const date = new Date(Date.UTC(2026, 10, 27, 9, 5));
    for (const locale of ["hi-IN", "hi-GLOBAL"] as const) {
      const outputs = [
        formatDate(date, locale),
        formatDate(date, locale, "PPPp"),
        formatCurrency(1234.5, "USD", locale),
        formatCreditAmount(98765, locale),
      ];
      for (const output of outputs) {
        expect(output).not.toMatch(devanagariDigits);
      }
      expect(formatDate(date, locale)).toContain("27");
      expect(formatDate(date, locale)).toContain("2026");
    }
  });

  it("serves Hindi in India and lists India first under Hindi", () => {
    expect(languageConfig.countryInfo.IN.language).toBe("en");
    expect(languageConfig.countryInfo.IN.languages).toContain("hi");
    expect(languageConfig.countryInfo.GLOBAL.languages).toContain("hi");
    const hindi = getUniqueLanguages().find(([code]) => code === "hi");
    expect(hindi?.[1].name).toBe("हिन्दी");
    expect(hindi?.[1].countries.map(({ code }) => code)).toEqual([
      "IN",
      "GLOBAL",
    ]);
  });

  it("derives valid <html lang> values", () => {
    expect(htmlLang("hi-IN")).toBe("hi-IN");
    expect(htmlLang("en-IN")).toBe("en-IN");
    expect(htmlLang("hi-GLOBAL")).toBe("hi");
    expect(htmlLang("en-GLOBAL")).toBe("en");
  });
});
