import type {
  Countries,
  CountryInfo,
  CountryLanguage,
  Currencies,
  Languages,
} from "next-vibe/core/i18n/core/config";
import {
  availableCountries,
  globalCountryInfo,
} from "next-vibe/core/i18n/core/config";
import {
  getCountryFromLocale,
  getLanguageFromLocale,
  getUniqueLanguages,
} from "next-vibe/core/i18n/core/language-utils";
import { countryOptions } from "next-vibe/core/i18n/core/regions";

import { configScopedTranslation } from "@/env/i18n";

export interface LanguageEntry {
  code: Languages;
  /** Endonym, e.g. "Deutsch". */
  nativeName: string;
  /** Name in the page language, e.g. "German" on an English page. */
  localName: string;
}

export interface RegionEntry {
  code: Countries;
  flag: string;
  /** Name in the page language. */
  name: string;
  /** Name in the region's own main language, for search. */
  nativeName: string;
  currency: Currencies;
}

/** Hand-picked first regions per language: main markets, then Global. */
const FEATURED: Record<Languages, readonly Countries[]> = {
  en: ["US", "GB", "CA", "AU", "IE", "IN", "GLOBAL"],
  de: ["DE", "AT", "CH", "LI", "LU", "GLOBAL"],
  fr: ["FR", "BE", "CH", "CA", "LU", "GLOBAL"],
  it: ["IT", "CH", "SM", "GLOBAL"],
  es: ["ES", "MX", "AR", "CO", "US", "GLOBAL"],
  pl: ["PL", "GLOBAL"],
};

export function normalizeSearch(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export interface LocaleModel {
  language: Languages;
  country: Countries;
  languages: LanguageEntry[];
  currentLanguage: LanguageEntry;
  regions: RegionEntry[];
  currentRegion: RegionEntry;
  featuredFor: (language: Languages) => RegionEntry[];
  filterRegions: (query: string) => RegionEntry[];
}

const modelCache = new Map<CountryLanguage, LocaleModel>();

export function getLocaleModel(locale: CountryLanguage): LocaleModel {
  const cached = modelCache.get(locale);
  if (cached) {
    return cached;
  }
  const language = getLanguageFromLocale(locale);
  const country = getCountryFromLocale(locale);
  const { t } = configScopedTranslation.scopedT(locale);
  const languageNames = new Intl.DisplayNames(language, { type: "language" });

  const languages: LanguageEntry[] = getUniqueLanguages().map(
    ([code, info]) => {
      const local = languageNames.of(code) ?? info.name;
      return {
        code,
        nativeName: info.name,
        localName: local.charAt(0).toLocaleUpperCase(language) + local.slice(1),
      };
    },
  );

  const names = new Map(
    countryOptions.map(({ value, label }) => [value, t(label)] as const),
  );
  const toRegion = (info: CountryInfo): RegionEntry => {
    const name = names.get(info.code) ?? info.name;
    return {
      code: info.code,
      flag: info.flag,
      name,
      nativeName: info.name,
      currency: info.currency,
    };
  };
  const regions = availableCountries
    .map(toRegion)
    .toSorted((left, right) => left.name.localeCompare(right.name, language));
  const regionByCode = new Map(regions.map((r) => [r.code, r] as const));
  const currentRegion =
    regionByCode.get(country) ?? toRegion(globalCountryInfo);
  const currentLanguage = languages.find(
    (entry) => entry.code === language,
  ) ?? {
    code: language,
    nativeName: language,
    localName: language,
  };

  const featuredFor = (lang: Languages): RegionEntry[] =>
    FEATURED[lang].flatMap((code) => {
      const region = regionByCode.get(code);
      return region ? [region] : [];
    });
  const filterRegions = (query: string): RegionEntry[] => {
    if (!normalizeSearch(query)) {
      return regions;
    }
    const scored = regions
      .map((region) => ({
        region,
        score: matchScore(
          [region.name, region.nativeName, region.code, region.currency],
          query,
        ),
      }))
      .filter((hit) => hit.score > 0);
    // Prefix and word-prefix hits only, unless nothing starts with the query
    const strong = scored.filter((hit) => hit.score >= 2);
    return (strong.length > 0 ? strong : scored)
      .toSorted((left, right) => right.score - left.score)
      .map((hit) => hit.region);
  };

  const model: LocaleModel = {
    language,
    country,
    languages,
    currentLanguage,
    regions,
    currentRegion,
    featuredFor,
    filterRegions,
  };
  modelCache.set(locale, model);
  return model;
}

/**
 * Relevance of a query against display names: whole-name prefix beats a word
 * prefix beats a substring. 0 = no match. Accent- and case-insensitive.
 */
export function matchScore(names: readonly string[], query: string): number {
  const needle = normalizeSearch(query);
  if (!needle) {
    return 1;
  }
  let best = 0;
  for (const raw of names) {
    const name = normalizeSearch(raw);
    if (name === needle) {
      best = Math.max(best, 4);
    } else if (name.startsWith(needle)) {
      best = Math.max(best, 3);
    } else if (name.split(/[\s-]+/).some((word) => word.startsWith(needle))) {
      best = Math.max(best, 2);
    } else if (name.includes(needle)) {
      best = Math.max(best, 1);
    }
  }
  return best;
}

/** Menu row label: language and region together, e.g. "Deutsch · Österreich". */
export function getLocaleLabel(locale: CountryLanguage): {
  flag: string;
  text: string;
} {
  const { currentLanguage, currentRegion } = getLocaleModel(locale);
  return {
    flag: currentRegion.flag,
    text: `${currentLanguage.nativeName} · ${currentRegion.name}`,
  };
}
