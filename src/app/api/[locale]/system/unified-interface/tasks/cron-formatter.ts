/**
 * Cron Schedule Formatter Utility
 * Converts cron expressions to human-readable descriptions using cron-parser
 * Now supports internationalization
 */

import cronParser from "cron-parser";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

/**
 * Convert a cron expression to human-readable text
 * Uses cron-parser to analyze the schedule and generate descriptive text
 */
export function formatCronSchedule(
  schedule: string,
  timezone: string,
  locale: CountryLanguage,
  logger: EndpointLogger,
): string {
  try {
    // Analyze the cron expression parts first
    const parts = schedule.trim().split(/\s+/);
    if (parts.length < 5) {
      return schedule; // Return original if invalid format
    }

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    // Try to parse with cron-parser to validate
    cronParser.parse(schedule, {
      tz: timezone,
      currentDate: new Date(),
    });

    // Generate human-readable description
    return generateDescription(minute, hour, dayOfMonth, month, dayOfWeek, timezone, locale);
  } catch (error) {
    logger.error("Failed to parse cron schedule", parseError(error));
    // If parsing fails, try to generate a basic description anyway
    const parts = schedule.trim().split(/\s+/);
    if (parts.length >= 5) {
      const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
      try {
        return generateDescription(minute, hour, dayOfMonth, month, dayOfWeek, timezone, locale);
      } catch {
        // If all else fails, return the original schedule
        return schedule;
      }
    }
    return schedule;
  }
}

/**
 * Generate human-readable description from cron parts
 */
function generateDescription(
  minute: string,
  hour: string,
  dayOfMonth: string,
  month: string,
  dayOfWeek: string,
  timezone: string,
  locale: CountryLanguage,
): string {
  const parts: string[] = [];
  const { t } = simpleT(locale);

  // Handle frequency
  if (minute === "*" && hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    return t("app.api.system.unifiedInterface.tasks.cron.frequency.everyMinute");
  }

  // Handle minute
  if (minute === "*") {
    parts.push(t("app.api.system.unifiedInterface.tasks.cron.frequency.everyMinutes"));
  } else if (minute.includes("/")) {
    const [start, interval] = minute.split("/");
    if (start === "*") {
      parts.push(
        t("app.api.system.unifiedInterface.tasks.cron.patterns.everyIntervalMinutes", {
          interval,
        }),
      );
    } else {
      parts.push(
        t("app.api.system.unifiedInterface.tasks.cron.patterns.everyIntervalMinutesStarting", {
          interval,
          start,
        }),
      );
    }
  } else if (minute.includes(",")) {
    const minutes = minute.split(",");
    parts.push(
      t("app.api.system.unifiedInterface.tasks.cron.patterns.atMinutes", {
        minutes: minutes.join(", "),
      }),
    );
  } else if (minute.includes("-")) {
    const [start, end] = minute.split("-");
    parts.push(
      t("app.api.system.unifiedInterface.tasks.cron.patterns.fromMinuteToMinute", {
        start,
        end,
      }),
    );
  } else if (minute !== "0") {
    parts.push(
      t("app.api.system.unifiedInterface.tasks.cron.patterns.atMinute", {
        minute,
      }),
    );
  }

  // Handle hour
  if (hour === "*") {
    if (!parts.some((p) => p.includes("minute"))) {
      parts.push(t("app.api.system.unifiedInterface.tasks.cron.frequency.everyHour"));
    }
  } else if (hour.includes("/")) {
    const [start, interval] = hour.split("/");
    if (start === "*") {
      parts.push(
        t("app.api.system.unifiedInterface.tasks.cron.patterns.everyIntervalHours", {
          interval,
        }),
      );
    } else {
      parts.push(
        t("app.api.system.unifiedInterface.tasks.cron.patterns.everyIntervalHoursStarting", {
          interval,
          start: formatHour(start, locale),
        }),
      );
    }
  } else if (hour.includes(",")) {
    const hours = hour.split(",").map((h) => formatHour(h, locale));
    parts.push(
      t("app.api.system.unifiedInterface.tasks.cron.patterns.atHours", {
        hours: hours.join(", "),
      }),
    );
  } else if (hour.includes("-")) {
    const [start, end] = hour.split("-");
    parts.push(
      t("app.api.system.unifiedInterface.tasks.cron.patterns.fromHourToHour", {
        start: formatHour(start, locale),
        end: formatHour(end, locale),
      }),
    );
  } else {
    parts.push(
      t("app.api.system.unifiedInterface.tasks.cron.patterns.atHour", {
        hour: formatHour(hour, locale),
      }),
    );
  }

  // Handle day of month
  if (dayOfMonth !== "*") {
    if (dayOfMonth.includes("/")) {
      const [, interval] = dayOfMonth.split("/");
      parts.push(
        t("app.api.system.unifiedInterface.tasks.cron.frequency.everyDays", {
          count: interval,
        }),
      );
    } else if (dayOfMonth.includes(",")) {
      const days = dayOfMonth.split(",");
      parts.push(
        t("app.api.system.unifiedInterface.tasks.cron.calendar.onDays", {
          days: days.join(", "),
        }),
      );
    } else {
      parts.push(
        t("app.api.system.unifiedInterface.tasks.cron.calendar.onDay", {
          day: dayOfMonth,
        }),
      );
    }
  }

  // Handle month
  if (month !== "*") {
    if (month.includes(",")) {
      const months = month.split(",").map((m) => formatMonth(m, locale));
      parts.push(
        t("app.api.system.unifiedInterface.tasks.cron.calendar.inMonths", {
          months: months.join(", "),
        }),
      );
    } else {
      parts.push(
        t("app.api.system.unifiedInterface.tasks.cron.calendar.inMonth", {
          month: formatMonth(month, locale),
        }),
      );
    }
  }

  // Handle day of week
  if (dayOfWeek !== "*") {
    if (dayOfWeek.includes(",")) {
      const days = dayOfWeek.split(",").map((d) => formatDayOfWeek(d, locale));
      parts.push(
        t("app.api.system.unifiedInterface.tasks.cron.calendar.onWeekdays", {
          days: days.join(", "),
        }),
      );
    } else if (dayOfWeek.includes("-")) {
      const [start, end] = dayOfWeek.split("-");
      parts.push(
        t("app.api.system.unifiedInterface.tasks.cron.calendar.fromWeekdayToWeekday", {
          start: formatDayOfWeek(start, locale),
          end: formatDayOfWeek(end, locale),
        }),
      );
    } else {
      parts.push(
        t("app.api.system.unifiedInterface.tasks.cron.calendar.onWeekday", {
          day: formatDayOfWeek(dayOfWeek, locale),
        }),
      );
    }
  }

  // Add timezone if not UTC
  if (timezone !== "UTC") {
    parts.push(
      t("app.api.system.unifiedInterface.tasks.cron.timezone", {
        timezone,
      }),
    );
  }

  // Combine parts into a readable sentence
  let description = parts.join(" ");

  // Capitalize first letter
  description = description.charAt(0).toUpperCase() + description.slice(1);

  return description;
}

/**
 * Format hour number to readable format
 */
function formatHour(hour: string, locale: CountryLanguage): string {
  const { t } = simpleT(locale);
  const h = parseInt(hour, 10);
  if (h === 0) {
    return t("app.api.system.unifiedInterface.tasks.cron.time.midnight");
  }
  if (h === 12) {
    return t("app.api.system.unifiedInterface.tasks.cron.time.noon");
  }
  if (h < 12) {
    return t("app.api.system.unifiedInterface.tasks.cron.time.hourAm", {
      hour: h,
    });
  }
  return t("app.api.system.unifiedInterface.tasks.cron.time.hourPm", {
    hour: h - 12,
  });
}

/**
 * Format month number to month name
 */
function formatMonth(month: string, locale: CountryLanguage): string {
  const { t } = simpleT(locale);
  const m = parseInt(month, 10);
  switch (m) {
    case 1:
      return t("app.api.system.unifiedInterface.tasks.cron.months.january");
    case 2:
      return t("app.api.system.unifiedInterface.tasks.cron.months.february");
    case 3:
      return t("app.api.system.unifiedInterface.tasks.cron.months.march");
    case 4:
      return t("app.api.system.unifiedInterface.tasks.cron.months.april");
    case 5:
      return t("app.api.system.unifiedInterface.tasks.cron.months.may");
    case 6:
      return t("app.api.system.unifiedInterface.tasks.cron.months.june");
    case 7:
      return t("app.api.system.unifiedInterface.tasks.cron.months.july");
    case 8:
      return t("app.api.system.unifiedInterface.tasks.cron.months.august");
    case 9:
      return t("app.api.system.unifiedInterface.tasks.cron.months.september");
    case 10:
      return t("app.api.system.unifiedInterface.tasks.cron.months.october");
    case 11:
      return t("app.api.system.unifiedInterface.tasks.cron.months.november");
    case 12:
      return t("app.api.system.unifiedInterface.tasks.cron.months.december");
    default:
      return month;
  }
}

/**
 * Format day of week number to day name
 */
function formatDayOfWeek(day: string, locale: CountryLanguage): string {
  const { t } = simpleT(locale);
  const d = parseInt(day, 10);
  switch (d) {
    case 0:
      return t("app.api.system.unifiedInterface.tasks.cron.days.sunday");
    case 1:
      return t("app.api.system.unifiedInterface.tasks.cron.days.monday");
    case 2:
      return t("app.api.system.unifiedInterface.tasks.cron.days.tuesday");
    case 3:
      return t("app.api.system.unifiedInterface.tasks.cron.days.wednesday");
    case 4:
      return t("app.api.system.unifiedInterface.tasks.cron.days.thursday");
    case 5:
      return t("app.api.system.unifiedInterface.tasks.cron.days.friday");
    case 6:
      return t("app.api.system.unifiedInterface.tasks.cron.days.saturday");
    default:
      return day;
  }
}

/**
 * Calculate the frequency in minutes from a cron schedule
 * Returns the interval between executions in minutes
 * Uses cron-parser library for accurate calculation
 */
export function getCronFrequencyMinutes(schedule: string, logger: EndpointLogger): number {
  try {
    // Parse the cron expression using cron-parser
    const interval = cronParser.parse(schedule, {
      tz: "UTC",
      currentDate: new Date(),
    });

    // Get the next two execution times to calculate the interval
    const firstExecution = interval.next().toDate();
    const secondExecution = interval.next().toDate();

    // Calculate the difference in minutes
    const diffMs = secondExecution.getTime() - firstExecution.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));

    // Ensure we return a reasonable minimum (1 minute)
    return Math.max(diffMinutes, 1);
  } catch (error) {
    logger.error("Failed to parse cron frequency", parseError(error));
    return 60; // Default to hourly on error
  }
}

/**
 * Get a short description of the cron schedule
 * Useful for compact displays
 */
export function formatCronScheduleShort(
  schedule: string,
  timezone = "UTC",
  locale: CountryLanguage,
  logger: EndpointLogger,
): string {
  try {
    const { t } = simpleT(locale);
    const parts = schedule.trim().split(/\s+/);
    if (parts.length < 5) {
      return schedule;
    }

    // Common patterns
    if (schedule === "0 0 * * *") {
      return t("app.api.system.unifiedInterface.tasks.cron.common.dailyAtMidnight");
    }
    if (schedule === "0 12 * * *") {
      return t("app.api.system.unifiedInterface.tasks.cron.common.dailyAtNoon");
    }
    if (schedule === "0 0 * * 0") {
      return t("app.api.system.unifiedInterface.tasks.cron.common.weeklyOnSunday");
    }
    if (schedule === "0 0 1 * *") {
      return t("app.api.system.unifiedInterface.tasks.cron.common.monthlyOnFirst");
    }
    if (schedule === "*/5 * * * *") {
      return t("app.api.system.unifiedInterface.tasks.cron.common.everyFiveMinutes");
    }
    if (schedule === "*/3 * * * *") {
      return t("app.api.system.unifiedInterface.tasks.cron.common.everyThreeMinutes");
    }
    if (schedule === "*/1 * * * *") {
      return t("app.api.system.unifiedInterface.tasks.cron.common.everyOneMinutes");
    }
    if (schedule === "*/10 * * * *") {
      return t("app.api.system.unifiedInterface.tasks.cron.common.everyTenMinutes");
    }
    if (schedule === "*/15 * * * *") {
      return t("app.api.system.unifiedInterface.tasks.cron.common.everyFifteenMinutes");
    }
    if (schedule === "*/30 * * * *") {
      return t("app.api.system.unifiedInterface.tasks.cron.common.everyThirtyMinutes");
    }
    if (schedule === "0 * * * *") {
      return t("app.api.system.unifiedInterface.tasks.cron.frequency.hourly");
    }

    // Try to generate a short description
    const fullDescription = formatCronSchedule(schedule, timezone, locale, logger);

    // Truncate if too long
    if (fullDescription.length > 50) {
      return `${fullDescription.slice(0, 47)}...`;
    }

    return fullDescription;
  } catch (error) {
    logger.error("Failed to parse cron schedule", parseError(error));
    return schedule;
  }
}

/**
 * Calculate next execution time for a cron task
 * Uses cron-parser library for accurate calculation
 */
export function calculateNextExecutionTime(
  schedule: string,
  timezone = "UTC",
  logger: EndpointLogger,
): Date | null {
  try {
    const interval = cronParser.parse(schedule, {
      tz: timezone,
      currentDate: new Date(),
    });
    return interval.next().toDate();
  } catch (error) {
    logger.error("Failed to parse cron schedule", parseError(error));
    return null;
  }
}

/**
 * Validate cron schedule
 * Uses cron-parser library to validate the schedule format
 */
export function validateCronSchedule(schedule: string, timezone = "UTC"): boolean {
  try {
    cronParser.parse(schedule, { tz: timezone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a cron task is due to run based on its schedule
 * Uses cron-parser to determine if the current time matches the task's schedule
 */
export function isCronTaskDue(
  logger: EndpointLogger,
  schedule: string,
  currentDate?: Date,
): boolean {
  try {
    const interval = cronParser.parse(schedule, {
      tz: "UTC",
      currentDate: currentDate || new Date(),
    });

    // Get the previous execution time
    const prevExecution = interval.prev().toDate();
    const now = currentDate || new Date();

    // Check if we're within the execution window (1 minute tolerance)
    const timeDiff = now.getTime() - prevExecution.getTime();
    return timeDiff >= 0 && timeDiff < 60000; // Within 1 minute
  } catch (error) {
    logger.error("Failed to check if cron task is due", parseError(error));
    return false;
  }
}

/**
 * Parse cron expression and return parsed interval
 * Centralized cron parsing function
 */
export function parseCronExpression(
  logger: EndpointLogger,
  schedule: string,
  timezone = "UTC",
  currentDate?: Date,
): ReturnType<typeof cronParser.parse> | null {
  try {
    return cronParser.parse(schedule, {
      tz: timezone,
      currentDate: currentDate || new Date(),
    });
  } catch (error) {
    logger.error("Failed to parse cron expression", parseError(error));
    return null;
  }
}
