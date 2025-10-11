/**
 * Consultation Repository
 * Repository-first architecture for consultation domain
 */

import type { UndefinedType } from "next-vibe/shared/types/common.schema";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { CONSULTATION_CONFIG } from "@/app/api/[locale]/v1/core/consultation/consultation-config/repository";
import {
  getBookingTimeLimits,
  isTimeWithinBusinessHours,
  parseDateTime,
} from "@/i18n/core/localization-utils";

import type { ISOWeekday, JSWeekday, WeekStartDay } from "./enum";
import { JSWeekdayValues } from "./enum";

/**
 * Booking limits interface
 */
export interface BookingLimits {
  minDate: Date;
  maxDate: Date;
}

/**
 * Weekday Repository Interface
 * Defines weekday-related operations
 */
export interface IWeekdayRepository {
  jsToISO(jsDay: keyof typeof JSWeekday | number): keyof typeof ISOWeekday;
  isoToJS(isoDay: keyof typeof ISOWeekday): keyof typeof JSWeekday;
  getWeekStartForCountry(country?: string): keyof typeof WeekStartDay;
  getLocalizedDayOrder(weekStart: keyof typeof WeekStartDay): number[];
  isWorkingDay(date: Date): boolean;
  getWorkingDays(): (keyof typeof ISOWeekday)[];
  getBusinessDaysBetween(startDate: Date, endDate: Date): number;
  addBusinessDays(date: Date, businessDays: number): Date;
  getMinimumBookingDate(businessDaysAhead: number): Date;
}

/**
 * Consultation Validation Repository Interface
 * Defines consultation validation operations
 */
export interface IConsultationValidationRepository {
  getBookingLimits(): BookingLimits;
  isDateValidForBooking(date: Date): boolean;
  parseDateTime(date: string, time: string): Date | null;
  validateBookingTime(
    date: string,
    time: string,
    timezone: string,
  ): ResponseType<UndefinedType>;
}

/**
 * Availability Simulation Repository Interface
 * Defines availability simulation operations
 */
export interface IAvailabilitySimulationRepository {
  simulateRandomBookings(
    availableSlots: string[],
    availabilityThreshold: number,
    seed: number,
  ): Set<string>;
  applySimulationToDay(
    daySlots: string[],
    existingBookedSlots: Set<string>,
    baseAvailabilityThreshold: number,
    seed: number,
    date: Date,
  ): Set<string>;
}

/**
 * Weekday Repository Implementation
 */
export class WeekdayRepository implements IWeekdayRepository {
  /**
   * Convert JavaScript getDay() to ISO weekday
   * JS: 0=Sunday, 1=Monday, ..., 6=Saturday
   * ISO: 1=Monday, 2=Tuesday, ..., 7=Sunday
   */
  jsToISO(jsDay: keyof typeof JSWeekday | number): keyof typeof ISOWeekday {
    // Convert numeric day to JSWeekday key
    const dayKey =
      typeof jsDay === "number"
        ? (Object.keys(JSWeekdayValues).find(
            (key) =>
              JSWeekdayValues[key as keyof typeof JSWeekdayValues] === jsDay,
          ) as keyof typeof JSWeekday)
        : jsDay;

    switch (dayKey) {
      case "SUNDAY":
        return "SUNDAY";
      case "MONDAY":
        return "MONDAY";
      case "TUESDAY":
        return "TUESDAY";
      case "WEDNESDAY":
        return "WEDNESDAY";
      case "THURSDAY":
        return "THURSDAY";
      case "FRIDAY":
        return "FRIDAY";
      case "SATURDAY":
        return "SATURDAY";
      default:
        // This should never happen with proper enum usage
        return "MONDAY"; // Default fallback
    }
  }

  /**
   * Convert ISO weekday to JavaScript getDay()
   * ISO: 1=Monday, 2=Tuesday, ..., 7=Sunday
   * JS: 0=Sunday, 1=Monday, ..., 6=Saturday
   */
  isoToJS(isoDay: keyof typeof ISOWeekday): keyof typeof JSWeekday {
    switch (isoDay) {
      case "SUNDAY":
        return "SUNDAY";
      case "MONDAY":
        return "MONDAY";
      case "TUESDAY":
        return "TUESDAY";
      case "WEDNESDAY":
        return "WEDNESDAY";
      case "THURSDAY":
        return "THURSDAY";
      case "FRIDAY":
        return "FRIDAY";
      case "SATURDAY":
        return "SATURDAY";
      default:
        // This should never happen with proper enum usage
        return "SUNDAY"; // Default fallback
    }
  }

  /**
   * Get week start day for a given country
   */
  getWeekStartForCountry(country?: string): keyof typeof WeekStartDay {
    // Most European countries start on Monday
    if (country === "DE" || country === "PL" || country === "AT") {
      return "MONDAY";
    }
    // US and international default to Sunday
    return "SUNDAY";
  }

  /**
   * Get localized day order based on week start preference
   * Returns array of day indices in the correct order for calendar display
   */
  getLocalizedDayOrder(weekStart: keyof typeof WeekStartDay): number[] {
    if (weekStart === "MONDAY") {
      // Monday first: [1, 2, 3, 4, 5, 6, 0]
      return [1, 2, 3, 4, 5, 6, 0];
    }
    // Sunday first: [0, 1, 2, 3, 4, 5, 6]
    return [0, 1, 2, 3, 4, 5, 6];
  }

  /**
   * Check if a day is a working day (Monday-Friday in ISO format)
   */
  isWorkingDay(date: Date): boolean {
    const jsDay = date.getDay();
    // Monday to Friday in JS format is 1-5
    return jsDay >= 1 && jsDay <= 5;
  }

  /**
   * Get working days in ISO format (Monday=1 to Friday=5)
   */
  getWorkingDays(): (keyof typeof ISOWeekday)[] {
    return ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
  }

  /**
   * Calculate the number of business days between two dates (exclusive of end date)
   */
  getBusinessDaysBetween(startDate: Date, endDate: Date): number {
    let businessDays = 0;
    const current = new Date(startDate);

    // Ensure we're working with date-only comparisons
    current.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    while (current < end) {
      if (this.isWorkingDay(current)) {
        businessDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return businessDays;
  }

  /**
   * Add business days to a date
   */
  addBusinessDays(date: Date, businessDays: number): Date {
    const result = new Date(date);
    let daysAdded = 0;

    while (daysAdded < businessDays) {
      result.setDate(result.getDate() + 1);
      if (this.isWorkingDay(result)) {
        daysAdded++;
      }
    }

    return result;
  }

  /**
   * Get the minimum booking date based on business days ahead requirement
   */
  getMinimumBookingDate(businessDaysAhead: number): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.addBusinessDays(today, businessDaysAhead);
  }
}

/**
 * Consultation Validation Repository Implementation
 */
export class ConsultationValidationRepository
  implements IConsultationValidationRepository
{
  constructor(private weekdayRepository: IWeekdayRepository) {}

  /**
   * Get booking date limits
   * Returns minimum and maximum dates for consultation booking
   * Now uses centralized utility with additional business logic
   */
  getBookingLimits(): BookingLimits {
    // Get base limits from centralized utility
    const baseLimits = getBookingTimeLimits(
      CONSULTATION_CONFIG.minBookingHoursAhead,
      CONSULTATION_CONFIG.maxBookingDaysAhead / 30, // Convert days to months
    );

    // Apply additional business logic for minimum business days
    const minBusinessDayDate = this.weekdayRepository.getMinimumBookingDate(
      CONSULTATION_CONFIG.minBookingBusinessDaysAhead,
    );

    // Use the later of the centralized minimum or business day requirement
    const minDate =
      minBusinessDayDate > baseLimits.minDate
        ? minBusinessDayDate
        : baseLimits.minDate;

    return {
      minDate,
      maxDate: baseLimits.maxDate,
    };
  }

  /**
   * Check if a date is valid for booking (without time validation)
   * This is used by the calendar to determine which dates should be disabled
   */
  isDateValidForBooking(date: Date): boolean {
    try {
      // Get booking limits
      const { minDate, maxDate } = this.getBookingLimits();

      // Check if date is within allowed range
      if (date < minDate || date > maxDate) {
        return false;
      }

      // Check if it's a working day
      if (!this.weekdayRepository.isWorkingDay(date)) {
        return false;
      }

      // Check if it meets minimum business days requirement
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const bookingDate = new Date(date);
      bookingDate.setHours(0, 0, 0, 0);

      const businessDaysBetween = this.weekdayRepository.getBusinessDaysBetween(
        today,
        bookingDate,
      );
      if (
        businessDaysBetween < CONSULTATION_CONFIG.minBookingBusinessDaysAhead
      ) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Parse date and time strings into a Date object
   * Returns null if parsing fails
   * Now uses centralized utility for consistency
   */
  parseDateTime(date: string, time: string): Date | null {
    // Use the centralized parsing utility
    return parseDateTime(date, time);
  }

  /**
   * Validate booking time against business rules
   * Returns validation result with error message if invalid
   */
  validateBookingTime(
    date: string,
    time: string,
    timezone: string,
  ): ResponseType<UndefinedType> {
    try {
      const bookingDateTime = this.parseDateTime(date, time);
      if (!bookingDateTime) {
        return createErrorResponse(
          "validationErrors.consultation.invalid_date_time",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      // Get booking limits
      const { minDate, maxDate } = this.getBookingLimits();

      // Check if date is within allowed range
      if (bookingDateTime < minDate) {
        return createErrorResponse(
          "validationErrors.consultation.booking_too_early",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      if (bookingDateTime > maxDate) {
        return createErrorResponse(
          "validationErrors.consultation.booking_too_far",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      // Check if it's a working day using the new enum system
      if (!this.weekdayRepository.isWorkingDay(bookingDateTime)) {
        return createErrorResponse(
          "validationErrors.consultation.non_working_day",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      // Check if it meets minimum business days requirement
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const bookingDate = new Date(bookingDateTime);
      bookingDate.setHours(0, 0, 0, 0);

      const businessDaysBetween = this.weekdayRepository.getBusinessDaysBetween(
        today,
        bookingDate,
      );
      if (
        businessDaysBetween < CONSULTATION_CONFIG.minBookingBusinessDaysAhead
      ) {
        return createErrorResponse(
          "validationErrors.consultation.insufficient_business_days_notice",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      // Check if it's within business hours using centralized utility
      // Pass timezone information for proper validation
      if (!isTimeWithinBusinessHours(time, timezone, bookingDateTime)) {
        return createErrorResponse(
          "validationErrors.consultation.outside_business_hours",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      return createSuccessResponse(undefined);
    } catch {
      return createErrorResponse(
        "validationErrors.consultation.invalid_date_time",
        ErrorResponseTypes.VALIDATION_ERROR,
      );
    }
  }
}

/**
 * Availability Simulation Repository Implementation
 */
export class AvailabilitySimulationRepository
  implements IAvailabilitySimulationRepository
{
  constructor(private weekdayRepository: IWeekdayRepository) {}

  private seededRandom(seed: number): () => number {
    let state = seed;
    return () => {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    };
  }

  /**
   * Calculate dynamic availability target based on day characteristics
   */
  private calculateDynamicAvailabilityTarget(
    date: Date,
    baseThreshold: number,
    seed: number,
  ): number {
    const random = this.seededRandom(seed);

    // Day of week patterns (Monday = 1, Sunday = 7)
    const dayOfWeek = this.weekdayRepository.jsToISO(date.getDay());
    let dayMultiplier = 1.0;

    switch (dayOfWeek) {
      case "MONDAY":
        dayMultiplier = 0.6; // Mondays are busier (40% availability)
        break;
      case "TUESDAY":
        dayMultiplier = 0.7; // Tuesdays moderately busy (56% availability)
        break;
      case "WEDNESDAY":
        dayMultiplier = 0.8; // Wednesdays normal (64% availability)
        break;
      case "THURSDAY":
        dayMultiplier = 0.75; // Thursdays slightly busy (60% availability)
        break;
      case "FRIDAY":
        dayMultiplier = 0.9; // Fridays more available (72% availability)
        break;
      default:
        dayMultiplier = 1.0; // Weekends (not used but fallback)
    }

    // Distance from today factor (closer dates are busier)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysDifference = Math.floor(
      (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    let distanceMultiplier = 1.0;
    if (daysDifference <= 7) {
      distanceMultiplier = 0.6; // Next week is busier
    } else if (daysDifference <= 14) {
      distanceMultiplier = 0.75; // Two weeks out
    } else if (daysDifference <= 30) {
      distanceMultiplier = 0.85; // Next month
    } else {
      distanceMultiplier = 0.95; // Further out has more availability
    }

    // Add random variation (±20%)
    const randomVariation = 0.8 + random() * 0.4; // 0.8 to 1.2

    // Combine all factors
    const dynamicTarget =
      baseThreshold * dayMultiplier * distanceMultiplier * randomVariation;

    // Ensure we stay within reasonable bounds (20% to 95% availability)
    return Math.max(0.2, Math.min(0.95, dynamicTarget));
  }

  /**
   * Simulate random bookings when availability is too high
   * Returns a set of time slots that should be marked as booked
   */
  simulateRandomBookings(
    availableSlots: string[],
    availabilityThreshold: number,
    seed: number,
  ): Set<string> {
    const totalSlots = availableSlots.length;
    if (totalSlots === 0) {
      return new Set();
    }

    const availabilityRatio = 1; // All slots are available initially

    // Only simulate bookings if availability is above threshold
    if (availabilityRatio <= availabilityThreshold) {
      return new Set();
    }

    // Calculate how many slots to book to bring availability down to threshold
    const targetAvailableSlots = Math.floor(totalSlots * availabilityThreshold);
    const slotsToBook = totalSlots - targetAvailableSlots;

    if (slotsToBook <= 0) {
      return new Set();
    }

    // Use seeded random to ensure consistent results
    const random = this.seededRandom(seed);
    const bookedSlots = new Set<string>();
    const shuffledSlots = [...availableSlots];

    // Fisher-Yates shuffle with seeded random
    for (let i = shuffledSlots.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [shuffledSlots[i], shuffledSlots[j]] = [
        shuffledSlots[j],
        shuffledSlots[i],
      ];
    }

    // Take the first N slots to book
    for (let i = 0; i < Math.min(slotsToBook, shuffledSlots.length); i++) {
      bookedSlots.add(shuffledSlots[i]);
    }

    return bookedSlots;
  }

  /**
   * Apply random booking simulation to a day's slots with dynamic availability
   */
  applySimulationToDay(
    daySlots: string[],
    existingBookedSlots: Set<string>,
    baseAvailabilityThreshold: number,
    seed: number,
    date: Date,
  ): Set<string> {
    // Get available slots (not already booked)
    const availableSlots = daySlots.filter(
      (slot) => !existingBookedSlots.has(slot),
    );

    // Calculate current availability ratio
    const availabilityRatio = availableSlots.length / daySlots.length;

    // Calculate dynamic availability target for this specific day
    const dynamicThreshold = this.calculateDynamicAvailabilityTarget(
      date,
      baseAvailabilityThreshold,
      seed,
    );

    // Only simulate if availability is above the dynamic threshold
    if (availabilityRatio <= dynamicThreshold) {
      return new Set();
    }

    // Generate random bookings for this day using the dynamic threshold
    const randomBookings = this.simulateRandomBookings(
      availableSlots,
      dynamicThreshold,
      seed,
    );

    return randomBookings;
  }
}

// Export singleton instances
export const weekdayRepository = new WeekdayRepository();
export const consultationValidationRepository =
  new ConsultationValidationRepository(weekdayRepository);
export const availabilitySimulationRepository =
  new AvailabilitySimulationRepository(weekdayRepository);

// Export AvailabilitySimulator alias for backward compatibility
export const AvailabilitySimulator = AvailabilitySimulationRepository;
