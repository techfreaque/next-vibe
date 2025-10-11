/**
 * Consultation Configuration Type Definitions
 * Defines types for consultation configuration business logic
 */

/**
 * Consultation configuration interface
 */
export interface ConsultationConfigData {
  maxBookingDaysAhead: number;
  minBookingHoursAhead: number;
  minBookingBusinessDaysAhead: number;
  businessStartHourUTC: number;
  businessEndHourUTC: number;
  highAvailabilityThreshold: number;
  randomBookingSeed: number;
}

/**
 * Business form time configuration interface
 */
export interface BusinessFormTimeData {
  completionTimeMinutes: number;
}

/**
 * Consultation duration configuration interface
 */
export interface ConsultationDurationData {
  minDurationMinutes: number;
  maxDurationMinutes: number;
}

/**
 * Complete consultation configuration
 */
export interface ConsultationConfigurationOutput {
  consultation: ConsultationConfigData;
  businessFormTime: BusinessFormTimeData;
  consultationDuration: ConsultationDurationData;
}
