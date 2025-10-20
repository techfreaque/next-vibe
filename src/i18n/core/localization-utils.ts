/**
 * Localization Utilities
 * Centralized utilities for date, time, and currency formatting with proper localization
 */

import { format } from "date-fns";
import { de, enUS, type Locale, pl } from "date-fns/locale";
import { errorLogger } from "next-vibe/shared/utils";

import type { CountryLanguage, Currencies } from "./config";
import { simpleT } from "./shared";

/**
 * Get locale string from CountryLanguage format
 * Converts "en-GLOBAL" to "en-US", "de-DE" to "de-DE", etc.
 */
export function getLocaleString(countryLanguage: CountryLanguage): string {
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
export function shouldUse24HourFormat(
  countryLanguage: CountryLanguage,
): boolean {
  const country = countryLanguage.split("-")[1];
  return country === "DE" || country === "PL" || country === "AT";
}

/**
 * Get date-fns locale object based on country language
 */
export function getDateFnsLocale(countryLanguage: CountryLanguage): Locale {
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
 * Format date for display with native Intl.DateTimeFormat
 */
export function formatDateForDisplay(
  date: Date,
  locale: CountryLanguage,
): string {
  const localeString = getLocaleString(locale);
  return date.toLocaleDateString(localeString, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format time for display with locale-specific formatting
 */
export function formatTimeForDisplay(
  time: string,
  locale: CountryLanguage,
): string {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  const localeString = getLocaleString(locale);
  const use24Hour = shouldUse24HourFormat(locale);

  return date.toLocaleTimeString(localeString, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !use24Hour,
  });
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
  } catch (error) {
    errorLogger("Error formatting timestamp", error);
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
 * Format currency without decimal places for leads pricing
 */
export function formatCurrencyNoDecimals(
  amount: number,
  currency: string,
  locale: CountryLanguage,
): string {
  const localeString = getLocaleString(locale);
  const formatted = new Intl.NumberFormat(localeString, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  // Remove spaces between currency symbol and amount
  return formatted.replace(/\s/g, "");
}

/**
 * Format time string to HH:MM format (internal use)
 */
export function formatTimeString(date: Date): string {
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

/**
 * Format simple date string for locale
 */
export function formatSimpleDate(
  date: Date | string,
  locale: CountryLanguage,
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const localeString = getLocaleString(locale);

  return dateObj.toLocaleDateString(localeString, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format time with timezone support
 */
export function formatTimeWithTimezone(
  date: Date,
  timezone: string,
  locale: CountryLanguage,
): string {
  const localeString = getLocaleString(locale);
  const use24Hour = shouldUse24HourFormat(locale);

  return date.toLocaleTimeString(localeString, {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: !use24Hour,
  });
}

/**
 * Get current time in timezone with locale formatting
 */
export function getCurrentTimeInTimezone(
  timezone: string,
  locale: CountryLanguage,
): string {
  try {
    const localeString = getLocaleString(locale);
    const use24Hour = shouldUse24HourFormat(locale);
    return new Date().toLocaleTimeString(localeString, {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: !use24Hour,
    });
  } catch {
    return "--:--";
  }
}

/**
 * Get default timezone based on locale
 * Returns appropriate timezone for the given locale
 */
export function getDefaultTimezone(locale: CountryLanguage): string {
  const { t } = simpleT(locale);

  // Extract country from locale (e.g., "pl-PL" -> "PL", "de-DE" -> "DE")
  const country = locale.split("-")[1];

  // Use country-specific timezone mapping, same logic as consultation calendar
  const timezone =
    country === "PL"
      ? t("app.i18n.common.calendar.timezone.zones.PL")
      : country === "DE"
        ? t("app.i18n.common.calendar.timezone.zones.DE")
        : ((): string => {
            const globalTimezone = t(
              "app.i18n.common.calendar.timezone.zones.global",
            );
            // Handle UTC special case - convert to proper IANA timezone identifier
            return globalTimezone === "UTC" ? "Etc/UTC" : globalTimezone;
          })();

  return timezone;
}

/**
 * Format date with full weekday, month, day, year
 */
export function formatFullDate(date: Date, locale: CountryLanguage): string {
  const dateObj = date;
  const localeString = getLocaleString(locale);

  return dateObj.toLocaleDateString(localeString, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date with short format
 */
export function formatShortDate(date: Date, locale: CountryLanguage): string {
  const dateObj = date;
  const localeString = getLocaleString(locale);

  return dateObj.toLocaleDateString(localeString, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format single date to YYYY-MM-DD string with timezone support
 * Uses en-CA locale for consistent YYYY-MM-DD format regardless of user locale
 */
export function formatSingleDateStringWithTimezone(
  date: Date,
  timezone: string,
): string {
  try {
    // Use en-CA format for consistent YYYY-MM-DD output regardless of user locale
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(date);
  } catch {
    // Fallback to UTC if timezone conversion fails
    return date.toISOString().split("T")[0];
  }
}

/**
 * Format date to YYYY-MM-DD string with timezone support (for date ranges)
 * Uses en-CA locale for consistent YYYY-MM-DD format regardless of user locale
 */
export function formatDateStringWithTimezone(
  dateRange: {
    startDate: string | number | Date | null;
    endDate: string | number | Date | null;
  },
  timezone: string,
): string {
  const date = dateRange.startDate;
  if (!date) {
    return "";
  }

  const dateObj = date instanceof Date ? date : new Date(date);
  return formatSingleDateStringWithTimezone(dateObj, timezone);
}

/**
 * Format time to HH:MM string with timezone support
 * Always returns 24-hour format for internal processing
 */
export function formatTimeInTimezone(date: Date, timezone: string): string {
  if (timezone) {
    try {
      // Use 24-hour format for internal time processing
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return formatter.format(date);
    } catch {
      // Fallback to UTC if timezone conversion fails
      return date.toTimeString().slice(0, 5);
    }
  } else {
    return date.toTimeString().slice(0, 5);
  }
}

/**
 * Format date and time with timezone and locale support
 * Returns localized date and time formatting
 */
export function formatDateTimeInTimezone(
  date: Date,
  timezone: string,
  locale: CountryLanguage,
  options?: {
    dateStyle?: "full" | "long" | "medium" | "short";
    timeStyle?: "full" | "long" | "medium" | "short";
    includeWeekday?: boolean;
  },
): string {
  try {
    const localeString = getLocaleString(locale);
    const use24Hour = shouldUse24HourFormat(locale);

    const formatOptions: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour12: !use24Hour,
    };

    if (options?.dateStyle) {
      formatOptions.dateStyle = options.dateStyle;
    } else {
      formatOptions.year = "numeric";
      formatOptions.month = "long";
      formatOptions.day = "numeric";
      if (options?.includeWeekday) {
        formatOptions.weekday = "long";
      }
    }

    if (options?.timeStyle) {
      formatOptions.timeStyle = options.timeStyle;
    } else {
      formatOptions.hour = "2-digit";
      formatOptions.minute = "2-digit";
    }

    return new Intl.DateTimeFormat(localeString, formatOptions).format(date);
  } catch (error) {
    errorLogger("Error formatting date/time with timezone", error);
    // Fallback to basic formatting
    const localeString = getLocaleString(locale);
    return date.toLocaleString(localeString);
  }
}

/**
 * Parse date and time strings into a Date object
 * @param dateString Date in YYYY-MM-DD format
 * @param timeString Time in HH:MM format
 * @returns Date object or null if parsing fails
 */
export function parseDateTime(
  dateString: string,
  timeString: string,
): Date | null {
  try {
    const [year, month, day] = dateString.split("-").map(Number);
    const [hours, minutes] = timeString.split(":").map(Number);

    if (
      year === undefined ||
      month === undefined ||
      day === undefined ||
      hours === undefined ||
      minutes === undefined
    ) {
      return null;
    }

    // Create UTC date
    return new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
  } catch {
    return null;
  }
}
