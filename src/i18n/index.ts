import type { LanguageConfig, LanguageDefaults } from "./core/config";

// ----------------
// CONFIGURATION
// ----------------
export const languageDefaults = {
  country: "GLOBAL" as const,
  currency: "USD",
  language: "en" as const,
} satisfies LanguageDefaults;

export const languageConfig = {
  debug: false as boolean,
  countries: {
    DE: "DE" as const,
    PL: "PL" as const,
    US: "US" as const,
    GLOBAL: "GLOBAL" as const,
  },
  countriesArr: ["DE", "PL", "US", "GLOBAL"] as const,

  currencies: {
    EUR: "EUR" as const,
    USD: "USD" as const,
    PLN: "PLN" as const,
  },
  currenciesArr: ["EUR", "USD", "PLN"] as const,

  languages: {
    DE: "de" as const,
    PL: "pl" as const,
    EN: "en" as const,
  },
  languagesArr: ["de", "pl", "en"] as const,

  mappings: {
    currencyByCountry: {
      DE: "EUR" as const,
      PL: "PLN" as const,
      US: "USD" as const,
      GLOBAL: "USD" as const,
    },

    languageByCountry: {
      DE: "de",
      PL: "pl",
      US: "en",
      GLOBAL: "en",
    },
  },

  countryInfo: {
    DE: {
      code: "DE",
      name: "Deutschland",
      language: "de",
      langName: "Deutsch",
      flag: "🇩🇪",
      currency: "EUR",
      symbol: "€",
    },
    PL: {
      code: "PL",
      name: "Polska",
      language: "pl",
      langName: "Polski",
      flag: "🇵🇱",
      currency: "PLN",
      symbol: "zł",
    },
    US: {
      code: "US",
      name: "United States",
      language: "en",
      langName: "English",
      flag: "🇺🇸",
      currency: "USD",
      symbol: "$",
    },
    GLOBAL: {
      code: "GLOBAL",
      name: "Global",
      language: "en",
      langName: "English",
      flag: "🌐",
      currency: "USD",
      symbol: "$",
    },
  },
} satisfies LanguageConfig;
