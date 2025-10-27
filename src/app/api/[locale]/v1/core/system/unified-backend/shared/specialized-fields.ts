/**
 * Specialized Field Utilities
 *
 * Provides utilities for specialized field types like currencies, languages,
 * countries, and timezones using predefined data sources.
 */

import { z } from "zod";

import type { TranslationKey } from "@/i18n/core/static-types";

import { FieldDataType, WidgetType } from "./enums";
import { requestDataField } from "./field-utils";

// ============================================================================
// CURRENCY UTILITIES
// ============================================================================

/**
 * Common currency codes with their symbols
 */
export const CURRENCY_OPTIONS = [
  {
    value: "USD",
    label: "currency.usd",
    symbol: "$",
  },
  {
    value: "EUR",
    label: "currency.eur",
    symbol: "€",
  },
  {
    value: "GBP",
    label: "currency.gbp",
    symbol: "£",
  },
  {
    value: "JPY",
    label: "currency.jpy",
    symbol: "¥",
  },
  {
    value: "CHF",
    label: "currency.chf",
    symbol: "CHF",
  },
  {
    value: "CAD",
    label: "currency.cad",
    symbol: "C$",
  },
  {
    value: "AUD",
    label: "currency.aud",
    symbol: "A$",
  },
  {
    value: "CNY",
    label: "currency.cny",
    symbol: "¥",
  },
  {
    value: "INR",
    label: "currency.inr",
    symbol: "₹",
  },
  {
    value: "BRL",
    label: "currency.brl",
    symbol: "R$",
  },
] as const;

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
      options: CURRENCY_OPTIONS,
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
  { value: "en", label: "language.english" },
  { value: "de", label: "language.german" },
  { value: "fr", label: "language.french" },
  { value: "es", label: "language.spanish" },
  { value: "it", label: "language.italian" },
  { value: "pt", label: "language.portuguese" },
  { value: "nl", label: "language.dutch" },
  { value: "ru", label: "language.russian" },
  { value: "zh", label: "language.chinese" },
  { value: "ja", label: "language.japanese" },
  { value: "ko", label: "language.korean" },
  { value: "ar", label: "language.arabic" },
  { value: "hi", label: "language.hindi" },
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
      options: LANGUAGE_OPTIONS,
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
  { value: "US", label: "country.united_states" },
  { value: "CA", label: "country.canada" },
  {
    value: "GB",
    label: "country.united_kingdom",
  },
  { value: "DE", label: "country.germany" },
  { value: "FR", label: "country.france" },
  { value: "IT", label: "country.italy" },
  { value: "ES", label: "country.spain" },
  { value: "NL", label: "country.netherlands" },
  { value: "CH", label: "country.switzerland" },
  { value: "AT", label: "country.austria" },
  { value: "BE", label: "country.belgium" },
  { value: "SE", label: "country.sweden" },
  { value: "NO", label: "country.norway" },
  { value: "DK", label: "country.denmark" },
  { value: "FI", label: "country.finland" },
  { value: "AU", label: "country.australia" },
  { value: "NZ", label: "country.new_zealand" },
  { value: "JP", label: "country.japan" },
  { value: "KR", label: "country.south_korea" },
  { value: "CN", label: "country.china" },
  { value: "IN", label: "country.india" },
  { value: "BR", label: "country.brazil" },
  { value: "MX", label: "country.mexico" },
  { value: "AR", label: "country.argentina" },
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
      options: COUNTRY_OPTIONS,
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
  { value: "UTC", label: "timezone.utc" },
  {
    value: "America/New_York",
    label: "timezone.eastern",
  },
  {
    value: "America/Chicago",
    label: "timezone.central",
  },
  {
    value: "America/Denver",
    label: "timezone.mountain",
  },
  {
    value: "America/Los_Angeles",
    label: "timezone.pacific",
  },
  {
    value: "Europe/London",
    label: "timezone.london",
  },
  {
    value: "Europe/Paris",
    label: "timezone.paris",
  },
  {
    value: "Europe/Berlin",
    label: "timezone.berlin",
  },
  {
    value: "Europe/Rome",
    label: "timezone.rome",
  },
  {
    value: "Europe/Madrid",
    label: "timezone.madrid",
  },
  {
    value: "Europe/Amsterdam",
    label: "timezone.amsterdam",
  },
  {
    value: "Europe/Zurich",
    label: "timezone.zurich",
  },
  {
    value: "Asia/Tokyo",
    label: "timezone.tokyo",
  },
  {
    value: "Asia/Shanghai",
    label: "timezone.shanghai",
  },
  {
    value: "Asia/Seoul",
    label: "timezone.seoul",
  },
  {
    value: "Asia/Mumbai",
    label: "timezone.mumbai",
  },
  {
    value: "Australia/Sydney",
    label: "timezone.sydney",
  },
  {
    value: "Pacific/Auckland",
    label: "timezone.auckland",
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
      options: TIMEZONE_OPTIONS,
      required,
    },
    required ? schema : schema.optional(),
  );
}
