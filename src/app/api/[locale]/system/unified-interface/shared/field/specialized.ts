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
    label: "app.currency.usd" as const,
    symbol: "$",
  },
  {
    value: "EUR",
    label: "app.currency.eur" as const,
    symbol: "€",
  },
  {
    value: "GBP",
    label: "app.currency.gbp" as const,
    symbol: "£",
  },
  {
    value: "JPY",
    label: "app.currency.jpy" as const,
    symbol: "¥",
  },
  {
    value: "CHF",
    label: "app.currency.chf" as const,
    symbol: "CHF",
  },
  {
    value: "CAD",
    label: "app.currency.cad" as const,
    symbol: "C$",
  },
  {
    value: "AUD",
    label: "app.currency.aud" as const,
    symbol: "A$",
  },
  {
    value: "CNY",
    label: "app.currency.cny" as const,
    symbol: "¥",
  },
  {
    value: "INR",
    label: "app.currency.inr" as const,
    symbol: "₹",
  },
  {
    value: "BRL",
    label: "app.currency.brl" as const,
    symbol: "R$",
  },
];

// Separate options for form fields (without symbol)
const CURRENCY_FORM_OPTIONS: Array<{ value: string; label: TranslationKey }> =
  CURRENCY_OPTIONS.map(({ value, label }) => ({
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
  { value: "en", label: "language.english" as const },
  { value: "de", label: "language.german" as const },
  { value: "fr", label: "language.french" as const },
  { value: "es", label: "language.spanish" as const },
  { value: "it", label: "language.italian" as const },
  { value: "pt", label: "language.portuguese" as const },
  { value: "nl", label: "language.dutch" as const },
  { value: "ru", label: "language.russian" as const },
  { value: "zh", label: "language.chinese" as const },
  { value: "ja", label: "language.japanese" as const },
  { value: "ko", label: "language.korean" as const },
  { value: "ar", label: "language.arabic" as const },
  { value: "hi", label: "language.hindi" as const },
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
  { value: "US", label: "country.united_states" as const },
  { value: "CA", label: "country.canada" as const },
  {
    value: "GB",
    label: "country.united_kingdom" as const,
  },
  { value: "DE", label: "country.germany" as const },
  { value: "FR", label: "country.france" as const },
  { value: "IT", label: "country.italy" as const },
  { value: "ES", label: "country.spain" as const },
  { value: "NL", label: "country.netherlands" as const },
  { value: "CH", label: "country.switzerland" as const },
  { value: "AT", label: "country.austria" as const },
  { value: "BE", label: "country.belgium" as const },
  { value: "SE", label: "country.sweden" as const },
  { value: "NO", label: "country.norway" as const },
  { value: "DK", label: "country.denmark" as const },
  { value: "FI", label: "country.finland" as const },
  { value: "AU", label: "country.australia" as const },
  { value: "NZ", label: "country.new_zealand" as const },
  { value: "JP", label: "country.japan" as const },
  { value: "KR", label: "country.south_korea" as const },
  { value: "CN", label: "country.china" as const },
  { value: "IN", label: "country.india" as const },
  { value: "BR", label: "country.brazil" as const },
  { value: "MX", label: "country.mexico" as const },
  { value: "AR", label: "country.argentina" as const },
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
  { value: "UTC", label: "timezone.utc" as const },
  {
    value: "America/New_York",
    label: "timezone.eastern" as const,
  },
  {
    value: "America/Chicago",
    label: "timezone.central" as const,
  },
  {
    value: "America/Denver",
    label: "timezone.mountain" as const,
  },
  {
    value: "America/Los_Angeles",
    label: "timezone.pacific" as const,
  },
  {
    value: "Europe/London",
    label: "timezone.london" as const,
  },
  {
    value: "Europe/Paris",
    label: "timezone.paris" as const,
  },
  {
    value: "Europe/Berlin",
    label: "timezone.berlin" as const,
  },
  {
    value: "Europe/Rome",
    label: "timezone.rome" as const,
  },
  {
    value: "Europe/Madrid",
    label: "timezone.madrid" as const,
  },
  {
    value: "Europe/Amsterdam",
    label: "timezone.amsterdam" as const,
  },
  {
    value: "Europe/Zurich",
    label: "timezone.zurich" as const,
  },
  {
    value: "Asia/Tokyo",
    label: "timezone.tokyo" as const,
  },
  {
    value: "Asia/Shanghai",
    label: "timezone.shanghai" as const,
  },
  {
    value: "Asia/Seoul",
    label: "timezone.seoul" as const,
  },
  {
    value: "Asia/Mumbai",
    label: "timezone.mumbai" as const,
  },
  {
    value: "Australia/Sydney",
    label: "timezone.sydney" as const,
  },
  {
    value: "Pacific/Auckland",
    label: "timezone.auckland" as const,
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
