import type { CountryLanguage } from "../../../../core/i18n/core/config";

/**
 * A picker selects by name, so the label never says "ID":
 * "Company ID" reads "Company", "Company Id" reads "Company".
 */
export function pickerFieldLabel(label: string): string {
  const stripped = label.replace(/\s+(ID|Id)$/u, "").trim();
  return stripped || label;
}

/**
 * The label as it reads inside a sentence ("Select company"): languages that
 * write common nouns in lower case lower the first letter, unless the word is
 * an acronym ("VAT rate", "IBAN"). German keeps its capitalised nouns.
 */
export function pickerButtonLabel(
  label: string,
  locale: CountryLanguage,
): string {
  if (locale.startsWith("de")) {
    return label;
  }
  const first = label.charAt(0);
  const second = label.charAt(1);
  if (!first || second.toLocaleUpperCase() === second) {
    return label;
  }
  return first.toLocaleLowerCase(locale) + label.slice(1);
}
