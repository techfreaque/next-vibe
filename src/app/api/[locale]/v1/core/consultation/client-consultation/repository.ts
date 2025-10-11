/**
 * Client Consultation Repository
 * Repository-first architecture for client-side consultation business logic
 */

import { formatSingleDateStringWithTimezone } from "@/i18n/core/localization-utils";

import type {
  AvailabilityProcessingRequest,
  BusinessDataCompletionStatus,
  CalendarDaysRequest,
  DateAvailability,
  DateAvailabilityRequest,
  MonthNavigationRequest,
  ProcessedBusinessDataCompletion,
  TimeSlot,
  TimeSlotsForDateRequest,
} from "./types";

/**
 * Client Consultation Repository Interface
 */
export interface IClientConsultationRepository {
  getTimeSlotsForDate(request: TimeSlotsForDateRequest): TimeSlot[];
  processAvailabilityByDate(
    request: AvailabilityProcessingRequest,
  ): Map<string, DateAvailability>;
  getDateAvailability(request: DateAvailabilityRequest): DateAvailability;
  isDateAvailable(request: DateAvailabilityRequest): boolean;
  isSameDate(date1: Date, date2: Date): boolean;
  isToday(date: Date): boolean;
  isPastDate(date: Date): boolean;
  isDateInMonth(date: Date, month: number, year: number): boolean;
  generateCalendarDays(request: CalendarDaysRequest): Date[];
  canNavigateToPreviousMonth(currentMonth: Date): boolean;
  canNavigateToNextMonth(request: MonthNavigationRequest): boolean;
  processBusinessDataCompletion(
    status: BusinessDataCompletionStatus | null,
  ): ProcessedBusinessDataCompletion;
}

/**
 * Client Consultation Repository Implementation
 */
export class ClientConsultationRepositoryImpl
  implements IClientConsultationRepository
{
  /**
   * Get time slots for a specific date
   * Processes availability data to return formatted time slots for UI
   */
  getTimeSlotsForDate(request: TimeSlotsForDateRequest): TimeSlot[] {
    const { availabilityData, date, locale, timezone } = request;

    if (!availabilityData?.slots) {
      return [];
    }

    // Generate date string using the centralized timezone-aware utility
    const dateString = formatSingleDateStringWithTimezone(date, timezone);

    const filteredSlots = (
      availabilityData.slots as Array<{
        start: string | Date;
        available: boolean;
      }>
    ).filter((slot) => {
      // Use centralized utility for consistent date formatting
      const slotDateString = formatSingleDateStringWithTimezone(
        new Date(slot.start),
        timezone,
      );

      return slotDateString === dateString;
    });

    return filteredSlots.map(
      (slot: { start: string | Date; available: boolean }) => {
        const slotTime = new Date(slot.start);

        // Use Intl.DateTimeFormat to properly convert UTC time to user timezone
        const timeFormatter = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        const displayFormatter = new Intl.DateTimeFormat(locale, {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: !!locale.startsWith("en"), // Use 12-hour for English locales
        });

        const displayTime = timeFormatter.format(slotTime);
        const formattedTime = displayFormatter.format(slotTime);

        return {
          time: displayTime,
          available: Boolean(slot.available),
          formatted: formattedTime,
        };
      },
    );
  }

  /**
   * Process availability slots by date with timezone consideration
   * Returns a map of date strings to availability summaries
   */
  processAvailabilityByDate(
    request: AvailabilityProcessingRequest,
  ): Map<string, DateAvailability> {
    const { availabilitySlots, timezone } = request;
    const dateMap = new Map<string, DateAvailability>();

    availabilitySlots.forEach(
      (slot: { start: string | Date; available: boolean }) => {
        // Use centralized utility for consistent date formatting
        const startDate =
          slot.start instanceof Date ? slot.start : new Date(slot.start);
        const dateKey = formatSingleDateStringWithTimezone(startDate, timezone);

        const current = dateMap.get(dateKey) || { available: 0, total: 0 };

        current.total += 1;
        if (slot.available) {
          current.available += 1;
        }

        dateMap.set(dateKey, current);
      },
    );

    return dateMap;
  }

  /**
   * Get date availability for a specific date
   * Returns availability summary for the given date
   */
  getDateAvailability(request: DateAvailabilityRequest): DateAvailability {
    const { date, availabilityMap, timezone } = request;
    // Use centralized utility for consistent date formatting
    const dateString = formatSingleDateStringWithTimezone(date, timezone);
    return availabilityMap.get(dateString) || { available: 0, total: 0 };
  }

  /**
   * Check if a date has available slots
   * Returns true if the date has at least one available slot
   */
  isDateAvailable(request: DateAvailabilityRequest): boolean {
    const availability = this.getDateAvailability(request);
    return availability.available > 0;
  }

  /**
   * Check if two dates are the same day
   * Returns true if both dates represent the same calendar day
   */
  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  /**
   * Check if a date is today
   * Returns true if the date is today
   */
  isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDate(date, today);
  }

  /**
   * Check if a date is in the past
   * Returns true if the date is before today
   */
  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  }

  /**
   * Check if a date is in the current month
   * Returns true if the date is in the specified month/year
   */
  isDateInMonth(date: Date, month: number, year: number): boolean {
    return date.getMonth() === month && date.getFullYear() === year;
  }

  /**
   * Generate calendar days for a month view
   * Returns an array of 42 dates (6 weeks) for calendar display
   */
  generateCalendarDays(request: CalendarDaysRequest): Date[] {
    const { year, month, weekStart } = request;
    const firstDay = new Date(year, month, 1);
    const start = new Date(firstDay);

    // Calculate offset based on week start preference
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    let offset = firstDayOfWeek - weekStart;
    if (offset < 0) {
      offset += 7; // Handle negative offset
    }
    start.setDate(start.getDate() - offset);

    const days = [];
    const current = new Date(start);

    // Generate 42 days (6 weeks) for a complete calendar grid
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }

  /**
   * Check if navigation to previous month is allowed
   * Returns true if the previous month is not in the past
   */
  canNavigateToPreviousMonth(currentMonth: Date): boolean {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const today = new Date();
    return (
      prevMonth.getFullYear() > today.getFullYear() ||
      (prevMonth.getFullYear() === today.getFullYear() &&
        prevMonth.getMonth() >= today.getMonth())
    );
  }

  /**
   * Check if navigation to next month is allowed
   * Returns true if the next month is within the booking window
   */
  canNavigateToNextMonth(request: MonthNavigationRequest): boolean {
    const { currentMonth, maxMonthsAhead = 6 } = request;
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + maxMonthsAhead);
    return nextMonth <= maxDate;
  }

  /**
   * Process business data completion status
   * Returns processed completion data for UI components
   */
  processBusinessDataCompletion(
    businessDataCompletionStatus: BusinessDataCompletionStatus | null,
  ): ProcessedBusinessDataCompletion {
    // Don't show if no business data status available
    if (!businessDataCompletionStatus?.completionStatus) {
      return {
        shouldShow: false,
        isComplete: false,
        completionPercentage: 0,
        showCompleteMessage: false,
        showPrompt: false,
      };
    }

    const { overall } = businessDataCompletionStatus.completionStatus;
    const completionPercentage = overall.completionPercentage;
    const isComplete = overall.isComplete;

    // If business data is complete, show completion message
    if (isComplete) {
      return {
        shouldShow: true,
        isComplete: true,
        completionPercentage,
        showCompleteMessage: true,
        showPrompt: false,
      };
    }

    // If incomplete, show completion prompt
    return {
      shouldShow: true,
      isComplete: false,
      completionPercentage,
      showCompleteMessage: false,
      showPrompt: true,
    };
  }
}

// Export singleton instance
export const clientConsultationRepository =
  new ClientConsultationRepositoryImpl();
