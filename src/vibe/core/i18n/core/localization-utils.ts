/**
 * Localization Utilities
 * Centralized utilities for date, time, and currency formatting with proper localization
 */

import { format } from "date-fns";
import { de, enUS, es, fr, hi, it, type Locale, pl, sk } from "date-fns/locale";
import type z from "zod";

import { dateSchema } from "../../definition/common.schema";
import { languageConfig } from "..";
import type { CountryLanguage, Currencies } from "./config";
import {
  getCountryFromLocale,
  getLanguageFromLocale,
  toIntlLocale,
} from "./language-utils";

/**
 * Get locale string from CountryLanguage format
 * Converts "en-GLOBAL" to "en", keeps "de-DE" and "en-IN" (regional grouping).
 */
function getLocaleString(countryLanguage: CountryLanguage): string {
  return toIntlLocale(countryLanguage);
}

/** date-fns Hindi with Western digits (its ordinal day is Devanagari). */
const hiWestern: Locale = {
  ...hi,
  localize: {
    ...hi.localize,
    ordinalNumber: (value) => String(value),
  },
};

const dateLocales = { de, en: enUS, es, fr, hi: hiWestern, it, pl, sk };

function getDateFnsLocale(countryLanguage: CountryLanguage): Locale {
  return dateLocales[getLanguageFromLocale(countryLanguage)];
}

/**
 * Format date with proper localization using date-fns
 */
export function formatDate(
  date: Date,
  locale: CountryLanguage,
  formatString = "PPP",
): string {
  const dateFnsLocale = getDateFnsLocale(locale);
  return format(date, formatString, { locale: dateFnsLocale });
}

/**
 * Format timestamp for display with proper localization
 */
export function formatTimestamp(
  timestamp: string | Date,
  locale: CountryLanguage,
): string {
  try {
    const date =
      typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    const localeString = getLocaleString(locale);

    return new Intl.DateTimeFormat(localeString, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  } catch {
    // Error formatting timestamp - return raw value
    return typeof timestamp === "string" ? timestamp : timestamp.toString();
  }
}

/**
 * Format currency with proper localization
 */
export function formatCurrency(
  amount: number,
  currency: Currencies,
  locale: CountryLanguage,
): string {
  const localeString = getLocaleString(locale);
  return new Intl.NumberFormat(localeString, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Format simple date string for locale
 */
export function formatSimpleDate(
  date: z.output<typeof dateSchema>,
  locale: CountryLanguage,
): string {
  const dateObj = dateSchema.parse(date) as Date;
  const localeString = getLocaleString(locale);

  return dateObj.toLocaleDateString(localeString, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Get default timezone based on locale
 * Returns appropriate timezone for the given locale
 */
export function getDefaultTimezone(locale: CountryLanguage): string {
  return languageConfig.countryInfo[getCountryFromLocale(locale)].timezone;
}
