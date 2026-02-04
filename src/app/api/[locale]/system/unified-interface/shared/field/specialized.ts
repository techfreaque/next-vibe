/**
 * Specialized Field Utilities
 *
 * Provides utilities for specialized field types like currencies, languages,
 * countries, and timezones using predefined data sources.
 */

import { z } from "zod";

import type { MultiSelectFieldWidgetConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/multiselect-field/types";
import type { SelectFieldWidgetConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/types";
import type { TranslationKey } from "@/i18n/core/static-types";

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
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required: true,
  multiple: true,
): MultiSelectFieldWidgetConfig<
  TranslationKey,
  CurrencyMultiSelectSchemaRequired,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 2: multiple=true, required=false
export function currencyField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required: false,
  multiple: true,
): MultiSelectFieldWidgetConfig<
  TranslationKey,
  CurrencyMultiSelectSchemaOptional,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 3: multiple=false, required=true
export function currencyField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required: true,
  multiple?: false,
): SelectFieldWidgetConfig<
  TranslationKey,
  CurrencySelectSchemaRequired,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 4: multiple=false, required=false (DEFAULT)
export function currencyField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required?: false,
  multiple?: false,
): SelectFieldWidgetConfig<
  TranslationKey,
  CurrencySelectSchemaOptional,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Implementation
export function currencyField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required?: boolean,
  multiple?: boolean,
):
  | (MultiSelectFieldWidgetConfig<
      TranslationKey,
      CurrencyMultiSelectSchemaRequired | CurrencyMultiSelectSchemaOptional,
      { request: "data"; response?: never }
    > & {
      usage: { request: "data"; response?: never };
      schemaType: "primitive";
    })
  | (SelectFieldWidgetConfig<
      TranslationKey,
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
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required: true,
  multiple: true,
): MultiSelectFieldWidgetConfig<
  TranslationKey,
  LanguageMultiSelectSchemaRequired,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 2: multiple=true, required=false
export function languageField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required: false,
  multiple: true,
): MultiSelectFieldWidgetConfig<
  TranslationKey,
  LanguageMultiSelectSchemaOptional,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 3: multiple=false, required=true
export function languageField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required: true,
  multiple?: false,
): SelectFieldWidgetConfig<
  TranslationKey,
  LanguageSelectSchemaRequired,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 4: multiple=false, required=false (DEFAULT)
export function languageField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required?: false,
  multiple?: false,
): SelectFieldWidgetConfig<
  TranslationKey,
  LanguageSelectSchemaOptional,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Implementation
export function languageField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required?: boolean,
  multiple?: boolean,
):
  | (MultiSelectFieldWidgetConfig<
      TranslationKey,
      LanguageMultiSelectSchemaRequired | LanguageMultiSelectSchemaOptional,
      { request: "data"; response?: never }
    > & {
      usage: { request: "data"; response?: never };
      schemaType: "primitive";
    })
  | (SelectFieldWidgetConfig<
      TranslationKey,
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
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required: true,
  multiple: true,
): MultiSelectFieldWidgetConfig<
  TranslationKey,
  CountryMultiSelectSchemaRequired,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 2: multiple=true, required=false
export function countryField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required: false,
  multiple: true,
): MultiSelectFieldWidgetConfig<
  TranslationKey,
  CountryMultiSelectSchemaOptional,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 3: multiple=false, required=true
export function countryField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required: true,
  multiple?: false,
): SelectFieldWidgetConfig<
  TranslationKey,
  CountrySelectSchemaRequired,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 4: multiple=false, required=false (DEFAULT)
export function countryField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required?: false,
  multiple?: false,
): SelectFieldWidgetConfig<
  TranslationKey,
  CountrySelectSchemaOptional,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Implementation
export function countryField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required?: boolean,
  multiple?: boolean,
):
  | (MultiSelectFieldWidgetConfig<
      TranslationKey,
      CountryMultiSelectSchemaRequired | CountryMultiSelectSchemaOptional,
      { request: "data"; response?: never }
    > & {
      usage: { request: "data"; response?: never };
      schemaType: "primitive";
    })
  | (SelectFieldWidgetConfig<
      TranslationKey,
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
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required: true,
  multiple: true,
): MultiSelectFieldWidgetConfig<
  TranslationKey,
  TimezoneMultiSelectSchemaRequired,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 2: multiple=true, required=false
export function timezoneField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required: false,
  multiple: true,
): MultiSelectFieldWidgetConfig<
  TranslationKey,
  TimezoneMultiSelectSchemaOptional,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 3: multiple=false, required=true
export function timezoneField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required: true,
  multiple?: false,
): SelectFieldWidgetConfig<
  TranslationKey,
  TimezoneSelectSchemaRequired,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Overload 4: multiple=false, required=false (DEFAULT)
export function timezoneField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required?: false,
  multiple?: false,
): SelectFieldWidgetConfig<
  TranslationKey,
  TimezoneSelectSchemaOptional,
  { request: "data"; response?: never }
> & { usage: { request: "data"; response?: never }; schemaType: "primitive" };

// Implementation
export function timezoneField(
  label: TranslationKey,
  description: TranslationKey,
  placeholder: TranslationKey,
  required?: boolean,
  multiple?: boolean,
):
  | (MultiSelectFieldWidgetConfig<
      TranslationKey,
      TimezoneMultiSelectSchemaRequired | TimezoneMultiSelectSchemaOptional,
      { request: "data"; response?: never }
    > & {
      usage: { request: "data"; response?: never };
      schemaType: "primitive";
    })
  | (SelectFieldWidgetConfig<
      TranslationKey,
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
