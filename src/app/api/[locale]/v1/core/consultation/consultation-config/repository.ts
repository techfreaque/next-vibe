/**
 * Consultation Configuration Repository
 * Repository-first architecture for consultation configuration business logic
 */

import type {
  BusinessFormTimeData,
  ConsultationConfigData,
  ConsultationConfigurationOutput,
  ConsultationDurationData,
} from "./types";

/**
 * Consultation Configuration Repository Interface
 */
export interface IConsultationConfigRepository {
  getConsultationConfig(): ConsultationConfigData;
  getBusinessFormTimeConfig(): BusinessFormTimeData;
  getConsultationDurationConfig(): ConsultationDurationData;
  getCompleteConfiguration(): ConsultationConfigurationOutput;
}

/**
 * Consultation Configuration Repository Implementation
 */
export class ConsultationConfigRepositoryImpl
  implements IConsultationConfigRepository
{
  /**
   * Get consultation configuration
   * Returns centralized consultation business logic constants
   */
  getConsultationConfig(): ConsultationConfigData {
    return {
      maxBookingDaysAhead: 180, // 6 months
      minBookingHoursAhead: 2, // Minimum 2 hours notice
      minBookingBusinessDaysAhead: 2, // Minimum 2 business days notice
      businessStartHourUTC: 7,
      businessEndHourUTC: 15,
      highAvailabilityThreshold: 0.7, // Base availability threshold (will be dynamically adjusted per day)
      randomBookingSeed: 42, // Seed for consistent random booking simulation
    };
  }

  /**
   * Get business form time configuration
   * Returns estimated time to complete business information forms
   */
  getBusinessFormTimeConfig(): BusinessFormTimeData {
    return {
      completionTimeMinutes: 15,
    };
  }

  /**
   * Get consultation duration configuration
   * Returns consultation duration limits
   */
  getConsultationDurationConfig(): ConsultationDurationData {
    return {
      minDurationMinutes: 15,
      maxDurationMinutes: 60,
    };
  }

  /**
   * Get complete configuration
   * Returns all configuration data in a single object
   */
  getCompleteConfiguration(): ConsultationConfigurationOutput {
    return {
      consultation: this.getConsultationConfig(),
      businessFormTime: this.getBusinessFormTimeConfig(),
      consultationDuration: this.getConsultationDurationConfig(),
    };
  }
}

// Export singleton instance
export const consultationConfigRepository =
  new ConsultationConfigRepositoryImpl();

// Export individual configuration getters for backward compatibility
export const CONSULTATION_CONFIG =
  consultationConfigRepository.getConsultationConfig();
export const BUSINESS_FORM_TIME =
  consultationConfigRepository.getBusinessFormTimeConfig();
export const CONSULTATION_DURATION =
  consultationConfigRepository.getConsultationDurationConfig();
