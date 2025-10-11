/**
 * Client Consultation Repository Type Definitions
 * Defines types for client-side consultation business logic
 */

import type { CountryLanguage } from "@/i18n/core/config";

import type { ConsultationAvailabilityResponseTypeOutput } from "../availability/definition";

/**
 * Time slot interface for UI components
 */
export interface TimeSlot {
  time: string;
  available: boolean;
  formatted: string;
}

/**
 * Availability slot interface for calendar components
 */
export interface AvailabilitySlot {
  start: Date;
  end: Date;
  available: boolean;
}

/**
 * Date availability summary interface
 */
export interface DateAvailability {
  available: number;
  total: number;
}

/**
 * Business data completion status interface
 */
export interface BusinessDataCompletionStatus {
  completionStatus?: {
    overall: {
      completionPercentage: number;
      isComplete: boolean;
    };
  };
}

/**
 * Processed business data completion result
 */
export interface ProcessedBusinessDataCompletion {
  shouldShow: boolean;
  isComplete: boolean;
  completionPercentage: number;
  showCompleteMessage: boolean;
  showPrompt: boolean;
}

/**
 * Time slots for date request parameters
 */
export interface TimeSlotsForDateRequest {
  availabilityData: ConsultationAvailabilityResponseTypeOutput | null;
  date: Date;
  locale: CountryLanguage;
  timezone: string;
}

/**
 * Availability processing request parameters
 */
export interface AvailabilityProcessingRequest {
  availabilitySlots: AvailabilitySlot[];
  timezone: string;
}

/**
 * Date availability check request parameters
 */
export interface DateAvailabilityRequest {
  date: Date;
  availabilityMap: Map<string, DateAvailability>;
  timezone: string;
}

/**
 * Calendar days generation request parameters
 */
export interface CalendarDaysRequest {
  year: number;
  month: number;
  weekStart: number;
}

/**
 * Month navigation check request parameters
 */
export interface MonthNavigationRequest {
  currentMonth: Date;
  maxMonthsAhead?: number;
}
