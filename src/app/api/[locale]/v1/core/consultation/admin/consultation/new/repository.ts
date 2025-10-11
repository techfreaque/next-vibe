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

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { LeadSource } from "../../../../leads/enum";
import { leadsRepository } from "../../../../leads/repository";
import type { JwtPrivatePayloadType } from "../../../../user/auth/definition";
import { users } from "../../../../user/db";
import { consultations } from "../../../db";
import { ConsultationStatus } from "../../../enum";
import type {
  ConsultationCreatePostRequestTypeOutput,
  ConsultationCreatePostResponseTypeOutput,
} from "./definition";
import { SelectionType } from "./enum";

/**
 * Consultation Admin New Repository Interface
 */
export interface ConsultationAdminNewRepository {
  createConsultation(
    data: ConsultationCreatePostRequestTypeOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationCreatePostResponseTypeOutput>>;
}

/**
 * Consultation Admin Repository Implementation
 */
export class ConsultationAdminNewRepositoryImpl
  implements ConsultationAdminNewRepository
{
  /**
   * Create consultation with expanded fields and email notifications
   */
  async createConsultation(
    data: ConsultationCreatePostRequestTypeOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationCreatePostResponseTypeOutput>> {
    try {
      logger.debug("Creating new admin consultation", { data });
      const { t } = simpleT(locale);

      let createdLeadId: string | null = null;

      // Create lead if selection type is CREATE_NEW_LEAD
      if (data.selectionType === SelectionType.CREATE_NEW_LEAD) {
        if (!data.name || !data.email || !data.businessType) {
          return createErrorResponse(
            "validationErrors.consultation.invalid_selection_type",
            ErrorResponseTypes.VALIDATION_ERROR,
            {
              missingFields: t(
                "consultations.admin.repository.requiredFieldsError",
              ),
            },
          );
        }

        const leadCreateResult = await leadsRepository.createLead(
          {
            businessName: data.businessName || data.businessType,
            email: data.email,
            phone: data.phone || undefined,
            website: data.website || undefined,
            country: data.country,
            language: data.language,
            source: LeadSource.WEBSITE,
            notes:
              [
                data.currentChallenges &&
                  `${t("consultations.admin.repository.notePrefixes.challenges")} ${data.currentChallenges}`,
                data.goals &&
                  `${t("consultations.admin.repository.notePrefixes.goals")} ${data.goals}`,
                data.targetAudience &&
                  `${t("consultations.admin.repository.notePrefixes.targetAudience")} ${data.targetAudience}`,
                data.existingAccounts &&
                  `${t("consultations.admin.repository.notePrefixes.existingAccounts")} ${data.existingAccounts}`,
                data.competitors &&
                  `${t("consultations.admin.repository.notePrefixes.competitors")} ${data.competitors}`,
                data.city &&
                  `${t("consultations.admin.repository.notePrefixes.city")} ${data.city}`,
              ]
                .filter(Boolean)
                .join("\n") || undefined,
          },
          user,
          locale,
          logger,
        );

        if (!leadCreateResult.success) {
          return leadCreateResult;
        }

        // Type assertion since we know the result is successful
        createdLeadId = (
          leadCreateResult as { success: true; data: { id: string } }
        ).data.id;
        logger.debug("Created new lead for consultation", {
          leadId: createdLeadId,
        });
      }

      // Prepare insert data based on selection type
      const insertData: typeof consultations.$inferInsert = {
        userId:
          data.selectionType === SelectionType.USER
            ? data.userId || null
            : null,
        leadId:
          data.selectionType === SelectionType.LEAD
            ? data.leadId || null
            : data.selectionType === SelectionType.CREATE_NEW_LEAD
              ? createdLeadId
              : null,
        status: data.status || ConsultationStatus.PENDING,
        preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
        preferredTime: data.preferredTime || null,
        message: data.message || null,
        isNotified: false, // Default to false
        scheduledDate: null, // Default to null
        scheduledTime: null, // Default to null
        calendarEventId: null, // Default to null
        meetingLink: null, // Default to null
        icsAttachment: null, // Default to null
      };

      // Create the consultation
      const [insertedConsultation] = await db
        .insert(consultations)
        .values(insertData)
        .returning({
          id: consultations.id,
          userId: consultations.userId,
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
        });

      // Get user information if userId is provided
      let userInfo = {
        userEmail: null as string | null,
        userName: null as string | null,
        userBusinessType: null as string | null,
        userContactPhone: null as string | null,
      };

      if (insertedConsultation.userId) {
        const [userResult] = await db
          .select({
            userEmail: users.email,
            userName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
            userBusinessType: users.company,
            userContactPhone: users.phone,
          })
          .from(users)
          .where(eq(users.id, insertedConsultation.userId));

        if (userResult) {
          userInfo = userResult;
        }
      }

      const response: ConsultationCreatePostResponseTypeOutput = {
        id: insertedConsultation.id,
        isNotified: insertedConsultation.isNotified,
        scheduledDate:
          insertedConsultation.scheduledDate?.toISOString() || null,
        scheduledTime: insertedConsultation.scheduledTime,
        calendarEventId: insertedConsultation.calendarEventId,
        meetingLink: insertedConsultation.meetingLink,
        icsAttachment: insertedConsultation.icsAttachment,
        createdAt: insertedConsultation.createdAt.toISOString(),
        updatedAt: insertedConsultation.updatedAt.toISOString(),
        ...userInfo,
      };

      return createSuccessResponse(response);
    } catch (error) {
      logger.error("Error creating consultation", parseError(error));
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
export const consultationAdminNewRepository =
  new ConsultationAdminNewRepositoryImpl();
