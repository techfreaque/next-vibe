/**
 * Consultation Schedule Repository
 * Action-specific repository for consultation scheduling operations
 */

import "server-only";

import { eq } from "drizzle-orm";
import { withTransaction } from "next-vibe/server/db/repository-helpers";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { LeadTrackingRepository } from "@/app/api/[locale]/v1/core/leads/tracking/repository";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";
import type { ExtendedUserDetailLevel } from "@/app/api/[locale]/v1/core/user/definition";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";

import { consultations } from "../db";
import { ConsultationStatus } from "../enum";
import type {
  ConsultationScheduleRequestTypeOutput,
  ConsultationScheduleResponseTypeOutput,
} from "./definition";

/**
 * Consultation Schedule Repository Interface
 * Defines contract for consultation scheduling operations
 */
export interface ConsultationScheduleRepository {
  /**
   * Schedule a consultation with specific date/time and meeting details
   */
  scheduleConsultation(
    data: ConsultationScheduleRequestTypeOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationScheduleResponseTypeOutput>>;

  /**
   * Simple consultation scheduling (legacy version from main repository)
   */
  scheduleSimpleConsultation(
    userId: string,
    data: { date: string; time: string; contactPhone?: string },
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ consultationId: string }>>;
}

/**
 * Consultation Schedule Repository Implementation
 * Implements consultation scheduling with proper error handling
 */
export class ConsultationScheduleRepositoryImpl
  implements ConsultationScheduleRepository
{
  /**
   * Schedule a consultation with specific date/time and meeting details
   */
  async scheduleConsultation(
    data: ConsultationScheduleRequestTypeOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationScheduleResponseTypeOutput>> {
    try {
      logger.debug("Scheduling consultation", { data, locale });

      // First check if consultation exists
      const existingConsultation = await db
        .select()
        .from(consultations)
        .where(eq(consultations.id, data.consultationId))
        .limit(1);

      if (existingConsultation.length === 0) {
        return createErrorResponse(
          "app.api.v1.core.consultation.schedule.errors.notFound.description",
          ErrorResponseTypes.NOT_FOUND,
          { consultationId: data.consultationId },
        );
      }

      const consultation = existingConsultation[0];

      // Check if consultation is in a state that can be scheduled
      if (
        consultation.status === ConsultationStatus.COMPLETED ||
        consultation.status === ConsultationStatus.CANCELLED
      ) {
        return createErrorResponse(
          "app.api.v1.core.consultation.schedule.errors.conflict.description",
          ErrorResponseTypes.CONFLICT,
          {
            consultationId: data.consultationId,
            currentStatus: consultation.status,
          },
        );
      }

      // Parse the scheduled date
      const scheduledDate = new Date(data.scheduledDate);
      if (Number.isNaN(scheduledDate.getTime())) {
        return createErrorResponse(
          "app.api.v1.core.consultation.schedule.errors.validation.description",
          ErrorResponseTypes.VALIDATION_ERROR,
          { scheduledDate: data.scheduledDate },
        );
      }

      // Prepare update data
      const updateData: Partial<typeof consultations.$inferInsert> = {
        status: ConsultationStatus.SCHEDULED,
        scheduledDate,
        scheduledTime: data.scheduledTime || null,
        meetingLink: data.meetingLink || null,
        calendarEventId: data.calendarEventId || null,
        icsAttachment: data.icsAttachment || null,
        isNotified: false, // Reset notification status
        updatedAt: new Date(),
      };

      // Update the consultation
      const updatedConsultations = await db
        .update(consultations)
        .set(updateData)
        .where(eq(consultations.id, data.consultationId))
        .returning();

      if (updatedConsultations.length === 0) {
        return createErrorResponse(
          "app.api.v1.core.consultation.schedule.errors.server.description",
          ErrorResponseTypes.INTERNAL_ERROR,
          { consultationId: data.consultationId },
        );
      }

      const updatedConsultation = updatedConsultations[0];

      logger.debug("Consultation scheduled successfully", {
        consultationId: updatedConsultation.id,
        scheduledDate: updatedConsultation.scheduledDate,
        status: updatedConsultation.status,
      });

      return createSuccessResponse({
        id: updatedConsultation.id,
        status: updatedConsultation.status,
        scheduledDate:
          updatedConsultation.scheduledDate?.toISOString() ||
          data.scheduledDate,
        scheduledTime: updatedConsultation.scheduledTime,
        meetingLink: updatedConsultation.meetingLink,
        calendarEventId: updatedConsultation.calendarEventId,
        icsAttachment: updatedConsultation.icsAttachment,
        isNotified: updatedConsultation.isNotified,
        updatedAt: updatedConsultation.updatedAt.toISOString(),
      });
    } catch (error) {
      logger.error("Error scheduling consultation", error);
      const parsedError = parseError(error);

      return createErrorResponse(
        "app.api.v1.core.consultation.schedule.errors.server.description",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  /**
   * Simple consultation scheduling (legacy version from main repository)
   */
  async scheduleSimpleConsultation(
    userId: string,
    data: { date: string; time: string; contactPhone?: string },
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ consultationId: string }>> {
    try {
      return await withTransaction(logger, async () => {
        // Check permissions - only allow access to own data
        const currentUserId = authRepository.requireUserId(user);
        if (currentUserId !== userId) {
          return createErrorResponse(
            "common.error.unauthorized",
            ErrorResponseTypes.UNAUTHORIZED,
            { userId },
          );
        }

        logger.debug("Scheduling consultation", { userId, data });

        // Parse date and time
        const consultationDate = new Date(data.date);
        const [hours, minutes] = data.time.split(":").map(Number);
        const consultationTime = new Date(consultationDate);
        consultationTime.setHours(hours, minutes, 0, 0);

        if (
          Number.isNaN(consultationDate.getTime()) ||
          Number.isNaN(consultationTime.getTime())
        ) {
          return createErrorResponse(
            "error.errorTypes.validation_error",
            ErrorResponseTypes.VALIDATION_ERROR,
            { date: data.date, time: data.time },
          );
        }

        const consultationTimeString =
          typeof consultationTime === "string"
            ? consultationTime
            : `${consultationTime.getHours().toString().padStart(2, "0")}:${consultationTime.getMinutes().toString().padStart(2, "0")}`;

        // Check if the time slot is available
        const existingConsultations = await db
          .select()
          .from(consultations)
          .where(eq(consultations.preferredTime, consultationTimeString));

        if (existingConsultations.length > 0) {
          return createErrorResponse(
            "error.errorTypes.validation_error",
            ErrorResponseTypes.VALIDATION_ERROR,
            { date: data.date, time: data.time },
          );
        }

        // Store consultation in database
        const [consultation] = await db
          .insert(consultations)
          .values({
            userId,
            preferredDate: consultationDate,
            preferredTime: consultationTimeString,
            status: ConsultationStatus.SCHEDULED,
            isNotified: false,
          })
          .returning();

        if (!consultation) {
          return createErrorResponse(
            "error.errorTypes.database_error",
            ErrorResponseTypes.DATABASE_ERROR,
            { userId },
          );
        }

        // Track consultation booking for lead conversion metrics
        await this.trackConsultationBooking(userId, logger);

        return createSuccessResponse({
          consultationId: consultation.id,
        });
      });
    } catch (error) {
      logger.error("Error scheduling consultation:", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "error.errorTypes.database_error",
        ErrorResponseTypes.DATABASE_ERROR,
        { error: parsedError.message },
      );
    }
  }

  /**
   * Track consultation booking for lead conversion metrics
   * @param userId - User ID who booked the consultation
   */
  private async trackConsultationBooking(
    userId: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      logger.debug("Tracking consultation booking for lead metrics", {
        userId,
      });

      // Get user details to find associated lead
      const userResponse = await userRepository.getUserById(
        userId,
        "standard" as ExtendedUserDetailLevel,
        logger,
      );
      if (!userResponse.success) {
        logger.debug("User not found for consultation tracking", { userId });
        return;
      }

      const user = userResponse.data;

      // Only track if user has a leadId
      const leadId = user.leadId;

      if (!leadId) {
        logger.debug("No lead ID available for consultation tracking", {
          userId,
        });
        return;
      }

      // Track consultation booking
      const trackingResult =
        await LeadTrackingRepository.trackConsultationBooking(leadId);

      if (trackingResult.success) {
        logger.debug("Consultation booking tracked successfully", {
          userId,
          leadId,
          email: user.email,
        });
      } else {
        logger.debug("Failed to track consultation booking", {
          userId,
          leadId,
          error: trackingResult.message,
        });
      }
    } catch (error) {
      // Don't fail consultation creation if tracking fails
      logger.error("Error tracking consultation booking", {
        userId,
        error: parseError(error).message,
      });
    }
  }
}

/**
 * Export repository instance
 */
export const consultationScheduleRepository =
  new ConsultationScheduleRepositoryImpl();
