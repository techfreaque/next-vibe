import type { Countries, CountryLanguage, Languages } from "./config";

// ================================================================================
// TRANSLATION UTILITIES
// ================================================================================

export function getCountryFromLocale(locale: CountryLanguage): Countries {
  return locale.split("-")[1] as Countries;
}

export function getLanguageFromLocale(locale: CountryLanguage): Languages {
  return locale.split("-")[0] as Languages;
}
