/**
 * Consultation Admin Repository
 * Handles database operations for consultation admin functionality
 */

import "server-only";

import { eq, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { leads } from "@/app/api/[locale]/v1/core/leads/db";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { users } from "@/app/api/[locale]/v1/core/user/db";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPrivatePayloadType } from "../../../../user/auth/definition";
import { consultations } from "../../../db";
import type {
  ConsultationGetResponseTypeOutput,
  ConsultationUpdateRequestTypeOutput,
  ConsultationUpdateResponseTypeOutput,
} from "./definition";

/**
 * Consultation Admin Repository Interface
 */
export interface ConsultationAdminRepository {
  getConsultationById(
    id: string,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationGetResponseTypeOutput>>;
  updateConsultation(
    id: string,
    data: ConsultationUpdateRequestTypeOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationUpdateResponseTypeOutput>>;
}

/**
 * Consultation Admin Repository Implementation
 */
export class ConsultationAdminRepositoryImpl
  implements ConsultationAdminRepository
{
  /**
   * Get consultation by ID with user information
   */
  async getConsultationById(
    id: string,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationGetResponseTypeOutput>> {
    try {
      logger.debug("Fetching consultation by ID", {
        id,
        userId: user.isPublic ? undefined : user.id,
      });

      const [consultationResult] = await db
        .select({
          id: consultations.id,
          userId: consultations.userId,
          leadId: consultations.leadId,
          status: consultations.status,
          preferredDate: consultations.preferredDate,
          preferredTime: consultations.preferredTime,
          message: consultations.message,
          isNotified: consultations.isNotified,
          scheduledDate: consultations.scheduledDate,
          scheduledTime: consultations.scheduledTime,
          calendarEventId: consultations.calendarEventId,
          meetingLink: consultations.meetingLink,
          icsAttachment: consultations.icsAttachment,
          createdAt: consultations.createdAt,
          updatedAt: consultations.updatedAt,
          userEmail: users.email,
          userName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
          userBusinessType: users.company,
          userContactPhone: users.phone,
          leadEmail: leads.email,
          leadBusinessName: leads.businessName,
          leadPhone: leads.phone,
        })
        .from(consultations)
        .leftJoin(users, eq(consultations.userId, users.id))
        .leftJoin(leads, eq(consultations.leadId, leads.id))
        .where(eq(consultations.id, id));

      if (!consultationResult) {
        return createErrorResponse(
          "consultations.admin.error.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      const response: ConsultationGetResponseTypeOutput = {
        userId: consultationResult.userId,
        leadId: consultationResult.leadId,
        status: consultationResult.status,
        message: consultationResult.message,
        userEmail: consultationResult.userEmail,
        userName: consultationResult.userName,
        userBusinessType: consultationResult.userBusinessType,
        userContactPhone: consultationResult.userContactPhone,
        preferredDate: consultationResult.preferredDate?.toISOString() || null,
        preferredTime: consultationResult.preferredTime,
        scheduledDate: consultationResult.scheduledDate?.toISOString() || null,
        scheduledTime: consultationResult.scheduledTime,
        calendarEventId: consultationResult.calendarEventId,
        meetingLink: consultationResult.meetingLink,
        icsAttachment: consultationResult.icsAttachment,
        isNotified: consultationResult.isNotified,
        createdAt: consultationResult.createdAt.toISOString(),
      };

      return createSuccessResponse(response);
    } catch (error) {
      logger.error("Error fetching consultation by ID", parseError(error));
      return createErrorResponse(
        "consultations.admin.error.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Update consultation by ID
   */
  async updateConsultation(
    id: string,
    data: ConsultationUpdateRequestTypeOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationUpdateResponseTypeOutput>> {
    try {
      logger.debug("Updating consultation", {
        id,
        userId: user.isPublic ? undefined : user.id,
        updateData: data,
      });

      // First check if consultation exists
      const existingConsultation = await this.getConsultationById(
        id,
        user,
        locale,
        logger,
      );
      if (!existingConsultation.success) {
        return existingConsultation as ResponseType<ConsultationUpdateResponseTypeOutput>;
      }

      // Prepare update data
      const updateData: Partial<typeof consultations.$inferInsert> = {};

      if (data.status !== undefined) {
        updateData.status = data.status;
      }
      if (data.scheduledDate !== undefined) {
        updateData.scheduledDate = data.scheduledDate
          ? new Date(data.scheduledDate)
          : null;
      }
      if (data.scheduledTime !== undefined) {
        updateData.scheduledTime = data.scheduledTime;
      }
      if (data.calendarEventId !== undefined) {
        updateData.calendarEventId = data.calendarEventId;
      }
      if (data.meetingLink !== undefined) {
        updateData.meetingLink = data.meetingLink;
      }
      if (data.icsAttachment !== undefined) {
        updateData.icsAttachment = data.icsAttachment;
      }
      if (data.isNotified !== undefined) {
        updateData.isNotified = data.isNotified;
      }
      if (data.message !== undefined) {
        updateData.message = data.message;
      }

      // Update the consultation
      await db
        .update(consultations)
        .set(updateData)
        .where(eq(consultations.id, id));

      // Return the updated consultation
      const updatedConsultation = await this.getConsultationById(
        id,
        user,
        locale,
        logger,
      );

      return updatedConsultation as ResponseType<ConsultationUpdateResponseTypeOutput>;
    } catch (error) {
      logger.error("Error updating consultation", parseError(error));
      return createErrorResponse(
        "consultations.admin.error.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}

/**
 * Export repository instance
 */
export const consultationUpdateAdminRepository =
  new ConsultationAdminRepositoryImpl();
