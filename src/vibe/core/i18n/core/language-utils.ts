import type {
  Countries,
  CountryInfo,
  CountryLanguage,
  Languages,
} from "./config";
import { availableCountries } from "./config";

// ================================================================================
// TYPES
// ================================================================================

/**
 * Type-safe mapping of language codes to their information
 */
type LanguageGroupMap = {
  [langCode in Languages]: {
    name: string;
    countries: CountryInfo[];
  };
};

// ================================================================================
// LANGUAGE MAPPING SINGLETON
// ================================================================================

/**
 * Singleton class for efficient language mapping operations
 */
function groupCountries(language: Languages): {
  name: string;
  countries: CountryInfo[];
} {
  const countries = availableCountries.filter((country) =>
    country.languages.includes(language),
  );
  const primary = availableCountries.find(
    (country) => country.language === language,
  );
  return {
    name: primary?.langName ?? language,
    countries: primary
      ? [primary, ...countries.filter((country) => country !== primary)]
      : countries,
  };
}

let instance: LanguageMapper | null = null;
class LanguageMapper {
  private _uniqueLanguages:
    | [
        langCode: Languages,
        langInfo: { name: string; countries: CountryInfo[] },
      ][]
    | null = null;
  private _languageGroupMap: LanguageGroupMap | null = null;

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get the singleton instance
   */
  static getInstance(): LanguageMapper {
    if (!instance) {
      instance = new LanguageMapper();
    }
    return instance;
  }

  /**
   * Get the language group map (computed once and cached)
   */
  private getLanguageGroupMap(): LanguageGroupMap {
    if (this._languageGroupMap === null) {
      this._languageGroupMap = {
        de: groupCountries("de"),
        en: groupCountries("en"),
        pl: groupCountries("pl"),
        fr: groupCountries("fr"),
        it: groupCountries("it"),
        es: groupCountries("es"),
        sk: groupCountries("sk"),
      };
    }
    return this._languageGroupMap;
  }

  /**
   * Get unique languages with their associated countries (computed once and cached)
   */
  getUniqueLanguages(): [
    langCode: Languages,
    langInfo: { name: string; countries: CountryInfo[] },
  ][] {
    if (this._uniqueLanguages === null) {
      const languageGroupMap = this.getLanguageGroupMap();
      this._uniqueLanguages = Object.entries(languageGroupMap) as [
        Languages,
        { name: string; countries: CountryInfo[] },
      ][];
    }
    return this._uniqueLanguages;
  }

  /**
   * Get countries for a specific language
   */
  getCountriesForLanguage(language: Languages): CountryInfo[] {
    const languageGroupMap = this.getLanguageGroupMap();

    return languageGroupMap[language]?.countries || [];
  }

  /**
   * Get language name for a specific language code
   */
  getLanguageName(language: Languages): string {
    const languageGroupMap = this.getLanguageGroupMap();

    return languageGroupMap[language]?.name || "";
  }

  /**
   * Check if a language has multiple countries
   */
  hasMultipleCountries(language: Languages): boolean {
    return this.getCountriesForLanguage(language).length > 1;
  }

  /**
   * Get the primary country for a language (first one in the list)
   */
  getPrimaryCountryForLanguage(language: Languages): CountryInfo | null {
    const countries = this.getCountriesForLanguage(language);
    return countries.length > 0 ? countries[0] : null;
  }

  /**
   * Reset the cache (useful for testing or if country data changes)
   */
  resetCache(): void {
    this._uniqueLanguages = null;
    this._languageGroupMap = null;
  }
}

// ================================================================================
// LANGUAGE UTILITY FUNCTIONS
// ================================================================================

/**
 * Convenience function to get the singleton instance
 */
const getLanguageMapper = (): LanguageMapper => {
  return LanguageMapper.getInstance();
};

/**
 * Convenience function to get unique languages (most common use case)
 */
export const getUniqueLanguages = (): [
  langCode: Languages,
  langInfo: { name: string; countries: CountryInfo[] },
][] => {
  return getLanguageMapper().getUniqueLanguages();
};

/**
 * Extract country code from locale string
 */
export function getCountryFromLocale(locale: CountryLanguage): Countries {
  const parts = locale.split("-");
  return parts[1] as Countries;
}

/**
 * Extract language code from locale string
 */
export function getLanguageFromLocale(locale: CountryLanguage): Languages {
  const parts = locale.split("-");
  return parts[0] as Languages;
}

/**
 * Extract both language and country codes from locale string
 */
export function getLanguageAndCountryFromLocale(locale: CountryLanguage): {
  language: Languages;
  country: Countries;
} {
  const parts = locale.split("-");
  return {
    language: parts[0] as Languages,
    country: parts[1] as Countries,
  };
}

export function getLocaleFromLanguageAndCountry(
  language: Languages,
  country: Countries,
): CountryLanguage {
  return `${language}-${country}` as CountryLanguage;
}

/** Keep a visitor's language in multilingual regions. */
export function languageForCountry(
  country: CountryInfo,
  current: Languages,
): Languages {
  return country.languages.includes(current) ? current : country.language;
}
