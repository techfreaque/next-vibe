/**
 * Specialized Field Utilities
 *
 * Provides utilities for specialized field types like currencies, languages,
 * countries, and timezones using predefined data sources.
 */

import { z } from "zod";

import type { AppLocaleTranslationKey } from "@/app/[locale]/i18n";
import type { MultiSelectFieldWidgetConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/multiselect-field/types";
import type { SelectFieldWidgetConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/types";

import { FieldDataType, WidgetType } from "../types/enums";

// ============================================================================
// CURRENCY UTILITIES
// ============================================================================

/**
 * Common currency codes with their symbols
 */
export const CURRENCY_OPTIONS = [
  {
    value: "USD",
    label: "currency.usd" as const,
    symbol: "$",
  },
  {
    value: "EUR",
    label: "currency.eur" as const,
    symbol: "€",
  },
  {
    value: "GBP",
    label: "currency.gbp" as const,
    symbol: "£",
  },
  {
    value: "JPY",
    label: "currency.jpy" as const,
    symbol: "¥",
  },
  {
    value: "CHF",
    label: "currency.chf" as const,
    symbol: "CHF",
  },
  {
    value: "CAD",
    label: "currency.cad" as const,
    symbol: "C$",
  },
  {
    value: "AUD",
    label: "currency.aud" as const,
    symbol: "A$",
  },
  {
    value: "CNY",
    label: "currency.cny" as const,
    symbol: "¥",
  },
  {
    value: "INR",
    label: "currency.inr" as const,
    symbol: "₹",
  },
  {
    value: "BRL",
    label: "currency.brl" as const,
    symbol: "R$",
  },
] satisfies Array<{
  value: string;
  label: AppLocaleTranslationKey;
  symbol: string;
}>;

export type CurrencyCode = (typeof CURRENCY_OPTIONS)[number]["value"];

const CURRENCY_VALUES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CHF",
  "CAD",
  "AUD",
  "CNY",
  "INR",
  "BRL",
] as const;

const currencyEnumSchema = z.enum(CURRENCY_VALUES);
const currencyArraySchema = z.array(currencyEnumSchema);

type CurrencySelectSchemaRequired = typeof currencyEnumSchema;
type CurrencySelectSchemaOptional = z.ZodOptional<typeof currencyEnumSchema>;
type CurrencyMultiSelectSchemaRequired = typeof currencyArraySchema;
type CurrencyMultiSelectSchemaOptional = z.ZodOptional<
  typeof currencyArraySchema
>;

// Overload 1: multiple=true, required=true
export function currencyField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required: true,
  multiple: true,
): MultiSelectFieldWidgetConfig<
  AppLocaleTranslationKey,
  CurrencyMultiSelectSchemaRequired,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 2: multiple=true, required=false
export function currencyField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required: false,
  multiple: true,
): MultiSelectFieldWidgetConfig<
  AppLocaleTranslationKey,
  CurrencyMultiSelectSchemaOptional,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 3: multiple=false, required=true
export function currencyField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required: true,
  multiple?: false,
): SelectFieldWidgetConfig<
  AppLocaleTranslationKey,
  CurrencySelectSchemaRequired,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 4: multiple=false, required=false (DEFAULT)
export function currencyField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required?: false,
  multiple?: false,
): SelectFieldWidgetConfig<
  AppLocaleTranslationKey,
  CurrencySelectSchemaOptional,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Implementation
export function currencyField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required?: boolean,
  multiple?: boolean,
):
  | (MultiSelectFieldWidgetConfig<
      AppLocaleTranslationKey,
      CurrencyMultiSelectSchemaRequired | CurrencyMultiSelectSchemaOptional,
      { request: "data"; response?: never }
    > & {
      usage: { request: "data"; response?: never };
      schemaType: "primitive";
    })
  | (SelectFieldWidgetConfig<
      AppLocaleTranslationKey,
      CurrencySelectSchemaRequired | CurrencySelectSchemaOptional,
      { request: "data"; response?: never }
    > & {
      usage: { request: "data"; response?: never };
      schemaType: "primitive";
    }) {
  if (multiple) {
    const schema = required
      ? currencyArraySchema
      : currencyArraySchema.optional();
    return {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.MULTISELECT,
      label,
      description,
      placeholder,
      options: CURRENCY_OPTIONS.map((opt) => ({
        value: opt.value,
        label: opt.label,
      })),
      required,
      schema,
      usage: { request: "data" as const },
      schemaType: "primitive" as const,
    };
  }

  const schema = required ? currencyEnumSchema : currencyEnumSchema.optional();
  return {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label,
    description,
    placeholder,
    options: CURRENCY_OPTIONS.map((opt) => ({
      value: opt.value,
      label: opt.label,
    })),
    required,
    schema,
    usage: { request: "data" as const },
    schemaType: "primitive" as const,
  };
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
] as const satisfies Array<{ value: string; label: AppLocaleTranslationKey }>;

export type LanguageCode = (typeof LANGUAGE_OPTIONS)[number]["value"];

const LANGUAGE_VALUES = [
  "en",
  "de",
  "fr",
  "es",
  "it",
  "pt",
  "nl",
  "ru",
  "zh",
  "ja",
  "ko",
  "ar",
  "hi",
] as const;

const languageEnumSchema = z.enum(LANGUAGE_VALUES);
const languageArraySchema = z.array(languageEnumSchema);

type LanguageSelectSchemaRequired = typeof languageEnumSchema;
type LanguageSelectSchemaOptional = z.ZodOptional<typeof languageEnumSchema>;
type LanguageMultiSelectSchemaRequired = typeof languageArraySchema;
type LanguageMultiSelectSchemaOptional = z.ZodOptional<
  typeof languageArraySchema
>;

// Overload 1: multiple=true, required=true
export function languageField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required: true,
  multiple: true,
): MultiSelectFieldWidgetConfig<
  AppLocaleTranslationKey,
  LanguageMultiSelectSchemaRequired,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 2: multiple=true, required=false
export function languageField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required: false,
  multiple: true,
): MultiSelectFieldWidgetConfig<
  AppLocaleTranslationKey,
  LanguageMultiSelectSchemaOptional,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 3: multiple=false, required=true
export function languageField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required: true,
  multiple?: false,
): SelectFieldWidgetConfig<
  AppLocaleTranslationKey,
  LanguageSelectSchemaRequired,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 4: multiple=false, required=false (DEFAULT)
export function languageField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required?: false,
  multiple?: false,
): SelectFieldWidgetConfig<
  AppLocaleTranslationKey,
  LanguageSelectSchemaOptional,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Implementation
export function languageField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required?: boolean,
  multiple?: boolean,
):
  | (MultiSelectFieldWidgetConfig<
      AppLocaleTranslationKey,
      LanguageMultiSelectSchemaRequired | LanguageMultiSelectSchemaOptional,
      { request: "data"; response?: never }
    > & {
      usage: { request: "data"; response?: never };
      schemaType: "primitive";
    })
  | (SelectFieldWidgetConfig<
      AppLocaleTranslationKey,
      LanguageSelectSchemaRequired | LanguageSelectSchemaOptional,
      { request: "data"; response?: never }
    > & {
      usage: { request: "data"; response?: never };
      schemaType: "primitive";
    }) {
  if (multiple) {
    const schema = required
      ? languageArraySchema
      : languageArraySchema.optional();
    return {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.MULTISELECT,
      label,
      description,
      placeholder,
      options: LANGUAGE_OPTIONS.map((opt) => ({
        value: opt.value,
        label: opt.label,
      })),
      required,
      schema,
      usage: { request: "data" as const },
      schemaType: "primitive" as const,
    };
  }

  const schema = required ? languageEnumSchema : languageEnumSchema.optional();
  return {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label,
    description,
    placeholder,
    options: LANGUAGE_OPTIONS.map((opt) => ({
      value: opt.value,
      label: opt.label,
    })),
    required,
    schema,
    usage: { request: "data" as const },
    schemaType: "primitive" as const,
  };
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
] as const satisfies Array<{ value: string; label: AppLocaleTranslationKey }>;

export type CountryCode = (typeof COUNTRY_OPTIONS)[number]["value"];

const COUNTRY_VALUES = [
  "US",
  "CA",
  "GB",
  "DE",
  "FR",
  "IT",
  "ES",
  "NL",
  "CH",
  "AT",
  "BE",
  "SE",
  "NO",
  "DK",
  "FI",
  "AU",
  "NZ",
  "JP",
  "KR",
  "CN",
  "IN",
  "BR",
  "MX",
  "AR",
] as const;

const countryEnumSchema = z.enum(COUNTRY_VALUES);
const countryArraySchema = z.array(countryEnumSchema);

type CountrySelectSchemaRequired = typeof countryEnumSchema;
type CountrySelectSchemaOptional = z.ZodOptional<typeof countryEnumSchema>;
type CountryMultiSelectSchemaRequired = typeof countryArraySchema;
type CountryMultiSelectSchemaOptional = z.ZodOptional<
  typeof countryArraySchema
>;

// Overload 1: multiple=true, required=true
export function countryField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required: true,
  multiple: true,
): MultiSelectFieldWidgetConfig<
  AppLocaleTranslationKey,
  CountryMultiSelectSchemaRequired,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 2: multiple=true, required=false
export function countryField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required: false,
  multiple: true,
): MultiSelectFieldWidgetConfig<
  AppLocaleTranslationKey,
  CountryMultiSelectSchemaOptional,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 3: multiple=false, required=true
export function countryField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required: true,
  multiple?: false,
): SelectFieldWidgetConfig<
  AppLocaleTranslationKey,
  CountrySelectSchemaRequired,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 4: multiple=false, required=false (DEFAULT)
export function countryField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required?: false,
  multiple?: false,
): SelectFieldWidgetConfig<
  AppLocaleTranslationKey,
  CountrySelectSchemaOptional,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Implementation
export function countryField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required?: boolean,
  multiple?: boolean,
):
  | (MultiSelectFieldWidgetConfig<
      AppLocaleTranslationKey,
      CountryMultiSelectSchemaRequired | CountryMultiSelectSchemaOptional,
      { request: "data"; response?: never }
    > & {
      usage: { request: "data"; response?: never };
      schemaType: "primitive";
    })
  | (SelectFieldWidgetConfig<
      AppLocaleTranslationKey,
      CountrySelectSchemaRequired | CountrySelectSchemaOptional,
      { request: "data"; response?: never }
    > & {
      usage: { request: "data"; response?: never };
      schemaType: "primitive";
    }) {
  if (multiple) {
    const schema = required
      ? countryArraySchema
      : countryArraySchema.optional();
    return {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.MULTISELECT,
      label,
      description,
      placeholder,
      options: COUNTRY_OPTIONS.map((opt) => ({
        value: opt.value,
        label: opt.label,
      })),
      required,
      schema,
      usage: { request: "data" as const },
      schemaType: "primitive" as const,
    };
  }

  const schema = required ? countryEnumSchema : countryEnumSchema.optional();
  return {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label,
    description,
    placeholder,
    options: COUNTRY_OPTIONS.map((opt) => ({
      value: opt.value,
      label: opt.label,
    })),
    required,
    schema,
    usage: { request: "data" as const },
    schemaType: "primitive" as const,
  };
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

const TIMEZONE_VALUES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Madrid",
  "Europe/Amsterdam",
  "Europe/Zurich",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Seoul",
  "Asia/Mumbai",
  "Australia/Sydney",
  "Pacific/Auckland",
] as const;

const timezoneEnumSchema = z.enum(TIMEZONE_VALUES);
const timezoneArraySchema = z.array(timezoneEnumSchema);

type TimezoneSelectSchemaRequired = typeof timezoneEnumSchema;
type TimezoneSelectSchemaOptional = z.ZodOptional<typeof timezoneEnumSchema>;
type TimezoneMultiSelectSchemaRequired = typeof timezoneArraySchema;
type TimezoneMultiSelectSchemaOptional = z.ZodOptional<
  typeof timezoneArraySchema
>;

// Overload 1: multiple=true, required=true
export function timezoneField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required: true,
  multiple: true,
): MultiSelectFieldWidgetConfig<
  AppLocaleTranslationKey,
  TimezoneMultiSelectSchemaRequired,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 2: multiple=true, required=false
export function timezoneField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required: false,
  multiple: true,
): MultiSelectFieldWidgetConfig<
  AppLocaleTranslationKey,
  TimezoneMultiSelectSchemaOptional,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 3: multiple=false, required=true
export function timezoneField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required: true,
  multiple?: false,
): SelectFieldWidgetConfig<
  AppLocaleTranslationKey,
  TimezoneSelectSchemaRequired,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 4: multiple=false, required=false (DEFAULT)
export function timezoneField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required?: false,
  multiple?: false,
): SelectFieldWidgetConfig<
  AppLocaleTranslationKey,
  TimezoneSelectSchemaOptional,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Implementation
export function timezoneField(
  label: AppLocaleTranslationKey,
  description: AppLocaleTranslationKey,
  placeholder: AppLocaleTranslationKey,
  required?: boolean,
  multiple?: boolean,
):
  | (MultiSelectFieldWidgetConfig<
      AppLocaleTranslationKey,
      TimezoneMultiSelectSchemaRequired | TimezoneMultiSelectSchemaOptional,
      { request: "data"; response?: never }
    > & {
      usage: { request: "data"; response?: never };
      schemaType: "primitive";
    })
  | (SelectFieldWidgetConfig<
      AppLocaleTranslationKey,
      TimezoneSelectSchemaRequired | TimezoneSelectSchemaOptional,
      { request: "data"; response?: never }
    > & {
      usage: { request: "data"; response?: never };
      schemaType: "primitive";
    }) {
  if (multiple) {
    const schema = required
      ? timezoneArraySchema
      : timezoneArraySchema.optional();
    return {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.MULTISELECT,
      label,
      description,
      placeholder,
      options: TIMEZONE_OPTIONS.map((opt) => ({
        value: opt.value,
        label: opt.label,
      })),
      required,
      schema,
      usage: { request: "data" as const },
      schemaType: "primitive" as const,
    };
  }

  const schema = required ? timezoneEnumSchema : timezoneEnumSchema.optional();
  return {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label,
    description,
    placeholder,
    options: TIMEZONE_OPTIONS.map((opt) => ({
      value: opt.value,
      label: opt.label,
    })),
    required,
    schema,
    usage: { request: "data" as const },
    schemaType: "primitive" as const,
  };
}
