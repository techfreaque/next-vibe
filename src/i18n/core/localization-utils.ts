/**
 * Localization Utilities
 * Centralized utilities for date, time, and currency formatting with proper localization
 */

import { format } from "date-fns";
import { de, enUS, type Locale, pl } from "date-fns/locale";
import { errorLogger } from "next-vibe/shared/utils";

import {
  CONSULTATION_CONFIG,
  CONSULTATION_DURATION,
} from "@/app/api/[locale]/v1/core/consultation/consultation-config/repository";

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
      ? t("common.calendar.timezone.zones.PL")
      : country === "DE"
        ? t("common.calendar.timezone.zones.DE")
        : ((): string => {
            const globalTimezone = t("common.calendar.timezone.zones.global");
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

/****************************
 * BUSINESS TIME UTILITIES
 * Centralized time utilities for business applications
 ****************************/

/**
 * Generate business time slots for a specific timezone and locale
 * This is a generic function for generating time slots within business hours
 * @param locale User's locale for timezone determination
 * @param timezone User's timezone
 * @param slotDurationMinutes Duration of each slot in minutes (default: 60)
 * @param date The date for which to generate slots
 * @param businessHours Optional business hours config (uses default if not provided)
 * @returns Array of time slot objects with timezone-aware times
 */
export function generateBusinessTimeSlots(
  locale: CountryLanguage,
  timezone: string,
  date: Date = new Date(),
): Array<{ time: string; utcTime: Date; displayTime: string }> {
  const userTimezone = timezone;
  const slots: Array<{ time: string; utcTime: Date; displayTime: string }> = [];

  // Create a base date for the given day
  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);

  // Generate slots for business hours in UTC
  for (
    let hour = CONSULTATION_CONFIG.businessStartHourUTC;
    hour <= CONSULTATION_CONFIG.businessEndHourUTC;
    hour += CONSULTATION_DURATION.maxDurationMinutes / 60
  ) {
    const minutes = (hour % 1) * 60;
    const wholeHour = Math.floor(hour);

    // Create a UTC date object for this time slot
    const utcTime = new Date(
      Date.UTC(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        wholeHour,
        minutes,
        0,
        0,
      ),
    );

    // Format the time in the user's timezone for internal use (24-hour format)
    const timeString = formatTimeInTimezone(utcTime, userTimezone);

    // Format the time for display with proper localization
    const displayTime = formatTimeWithTimezone(utcTime, userTimezone, locale);

    slots.push({
      time: timeString,
      utcTime,
      displayTime,
    });
  }

  return slots;
}

/**
 * Validate if a time is within business hours
 * @param timeString Time in HH:MM format in the specified timezone (or UTC if no timezone provided)
 * @param timezone timezone for the time string
 * @param date date for timezone conversion
 * @returns true if within business hours, false otherwise
 */
export function isTimeWithinBusinessHours(
  timeString: string,
  timezone: string,
  date: Date,
): boolean {
  try {
    // Validate time format (should be HH:MM only)
    const timeParts = timeString.split(":");
    if (timeParts.length !== 2) {
      return false;
    }

    const [hours, minutes] = timeParts.map(Number);
    if (hours === undefined || minutes === undefined) {
      return false;
    }

    // Validate time ranges
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return false;
    }

    // Check for NaN values (invalid number parsing)
    if (isNaN(hours) || isNaN(minutes)) {
      return false;
    }

    // Create a date object for the given date and time in the specified timezone
    const baseDate = new Date(date);
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const day = baseDate.getDate();

    // Convert the local time to UTC using a simple and reliable approach
    // Create a date object representing the local time in the user's timezone
    // Then convert it to UTC for comparison with business hours

    // Use the same method as the time slot generation for consistency
    // Create a UTC date representing the time slot
    const utcSlotTime = new Date(
      Date.UTC(year, month, day, hours, minutes, 0, 0),
    );

    // Convert this to the user's timezone to see what local time it represents
    const localTimeInUserTz = formatTimeInTimezone(utcSlotTime, timezone);

    // If the local time matches our input time, then this UTC time is correct
    // Otherwise, we need to adjust for the timezone difference
    const [expectedLocalHours, expectedLocalMinutes] = localTimeInUserTz
      .split(":")
      .map(Number);

    // Calculate the difference between expected and actual local time
    const expectedMinutes = expectedLocalHours * 60 + expectedLocalMinutes;
    const actualMinutes = hours * 60 + minutes;
    const diffMinutes = actualMinutes - expectedMinutes;

    // Adjust the UTC time by the difference
    const adjustedUtcTime = new Date(
      utcSlotTime.getTime() + diffMinutes * 60 * 1000,
    );

    const utcHour = adjustedUtcTime.getUTCHours();
    const utcMinute = adjustedUtcTime.getUTCMinutes();
    const utcTimeInMinutes = utcHour * 60 + utcMinute;

    const businessStartMinutes = CONSULTATION_CONFIG.businessStartHourUTC * 60;
    const businessEndMinutes = CONSULTATION_CONFIG.businessEndHourUTC * 60;

    return (
      utcTimeInMinutes >= businessStartMinutes &&
      utcTimeInMinutes <= businessEndMinutes
    );
  } catch {
    return false;
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

/**
 * Get default booking time limits
 * @param minHoursAhead Minimum hours ahead for booking (default: 2)
 * @param maxMonthsAhead Maximum months ahead for booking (default: 6)
 * @returns Object with min and max booking dates
 */
export function getBookingTimeLimits(
  minHoursAhead = 2,
  maxMonthsAhead = 6,
): {
  minDate: Date;
  maxDate: Date;
} {
  const now = new Date();

  // Minimum hours ahead
  const minDate = new Date(now.getTime() + minHoursAhead * 60 * 60 * 1000);

  // Maximum months ahead
  const maxDate = new Date(now);
  maxDate.setMonth(maxDate.getMonth() + maxMonthsAhead);

  return { minDate, maxDate };
}

/**
 * Get localized business hours for display
 * @param locale User's locale
 * @param businessHours Optional business hours config (uses default if not provided)
 * @returns Object with formatted start and end hours
 */
export function getLocalizedBusinessHours(locale: CountryLanguage): {
  startHour: string;
  endHour: string;
} {
  const timezone = getDefaultTimezone(locale);

  // Create dates for business hours using the business hours config
  const today = new Date();
  const startDate = new Date(today);
  startDate.setUTCHours(CONSULTATION_CONFIG.businessStartHourUTC, 0, 0, 0);

  const endDate = new Date(today);
  // Use the actual end hour (15 UTC = 3 PM UTC)
  endDate.setUTCHours(CONSULTATION_CONFIG.businessEndHourUTC, 0, 0, 0);

  // Convert to local timezone and extract hour numbers for the translation template
  // The translation template expects just the hour number (e.g., "7", "15")
  const startTimeInTz = formatTimeInTimezone(startDate, timezone);
  const endTimeInTz = formatTimeInTimezone(endDate, timezone);

  const startHour = startTimeInTz.split(":")[0];
  const endHour = endTimeInTz.split(":")[0];

  return {
    startHour,
    endHour,
  };
}
