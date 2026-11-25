import type { CountryLanguage } from "../../../../core/i18n/core/config";

export type DecimalPresentation = "quantity" | "money" | "percent";

export function decimalInputText(
  value: number | undefined,
  locale: CountryLanguage,
  presentation: DecimalPresentation,
  editing: boolean,
): string {
  if (value === undefined || !Number.isFinite(value)) {
    return "";
  }
  const money = presentation === "money";
  return new Intl.NumberFormat(locale, {
    useGrouping: false,
    minimumFractionDigits: money ? 2 : 0,
    maximumFractionDigits: money && !editing ? 2 : 4,
  }).format(presentation === "percent" ? value * 100 : value);
}

export function parseDecimalInput(
  text: string,
  locale: CountryLanguage,
  presentation: DecimalPresentation,
): number {
  const separator =
    new Intl.NumberFormat(locale)
      .formatToParts(1.5)
      .find((part) => part.type === "decimal")?.value ?? ".";
  const decimal = text.trim().replace(separator, ".");
  if (!/^-?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(decimal)) {
    return Number.NaN;
  }
  return Number(presentation === "percent" ? `${decimal}e-2` : decimal);
}
