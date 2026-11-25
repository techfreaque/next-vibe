// ----------------
// TYPES

import { languageConfig, languageDefaults } from "..";
import { countryOptions } from "./regions";

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
  languages: readonly Languages[];
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
export const CountriesOptions = [...countryOptions];

/**
 * Languages Options for select fields
 * Maps language codes to translation keys for UI display
 */
export const LanguagesOptions = [
  { value: Languages.EN, label: "languages.en" as const },
  { value: Languages.DE, label: "languages.de" as const },
  { value: Languages.PL, label: "languages.pl" as const },
  { value: Languages.FR, label: "languages.fr" as const },
  { value: Languages.IT, label: "languages.it" as const },
  { value: Languages.ES, label: "languages.es" as const },
  { value: Languages.SK, label: "languages.sk" as const },
];

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
export const globalCountryInfo: CountryInfo = languageConfig.countryInfo.GLOBAL;
export const availableCountries: readonly CountryInfo[] = Object.values(
  languageConfig.countryInfo,
);
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
