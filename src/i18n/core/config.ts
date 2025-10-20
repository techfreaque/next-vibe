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
export const CountriesArr = languageConfig.countriesArr;
export const Currencies = languageConfig.currencies;
export const CurrenciesArr = languageConfig.currenciesArr;
export const Languages = languageConfig.languages;
export const LanguagesArr = languageConfig.languagesArr;

/**
 * Countries Options for select fields
 * Maps country codes to translation keys for UI display
 */
export const CountriesOptions = Object.keys(languageConfig.countries).map(
  (key) => ({
    value: key,
    label: `i18n.countries.${key.toLowerCase()}` as const,
  }),
);

/**
 * Languages Options for select fields
 * Maps language codes to translation keys for UI display
 */
export const LanguagesOptions = Object.keys(languageConfig.languages).map(
  (key) => ({
    value: key,
    label:
      `i18n.languages.${languageConfig.languages[key as keyof typeof languageConfig.languages].toLowerCase()}` as const,
  }),
);

/**
 * Country Filter Enum
 * Includes all countries plus an "all" option for filtering
 */
export enum CountryFilter {
  ALL = "all",
  DE = "DE",
  PL = "PL",
  GLOBAL = "GLOBAL",
}

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
 * Convert country filter - handles CountryFilter and returns string or null
 */
export function convertCountryFilter(
  country: CountryFilter | undefined,
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
  language: LanguageFilter | undefined,
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
export const globalCountryInfo = languageConfig.countryInfo.GLOBAL;
export const availableCountries = Object.values(languageConfig.countryInfo);
export const availableLanguages = Object.values(languageConfig.languages);

export interface TranslationsConfig<TTranslationSchema> {
  [key: string]: TTranslationSchema;
}
export interface LanguageConfig {
  debug: boolean;
  countries: {
    [key: string]: string;
  };
  countriesArr: string[];
  currencies: {
    [key: string]: string;
  };
  currenciesArr: string[];
  languages: {
    [key: string]: string;
  };
  languagesArr: string[];
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
