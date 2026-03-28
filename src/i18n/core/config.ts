// ----------------
// TYPES

import type { configScopedTranslation } from "@/config/i18n";
import { languageConfig, languageDefaults } from "../../i18n";

type ConfigTranslationKey =
  (typeof configScopedTranslation)["ScopedTranslationKey"];

// ----------------
export type Countries = keyof typeof languageConfig.countries;
export type Currencies = keyof typeof languageConfig.currencies;
export type Languages =
  (typeof languageConfig.languages)[keyof typeof languageConfig.languages];
export type CountryLanguage = `${Languages}-${Countries}`;

export interface CountryInfo {
  code: Countries;
  name: string;
  language: Languages;
  langName: string;
  flag: string;
  currency: Currencies;
  symbol: string;
}

// Enum-like objects to replace the enums

export const Countries = languageConfig.countries;
export const CountriesArr = ["DE", "PL", "US", "GLOBAL"] as const;

export const Currencies = languageConfig.currencies;
export const CurrenciesArr = ["EUR", "USD", "PLN"] as const;

export const Languages = languageConfig.languages;
export const LanguagesArr = ["de", "pl", "en"] as const;

/**
 * Countries Options for select fields
 * Maps country codes to translation keys for UI display
 */
export const CountriesOptions: Array<{
  value: string;
  label: ConfigTranslationKey;
}> = [
  { value: Countries.GLOBAL, label: "countries.global" },
  { value: Countries.DE, label: "countries.de" },
  { value: Countries.PL, label: "countries.pl" },
  { value: Countries.US, label: "countries.us" },
];

/**
 * Languages Options for select fields
 * Maps language codes to translation keys for UI display
 */
export const LanguagesOptions: Array<{
  value: string;
  label: ConfigTranslationKey;
}> = [
  { value: Languages.EN, label: "languages.en" },
  { value: Languages.DE, label: "languages.de" },
  { value: Languages.PL, label: "languages.pl" },
];

/**
 * Country Filter Enum
 * Includes all countries plus an "all" option for filtering
 */
export enum CountryFilter {
  ALL = "all",
  DE = "DE",
  PL = "PL",
  US = "US",
  GLOBAL = "GLOBAL",
}

/**
 * Country Filter Options for select fields
 * Includes "all" option for filtering scenarios
 */
export const CountryFilterOptions = [
  {
    value: CountryFilter.ALL,
    label: "app.admin.leads.leads.admin.filters.countries.all" as const,
  },
  {
    value: CountryFilter.GLOBAL,
    label: "app.admin.leads.leads.admin.filters.countries.global" as const,
  },
  {
    value: CountryFilter.DE,
    label: "app.admin.leads.leads.admin.filters.countries.de" as const,
  },
  {
    value: CountryFilter.PL,
    label: "app.admin.leads.leads.admin.filters.countries.pl" as const,
  },
];

/**
 * Language Filter Enum
 * Includes common languages plus an "all" option for filtering
 */
export enum LanguageFilter {
  ALL = "all",
  EN = "en",
  DE = "de",
  PL = "pl",
}

/**
 * Language Filter Options for select fields
 * Includes "all" option for filtering scenarios
 */
export const LanguageFilterOptions = [
  {
    value: LanguageFilter.ALL,
    label: "app.admin.leads.leads.filter.all_languages" as const,
  },
  {
    value: LanguageFilter.EN,
    label: "app.admin.leads.leads.admin.filters.languages.en" as const,
  },
  {
    value: LanguageFilter.DE,
    label: "app.admin.leads.leads.admin.filters.languages.de" as const,
  },
  {
    value: LanguageFilter.PL,
    label: "app.admin.leads.leads.admin.filters.languages.pl" as const,
  },
];

/**
 * Convert country filter - handles CountryFilter and returns string or null
 */
export function convertCountryFilter(
  country: CountryFilter | Countries | undefined,
): Countries | null {
  if (!country || country === CountryFilter.ALL) {
    return null;
  }
  return country as Countries;
}

/**
 * Convert language filter - handles LanguageFilter and returns string or null
 */
export function convertLanguageFilter(
  language: LanguageFilter | Languages | undefined,
): Languages | null {
  if (!language || language === LanguageFilter.ALL) {
    return null;
  }
  return language as Languages;
}

// Create a proper enum-like object for CountryLanguageValues that works with z.enum()
export const CountryLanguageValues = Object.values(
  languageConfig.languages,
).reduce(
  (acc, language) => {
    Object.keys(languageConfig.countries).forEach((country) => {
      const key: CountryLanguage = `${language as Languages}-${String(country) as Countries}`;
      (acc as Record<string, CountryLanguage>)[key] = key;
    });
    return acc;
  },
  {} as { [K in CountryLanguage]: K },
);

// Other useful exports
export const currencyByCountry = languageConfig.mappings.currencyByCountry;
export const defaultLocaleConfig = languageDefaults;
export const defaultLocale: CountryLanguage = `${languageDefaults.language}-${languageDefaults.country}`;
export const globalCountryInfo: CountryInfo = languageConfig.countryInfo
  .GLOBAL as CountryInfo;
export const availableCountries: readonly CountryInfo[] = [
  languageConfig.countryInfo.DE as CountryInfo,
  languageConfig.countryInfo.PL as CountryInfo,
  languageConfig.countryInfo.US as CountryInfo,
  languageConfig.countryInfo.GLOBAL as CountryInfo,
];
export const availableLanguages = Object.values(languageConfig.languages);

export interface TranslationsConfig<TTranslationSchema> {
  [key: string]: TTranslationSchema;
}
export interface LanguageConfig {
  debug: boolean;
  countries: {
    [key: string]: string;
  };
  countriesArr: readonly string[];
  currencies: {
    [key: string]: string;
  };
  currenciesArr: readonly string[];
  languages: {
    [key: string]: string;
  };
  languagesArr: readonly string[];
  mappings: {
    currencyByCountry: {
      [key: string]: string;
    };
    languageByCountry: {
      [key: string]: string;
    };
  };

  countryInfo: {
    [key: string]: {
      code: string;
      name: string;
      language: string;
      langName: string;
      flag: string;
      currency: string;
      symbol: string;
    };
  };
}

export interface LanguageDefaults {
  country: string;
  currency: string;
  language: string;
}
