/**
 * Specialized Field Utilities
 *
 * Provides utilities for specialized field types like currencies, languages,
 * countries, and timezones using predefined data sources.
 */

import { z } from "zod";

import type { TranslationKey } from "@/i18n/core/static-types";

import { FieldDataType, WidgetType } from "../types/enums";
import { requestField } from "./utils-new";

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
] satisfies Array<{
  value: string;
  label: TranslationKey;
  symbol: string;
}>;

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
): ReturnType<typeof requestField> {
  const schema = multiple
    ? z.array(z.enum(CURRENCY_OPTIONS.map((c) => c.value)))
    : z.enum(CURRENCY_OPTIONS.map((c) => c.value));

  return requestField({
    type: WidgetType.FORM_FIELD,
    fieldType: multiple ? FieldDataType.MULTISELECT : FieldDataType.SELECT,
    label,
    description,
    placeholder,
    options: CURRENCY_OPTIONS,
    required,
    schema: required ? schema : schema.optional(),
  });
}

// ============================================================================
// LANGUAGE UTILITIES
// ============================================================================

/**
 * Common language codes with their names
 */
export const LANGUAGE_OPTIONS = [
  { value: "en", label: "app.language.english" as const },
  { value: "de", label: "app.language.german" as const },
  { value: "fr", label: "app.language.french" as const },
  { value: "es", label: "app.language.spanish" as const },
  { value: "it", label: "app.language.italian" as const },
  { value: "pt", label: "app.language.portuguese" as const },
  { value: "nl", label: "app.language.dutch" as const },
  { value: "ru", label: "app.language.russian" as const },
  { value: "zh", label: "app.language.chinese" as const },
  { value: "ja", label: "app.language.japanese" as const },
  { value: "ko", label: "app.language.korean" as const },
  { value: "ar", label: "app.language.arabic" as const },
  { value: "hi", label: "app.language.hindi" as const },
] as const satisfies Array<{ value: string; label: TranslationKey }>;

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
): ReturnType<typeof requestField> {
  const schema = multiple
    ? z.array(z.enum(LANGUAGE_OPTIONS.map((l) => l.value)))
    : z.enum(LANGUAGE_OPTIONS.map((l) => l.value));

  return requestField({
    type: WidgetType.FORM_FIELD,
    fieldType: multiple ? FieldDataType.MULTISELECT : FieldDataType.SELECT,
    label,
    description,
    placeholder,
    options: [...LANGUAGE_OPTIONS],
    required,
    schema: required ? schema : schema.optional(),
  });
}

// ============================================================================
// COUNTRY UTILITIES
// ============================================================================

/**
 * Common country codes with their names
 */
export const COUNTRY_OPTIONS = [
  { value: "US", label: "app.country.united_states" as const },
  { value: "CA", label: "app.country.canada" as const },
  {
    value: "GB",
    label: "app.country.united_kingdom" as const,
  },
  { value: "DE", label: "app.country.germany" as const },
  { value: "FR", label: "app.country.france" as const },
  { value: "IT", label: "app.country.italy" as const },
  { value: "ES", label: "app.country.spain" as const },
  { value: "NL", label: "app.country.netherlands" as const },
  { value: "CH", label: "app.country.switzerland" as const },
  { value: "AT", label: "app.country.austria" as const },
  { value: "BE", label: "app.country.belgium" as const },
  { value: "SE", label: "app.country.sweden" as const },
  { value: "NO", label: "app.country.norway" as const },
  { value: "DK", label: "app.country.denmark" as const },
  { value: "FI", label: "app.country.finland" as const },
  { value: "AU", label: "app.country.australia" as const },
  { value: "NZ", label: "app.country.new_zealand" as const },
  { value: "JP", label: "app.country.japan" as const },
  { value: "KR", label: "app.country.south_korea" as const },
  { value: "CN", label: "app.country.china" as const },
  { value: "IN", label: "app.country.india" as const },
  { value: "BR", label: "app.country.brazil" as const },
  { value: "MX", label: "app.country.mexico" as const },
  { value: "AR", label: "app.country.argentina" as const },
] as const satisfies Array<{ value: string; label: TranslationKey }>;

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
): ReturnType<typeof requestField> {
  const schema = multiple
    ? z.array(z.enum(COUNTRY_OPTIONS.map((c) => c.value)))
    : z.enum(COUNTRY_OPTIONS.map((c) => c.value));

  return requestField({
    type: WidgetType.FORM_FIELD,
    fieldType: multiple ? FieldDataType.MULTISELECT : FieldDataType.SELECT,
    label,
    description,
    placeholder,
    options: [...COUNTRY_OPTIONS],
    required,
    schema: required ? schema : schema.optional(),
  });
}

// ============================================================================
// TIMEZONE UTILITIES
// ============================================================================

/**
 * Common timezone identifiers
 */
export const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "app.timezone.utc" as const },
  {
    value: "America/New_York",
    label: "app.timezone.eastern" as const,
  },
  {
    value: "America/Chicago",
    label: "app.timezone.central" as const,
  },
  {
    value: "America/Denver",
    label: "app.timezone.mountain" as const,
  },
  {
    value: "America/Los_Angeles",
    label: "app.timezone.pacific" as const,
  },
  {
    value: "Europe/London",
    label: "app.timezone.london" as const,
  },
  {
    value: "Europe/Paris",
    label: "app.timezone.paris" as const,
  },
  {
    value: "Europe/Berlin",
    label: "app.timezone.berlin" as const,
  },
  {
    value: "Europe/Rome",
    label: "app.timezone.rome" as const,
  },
  {
    value: "Europe/Madrid",
    label: "app.timezone.madrid" as const,
  },
  {
    value: "Europe/Amsterdam",
    label: "app.timezone.amsterdam" as const,
  },
  {
    value: "Europe/Zurich",
    label: "app.timezone.zurich" as const,
  },
  {
    value: "Asia/Tokyo",
    label: "app.timezone.tokyo" as const,
  },
  {
    value: "Asia/Shanghai",
    label: "app.timezone.shanghai" as const,
  },
  {
    value: "Asia/Seoul",
    label: "app.timezone.seoul" as const,
  },
  {
    value: "Asia/Mumbai",
    label: "app.timezone.mumbai" as const,
  },
  {
    value: "Australia/Sydney",
    label: "app.timezone.sydney" as const,
  },
  {
    value: "Pacific/Auckland",
    label: "app.timezone.auckland" as const,
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
): ReturnType<typeof requestField> {
  const schema = multiple
    ? z.array(z.enum(TIMEZONE_OPTIONS.map((t) => t.value)))
    : z.enum(TIMEZONE_OPTIONS.map((t) => t.value));

  return requestField({
    type: WidgetType.FORM_FIELD,
    fieldType: multiple ? FieldDataType.MULTISELECT : FieldDataType.SELECT,
    label,
    description,
    placeholder,
    options: [...TIMEZONE_OPTIONS],
    required,
    schema: required ? schema : schema.optional(),
  });
}
