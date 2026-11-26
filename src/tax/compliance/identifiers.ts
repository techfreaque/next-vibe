/**
 * Business identifier checks per country.
 *
 * Slovakia: IČO (8 digits, mod 11 check digit), DIČ (10 digits),
 * IČ DPH ("SK" + 10 digits, the number is divisible by 11).
 * Other countries: generic EU VAT id shape only.
 */

export type IdentifierCheck = "ok" | "missing" | "invalid";

function digitsOnly(value: string): string {
  return value.replace(/\s+/g, "");
}

export function normalizeIdentifier(
  value: string | null | undefined,
): string | null {
  const trimmed = value ? digitsOnly(value).toUpperCase() : "";
  return trimmed.length > 0 ? trimmed : null;
}

/** IČO: 8 digits. Weights 8..2 on the first seven, check = (11 - sum mod 11) mod 10. */
export function checkSlovakIco(
  value: string | null | undefined,
): IdentifierCheck {
  const ico = normalizeIdentifier(value);
  if (!ico) {
    return "missing";
  }
  const padded = /^\d{6,8}$/.test(ico) ? ico.padStart(8, "0") : null;
  if (!padded) {
    return "invalid";
  }
  let sum = 0;
  for (let index = 0; index < 7; index += 1) {
    sum += Number(padded[index]) * (8 - index);
  }
  const check = (11 - (sum % 11)) % 10;
  return check === Number(padded[7]) ? "ok" : "invalid";
}

/** DIČ: 10 digits, first digit not zero. */
export function checkSlovakDic(
  value: string | null | undefined,
): IdentifierCheck {
  const dic = normalizeIdentifier(value);
  if (!dic) {
    return "missing";
  }
  return /^[1-9]\d{9}$/.test(dic) ? "ok" : "invalid";
}

/** IČ DPH: SK + 10 digits, the number divisible by 11 (VIES rule). */
export function checkSlovakVatId(
  value: string | null | undefined,
): IdentifierCheck {
  const vatId = normalizeIdentifier(value);
  if (!vatId) {
    return "missing";
  }
  const match = /^SK([1-9]\d{9})$/.exec(vatId);
  if (!match?.[1]) {
    return "invalid";
  }
  return BigInt(match[1]) % BigInt(11) === BigInt(0) ? "ok" : "invalid";
}

/** Any EU VAT id: two-letter prefix (EL for Greece) and 2 to 13 characters. */
export function checkEuVatId(
  value: string | null | undefined,
): IdentifierCheck {
  const vatId = normalizeIdentifier(value);
  if (!vatId) {
    return "missing";
  }
  if (vatId.startsWith("SK")) {
    return checkSlovakVatId(vatId);
  }
  return /^[A-Z]{2}[0-9A-Z+*]{2,13}$/.test(vatId) ? "ok" : "invalid";
}

/** Country prefix of a VAT id, Greece uses EL. */
export function vatIdCountry(value: string | null | undefined): string | null {
  const vatId = normalizeIdentifier(value);
  if (!vatId || !/^[A-Z]{2}/.test(vatId)) {
    return null;
  }
  const prefix = vatId.slice(0, 2);
  return prefix === "EL" ? "GR" : prefix;
}

export const EU_MEMBER_STATES = [
  "AT",
  "BE",
  "BG",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "HU",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SE",
  "SI",
  "SK",
] as const;

export function isEuCountry(country: string | null | undefined): boolean {
  const code = country?.trim().toUpperCase();
  return EU_MEMBER_STATES.some((member) => member === code);
}
