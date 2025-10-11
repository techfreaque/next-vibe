/**
 * Consultation Availability Repository
 * Action-specific repository for availability checking operations
 */

import "server-only";

import { isSameDay } from "date-fns";
import { and, gte, lte } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { generateBusinessTimeSlots } from "@/i18n/core/localization-utils";

import type { JwtPrivatePayloadType } from "../../user/auth/definition";
import {
  CONSULTATION_CONFIG,
  CONSULTATION_DURATION,
} from "../consultation-config/repository";
import { consultations } from "../db";
import {
  availabilitySimulationRepository,
  weekdayRepository,
} from "../repository";
import type {
  ConsultationAvailabilityRequestTypeOutput,
  ConsultationAvailabilityResponseTypeOutput,
} from "./definition";

/**
 * Consultation Availability Repository Interface
 * Defines contract for availability checking operations
 */
export interface ConsultationAvailabilityRepository {
  /**
   * Get available consultation slots for a date range
   */
  getAvailableSlots(
    data: ConsultationAvailabilityRequestTypeOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationAvailabilityResponseTypeOutput>>;

  /**
   * Get availability for current and next month (convenience method)
   */
  getMonthlyAvailability(
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationAvailabilityResponseTypeOutput>>;
}

/**
 * Consultation Availability Repository Implementation
 * Implements availability checking with proper error handling
 */
export class ConsultationAvailabilityRepositoryImpl
  implements ConsultationAvailabilityRepository
{
  /**
   * Get available consultation slots for a date range
   */
  async getAvailableSlots(
    data: ConsultationAvailabilityRequestTypeOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationAvailabilityResponseTypeOutput>> {
    try {
      const timezone = "UTC"; // Default timezone - could be extended to use user preferences or data.timezone

      logger.debug("app.api.v1.core.consultation.availability.debug.getting", {
        startDate: data.startDate,
        endDate: data.endDate,
        userId: user.isPublic ? undefined : user.id,
        timezone,
      });

      // Parse the start and end dates
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      if (
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
      ) {
        return createErrorResponse(
          "app.api.v1.core.consultation.availability.errors.validation.description",
          ErrorResponseTypes.VALIDATION_ERROR,
          { startDate: data.startDate, endDate: data.endDate },
        );
      }

      // Generate time slots between start and end dates
      const slots = [];
      const slotDuration = data.slotDurationMinutes || 60;

      // Get all existing consultations in the date range for better performance
      const existingConsultations = await db
        .select()
        .from(consultations)
        .where(
          and(
            gte(consultations.preferredDate, startDate),
            lte(consultations.preferredDate, endDate),
          ),
        );

      // Create a map of booked dates and times for quick lookup
      const bookedSlotsMap = new Map<string, Set<string>>();
      existingConsultations.forEach(
        (consultation: {
          preferredDate: Date | null;
          preferredTime: string | null;
        }) => {
          if (consultation.preferredDate && consultation.preferredTime) {
            const dateKey = consultation.preferredDate
              .toISOString()
              .split("T")[0];
            if (!bookedSlotsMap.has(dateKey)) {
              bookedSlotsMap.set(dateKey, new Set());
            }
            bookedSlotsMap.get(dateKey)?.add(consultation.preferredTime);
          }
        },
      );

      // Generate slots for each day between start and end dates
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        // Skip non-working days using the new enum system
        if (!weekdayRepository.isWorkingDay(currentDate)) {
          currentDate.setDate(currentDate.getDate() + 1);
          continue;
        }

        // Skip dates in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (currentDate < today) {
          currentDate.setDate(currentDate.getDate() + 1);
          continue;
        }

        // Skip dates that don't meet minimum business days requirement
        const minBookingDate = weekdayRepository.getMinimumBookingDate(
          CONSULTATION_CONFIG.minBookingBusinessDaysAhead,
        );
        if (currentDate < minBookingDate) {
          currentDate.setDate(currentDate.getDate() + 1);
          continue;
        }

        const dateKey = currentDate.toISOString().split("T")[0];
        const bookedTimes = bookedSlotsMap.get(dateKey) || new Set();

        // Generate timezone-aware time slots for this day
        const timezoneSlots = generateBusinessTimeSlots(
          locale,
          timezone,
          currentDate,
        );

        // Extract time strings for simulation (using user timezone format)
        const daySlots = timezoneSlots.map(
          (slot: { time: string; utcTime: Date }) => slot.time,
        );

        // Apply random booking simulation if availability is too high
        const simulatedBookings =
          availabilitySimulationRepository.applySimulationToDay(
            daySlots,
            bookedTimes,
            CONSULTATION_CONFIG.highAvailabilityThreshold,
            CONSULTATION_CONFIG.randomBookingSeed + currentDate.getDate(), // Vary seed by date
            new Date(currentDate), // Pass the current date for dynamic availability calculation
          );

        // Combine real bookings with simulated bookings
        const allBookedTimes = new Set([...bookedTimes, ...simulatedBookings]);

        // Generate slots for this day using timezone-aware slots
        for (const slotInfo of timezoneSlots) {
          const { time: timeSlot, utcTime } = slotInfo;

          // Skip slots in the past for today
          if (isSameDay(currentDate, new Date()) && utcTime <= new Date()) {
            continue;
          }

          const slotEnd = new Date(utcTime);
          slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

          slots.push({
            start: utcTime,
            end: slotEnd,
            available: !allBookedTimes.has(timeSlot),
          });
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      logger.debug(
        "app.api.v1.core.consultation.availability.debug.generated",
        {
          totalSlots: slots.length,
          availableCount: slots.filter((slot) => slot.available).length,
        },
      );

      return createSuccessResponse({
        slots,
        timezone: timezone,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error(
        "app.api.v1.core.consultation.availability.errors.server.description",
        { error: parsedError.message },
      );

      return createErrorResponse(
        "app.api.v1.core.consultation.availability.errors.server.description",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Get availability for current and next month (convenience method)
   */
  async getMonthlyAvailability(
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationAvailabilityResponseTypeOutput>> {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    endDate.setHours(23, 59, 59, 999);

    return await this.getAvailableSlots(
      {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        slotDurationMinutes: CONSULTATION_DURATION.maxDurationMinutes,
      },
      user,
      locale,
      logger,
    );
  }
}

/**
 * Export repository instance
 */
export const consultationAvailabilityRepository =
  new ConsultationAvailabilityRepositoryImpl();
