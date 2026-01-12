// ----------------
// TYPES

import { allTranslations, languageConfig, languageDefaults } from "../../i18n";

// ----------------
export type Countries = keyof typeof languageConfig.countries;
export type Currencies = keyof typeof languageConfig.currencies;
export type Languages =
  (typeof languageConfig.languages)[keyof typeof languageConfig.languages];
export type CountryLanguage = `${Languages}-${Countries}`;

export type TranslationSchema = typeof languageDefaults.translations;

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
export const CountriesOptions = [
  {
    value: Countries.GLOBAL,
    label: "app.common.countries.global" as const,
  },
  { value: Countries.DE, label: "app.common.countries.de" as const },
  { value: Countries.PL, label: "app.common.countries.pl" as const },
  { value: Countries.US, label: "app.common.countries.us" as const },
];

/**
 * Languages Options for select fields
 * Maps language codes to translation keys for UI display
 */
export const LanguagesOptions = [
  {
    value: Languages.EN,
    label: "app.common.languages.en" as const,
  },
  { value: Languages.DE, label: "app.common.languages.de" as const },
  { value: Languages.PL, label: "app.common.languages.pl" as const },
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
export const translations = allTranslations;
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

export interface LanguageDefaults<TTranslationSchema> {
  country: string;
  currency: string;
  language: string;
  translations: TTranslationSchema;
}
