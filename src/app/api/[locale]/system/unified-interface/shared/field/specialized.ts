/**
 * Specialized Field Utilities
 *
 * Provides utilities for specialized field types like currencies, languages,
 * countries, and timezones using predefined data sources.
 */

import { z } from "zod";

import type { TranslationKey } from "@/i18n/core/static-types";

import { FieldDataType, WidgetType } from "../types/enums";
import { requestDataField } from "./utils";

// ============================================================================
// CURRENCY UTILITIES
// ============================================================================

/**
 * Common currency codes with their symbols
 */
export const CURRENCY_OPTIONS = [
  {
    value: "USD",
    label: "currency.usd" as TranslationKey,
    symbol: "$",
  },
  {
    value: "EUR",
    label: "currency.eur" as TranslationKey,
    symbol: "€",
  },
  {
    value: "GBP",
    label: "currency.gbp" as TranslationKey,
    symbol: "£",
  },
  {
    value: "JPY",
    label: "currency.jpy" as TranslationKey,
    symbol: "¥",
  },
  {
    value: "CHF",
    label: "currency.chf" as TranslationKey,
    symbol: "CHF",
  },
  {
    value: "CAD",
    label: "currency.cad" as TranslationKey,
    symbol: "C$",
  },
  {
    value: "AUD",
    label: "currency.aud" as TranslationKey,
    symbol: "A$",
  },
  {
    value: "CNY",
    label: "currency.cny" as TranslationKey,
    symbol: "¥",
  },
  {
    value: "INR",
    label: "currency.inr" as TranslationKey,
    symbol: "₹",
  },
  {
    value: "BRL",
    label: "currency.brl" as TranslationKey,
    symbol: "R$",
  },
] as const;

// Separate options for form fields (without symbol)
const CURRENCY_FORM_OPTIONS: Array<{ value: string; label: TranslationKey }> = CURRENCY_OPTIONS.map(({ value, label }) => ({
  value,
  label,
}));

export type CurrencyCode = (typeof CURRENCY_OPTIONS)[number]["value"];

/**
 * Creates a currency selection field
 */
export function currencyField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required = false,
  multiple = false,
): ReturnType<typeof requestDataField> {
  const schema = multiple
    ? z.array(z.enum(CURRENCY_OPTIONS.map((c) => c.value)))
    : z.enum(CURRENCY_OPTIONS.map((c) => c.value));

  return requestDataField(
    {
      type: WidgetType.FORM_FIELD,
      fieldType: multiple ? FieldDataType.MULTISELECT : FieldDataType.SELECT,
      label,
      description,
      placeholder,
      options: CURRENCY_FORM_OPTIONS,
      required,
    },
    required ? schema : schema.optional(),
  );
}

// ============================================================================
// LANGUAGE UTILITIES
// ============================================================================

/**
 * Common language codes with their names
 */
export const LANGUAGE_OPTIONS = [
  { value: "en", label: "language.english" as TranslationKey },
  { value: "de", label: "language.german" as TranslationKey },
  { value: "fr", label: "language.french" as TranslationKey },
  { value: "es", label: "language.spanish" as TranslationKey },
  { value: "it", label: "language.italian" as TranslationKey },
  { value: "pt", label: "language.portuguese" as TranslationKey },
  { value: "nl", label: "language.dutch" as TranslationKey },
  { value: "ru", label: "language.russian" as TranslationKey },
  { value: "zh", label: "language.chinese" as TranslationKey },
  { value: "ja", label: "language.japanese" as TranslationKey },
  { value: "ko", label: "language.korean" as TranslationKey },
  { value: "ar", label: "language.arabic" as TranslationKey },
  { value: "hi", label: "language.hindi" as TranslationKey },
] as const;

export type LanguageCode = (typeof LANGUAGE_OPTIONS)[number]["value"];

/**
 * Creates a language selection field
 */
export function languageField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required = false,
  multiple = false,
): ReturnType<typeof requestDataField> {
  const schema = multiple
    ? z.array(z.enum(LANGUAGE_OPTIONS.map((l) => l.value)))
    : z.enum(LANGUAGE_OPTIONS.map((l) => l.value));

  return requestDataField(
    {
      type: WidgetType.FORM_FIELD,
      fieldType: multiple ? FieldDataType.MULTISELECT : FieldDataType.SELECT,
      label,
      description,
      placeholder,
      options: [...LANGUAGE_OPTIONS],
      required,
    },
    required ? schema : schema.optional(),
  );
}

// ============================================================================
// COUNTRY UTILITIES
// ============================================================================

/**
 * Common country codes with their names
 */
export const COUNTRY_OPTIONS = [
  { value: "US", label: "country.united_states" as TranslationKey },
  { value: "CA", label: "country.canada" as TranslationKey },
  {
    value: "GB",
    label: "country.united_kingdom" as TranslationKey,
  },
  { value: "DE", label: "country.germany" as TranslationKey },
  { value: "FR", label: "country.france" as TranslationKey },
  { value: "IT", label: "country.italy" as TranslationKey },
  { value: "ES", label: "country.spain" as TranslationKey },
  { value: "NL", label: "country.netherlands" as TranslationKey },
  { value: "CH", label: "country.switzerland" as TranslationKey },
  { value: "AT", label: "country.austria" as TranslationKey },
  { value: "BE", label: "country.belgium" as TranslationKey },
  { value: "SE", label: "country.sweden" as TranslationKey },
  { value: "NO", label: "country.norway" as TranslationKey },
  { value: "DK", label: "country.denmark" as TranslationKey },
  { value: "FI", label: "country.finland" as TranslationKey },
  { value: "AU", label: "country.australia" as TranslationKey },
  { value: "NZ", label: "country.new_zealand" as TranslationKey },
  { value: "JP", label: "country.japan" as TranslationKey },
  { value: "KR", label: "country.south_korea" as TranslationKey },
  { value: "CN", label: "country.china" as TranslationKey },
  { value: "IN", label: "country.india" as TranslationKey },
  { value: "BR", label: "country.brazil" as TranslationKey },
  { value: "MX", label: "country.mexico" as TranslationKey },
  { value: "AR", label: "country.argentina" as TranslationKey },
] as const;

export type CountryCode = (typeof COUNTRY_OPTIONS)[number]["value"];

/**
 * Creates a country selection field
 */
export function countryField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required = false,
  multiple = false,
): ReturnType<typeof requestDataField> {
  const schema = multiple
    ? z.array(z.enum(COUNTRY_OPTIONS.map((c) => c.value)))
    : z.enum(COUNTRY_OPTIONS.map((c) => c.value));

  return requestDataField(
    {
      type: WidgetType.FORM_FIELD,
      fieldType: multiple ? FieldDataType.MULTISELECT : FieldDataType.SELECT,
      label,
      description,
      placeholder,
      options: [...COUNTRY_OPTIONS],
      required,
    },
    required ? schema : schema.optional(),
  );
}

// ============================================================================
// TIMEZONE UTILITIES
// ============================================================================

/**
 * Common timezone identifiers
 */
export const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "timezone.utc" as TranslationKey },
  {
    value: "America/New_York",
    label: "timezone.eastern" as TranslationKey,
  },
  {
    value: "America/Chicago",
    label: "timezone.central" as TranslationKey,
  },
  {
    value: "America/Denver",
    label: "timezone.mountain" as TranslationKey,
  },
  {
    value: "America/Los_Angeles",
    label: "timezone.pacific" as TranslationKey,
  },
  {
    value: "Europe/London",
    label: "timezone.london" as TranslationKey,
  },
  {
    value: "Europe/Paris",
    label: "timezone.paris" as TranslationKey,
  },
  {
    value: "Europe/Berlin",
    label: "timezone.berlin" as TranslationKey,
  },
  {
    value: "Europe/Rome",
    label: "timezone.rome" as TranslationKey,
  },
  {
    value: "Europe/Madrid",
    label: "timezone.madrid" as TranslationKey,
  },
  {
    value: "Europe/Amsterdam",
    label: "timezone.amsterdam" as TranslationKey,
  },
  {
    value: "Europe/Zurich",
    label: "timezone.zurich" as TranslationKey,
  },
  {
    value: "Asia/Tokyo",
    label: "timezone.tokyo" as TranslationKey,
  },
  {
    value: "Asia/Shanghai",
    label: "timezone.shanghai" as TranslationKey,
  },
  {
    value: "Asia/Seoul",
    label: "timezone.seoul" as TranslationKey,
  },
  {
    value: "Asia/Mumbai",
    label: "timezone.mumbai" as TranslationKey,
  },
  {
    value: "Australia/Sydney",
    label: "timezone.sydney" as TranslationKey,
  },
  {
    value: "Pacific/Auckland",
    label: "timezone.auckland" as TranslationKey,
  },
] as const;

export type TimezoneCode = (typeof TIMEZONE_OPTIONS)[number]["value"];

/**
 * Creates a timezone selection field
 */
export function timezoneField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required = false,
  multiple = false,
): ReturnType<typeof requestDataField> {
  const schema = multiple
    ? z.array(z.enum(TIMEZONE_OPTIONS.map((t) => t.value)))
    : z.enum(TIMEZONE_OPTIONS.map((t) => t.value));

  return requestDataField(
    {
      type: WidgetType.FORM_FIELD,
      fieldType: multiple ? FieldDataType.MULTISELECT : FieldDataType.SELECT,
      label,
      description,
      placeholder,
      options: [...TIMEZONE_OPTIONS],
      required,
    },
    required ? schema : schema.optional(),
  );
}
