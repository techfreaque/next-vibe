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
export type LanguageGroupMap = {
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
      this._languageGroupMap = availableCountries.reduce((acc, curr) => {
        const language = curr.language as Languages;

        if (!acc[language]) {
          acc[language] = {
            name: curr.langName,
            countries: [],
          };
        }
        // Create a mutable copy to avoid readonly issues
        acc[language].countries = [...acc[language].countries, curr];
        return acc;
      }, {} as LanguageGroupMap);
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
export const getLanguageMapper = (): LanguageMapper => {
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
 * Convenience function to get countries for a specific language
 */
export const getCountriesForLanguage = (language: Languages): CountryInfo[] => {
  return getLanguageMapper().getCountriesForLanguage(language);
};

/**
 * Convenience function to get language name
 */
export const getLanguageName = (language: Languages): string => {
  return getLanguageMapper().getLanguageName(language);
};

/**
 * Convenience function to check if a language has multiple countries
 */
export const hasMultipleCountries = (language: Languages): boolean => {
  return getLanguageMapper().hasMultipleCountries(language);
};

/**
 * Convenience function to get the primary country for a language
 */
export const getPrimaryCountryForLanguage = (
  language: Languages,
): CountryInfo | null => {
  return getLanguageMapper().getPrimaryCountryForLanguage(language);
};

/**
 * Extract country code from locale string
 */
export function getCountryFromLocale(locale: CountryLanguage): Countries {
  return locale.split("-")[1] as Countries;
}

/**
 * Extract language code from locale string
 */
export function getLanguageFromLocale(locale: CountryLanguage): Languages {
  return locale.split("-")[0] as Languages;
}
