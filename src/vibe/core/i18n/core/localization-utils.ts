/**
 * Localization Utilities
 * Centralized utilities for date, time, and currency formatting with proper localization
 */

import { format } from "date-fns";
import { de, enUS, type Locale, pl } from "date-fns/locale";
import { dateSchema } from "next-vibe/core/definition/common.schema";
import type z from "zod";

import { configScopedTranslation } from "@/_old/config/i18n";

import type { CountryLanguage, Currencies } from "./config";
import { getCountryFromLocale } from "./language-utils";

/**
 * Get locale string from CountryLanguage format
 * Converts "en-GLOBAL" to "en-US", "de-DE" to "de-DE", etc.
 */
function getLocaleString(countryLanguage: CountryLanguage): string {
  const [lang, country] = countryLanguage.split("-");

  // Map country codes to proper locale strings
  switch (country) {
    case "DE":
      return "de-DE";
    case "PL":
      return "pl-PL";
    case "AT":
      return "de-AT";
    case "CH":
      return lang === "de" ? "de-CH" : "fr-CH";
    case "GLOBAL":
    case "US":
    default:
      return "en-US";
  }
}

/**
 * Check if locale should use 24-hour time format
 */
function shouldUse24HourFormat(countryLanguage: CountryLanguage): boolean {
  const country = countryLanguage.split("-")[1];
  return country === "DE" || country === "PL" || country === "AT";
}

/**
 * Get date-fns locale object based on country language
 */
function getDateFnsLocale(countryLanguage: CountryLanguage): Locale {
  const country = countryLanguage.split("-")[1];
  switch (country) {
    case "DE":
    case "AT":
      return de;
    case "PL":
      return pl;
    default:
      return enUS;
  }
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
    const use24Hour = shouldUse24HourFormat(locale);

    return new Intl.DateTimeFormat(localeString, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: !use24Hour,
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
  const { t } = configScopedTranslation.scopedT(locale);
  const country = getCountryFromLocale(locale);
  const key = `timezone.${country}` as Parameters<typeof t>[0];
  return t(key);
}
