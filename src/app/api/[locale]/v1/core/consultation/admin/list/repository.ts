/**
 * Consultation Admin Repository
 * Handles database operations for consultation admin functionality
 */

import "server-only";

import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { users } from "@/app/api/[locale]/v1/core/user/db";
import type { CountryLanguage } from "@/i18n/core/config";

import { leads } from "../../../leads/db";
import type { JwtPrivatePayloadType } from "../../../user/auth/definition";
import { consultations } from "../../db";
import { ConsultationSortField, SortOrder } from "../../enum";
import type {
  ConsultationAdminListGetRequestTypeOutput,
  ConsultationAdminListGetResponseTypeOutput,
} from "./definition";

/**
 * Helper function to get sort column
 */
function getSortColumn(
  sortBy: (typeof ConsultationSortField)[keyof typeof ConsultationSortField],
):
  | typeof consultations.createdAt
  | typeof consultations.updatedAt
  | typeof consultations.preferredDate
  | typeof consultations.scheduledDate
  | typeof consultations.status
  | typeof users.email {
  switch (sortBy) {
    case ConsultationSortField.CREATED_AT:
      return consultations.createdAt;
    case ConsultationSortField.UPDATED_AT:
      return consultations.updatedAt;
    case ConsultationSortField.PREFERRED_DATE:
      return consultations.preferredDate;
    case ConsultationSortField.SCHEDULED_DATE:
      return consultations.scheduledDate;
    case ConsultationSortField.STATUS:
      return consultations.status;
    case ConsultationSortField.USER_EMAIL:
      return users.email;
    default:
      return consultations.createdAt;
  }
}

/**
 * Consultation Admin List Repository Interface
 */
export interface ConsultationAdminListRepository {
  getConsultations(
    data: ConsultationAdminListGetRequestTypeOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationAdminListGetResponseTypeOutput>>;
}

/**
 * Consultation Admin Repository Implementation
 */
export class ConsultationAdminListRepositoryImpl
  implements ConsultationAdminListRepository
{
  /**
   * Get paginated list of consultations with filtering and sorting
   */
  async getConsultations(
    data: ConsultationAdminListGetRequestTypeOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationAdminListGetResponseTypeOutput>> {
    try {
      logger.debug("Fetching consultations with data", {
        data,
        userId: user.isPublic ? undefined : user.id,
      });

      const {
        page = 1,
        limit = 20,
        search,
        status,
        sortBy,
        sortOrder,
        dateFrom,
        dateTo,
        userEmail,
      } = data;

      // Build where conditions
      const whereConditions = [];

      // Status filter (now handles array of statuses from multiselect)
      if (status && status.length > 0) {
        // Status values are already translation keys, use them directly
        whereConditions.push(
          or(...status.map((s) => eq(consultations.status, s))),
        );
      }

      // Search filter (message, user name, user email)
      if (search) {
        whereConditions.push(
          or(
            ilike(consultations.message, `%${search}%`),
            ilike(users.firstName, `%${search}%`),
            ilike(users.lastName, `%${search}%`),
            ilike(users.email, `%${search}%`),
            ilike(users.company, `%${search}%`),
          ),
        );
      }

      // User email filter
      if (userEmail) {
        whereConditions.push(eq(users.email, userEmail));
      }

      // Date range filters
      if (dateFrom) {
        whereConditions.push(
          sql`${consultations.createdAt} >= ${new Date(dateFrom)}`,
        );
      }
      if (dateTo) {
        whereConditions.push(
          sql`${consultations.createdAt} <= ${new Date(dateTo)}`,
        );
      }

      // Combine conditions
      const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Get total count
      const [totalResult] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(consultations)
        .leftJoin(users, eq(consultations.userId, users.id))
        .where(whereClause);

      const total = totalResult?.count || 0;
      const totalPages = Math.ceil(total / limit);
      const offset = (page - 1) * limit;

      // Get consultations with pagination
      const sortColumn = getSortColumn(
        sortBy || ConsultationSortField.CREATED_AT,
      );
      const sortDirection =
        sortOrder === SortOrder.ASC ? sortColumn : desc(sortColumn);

      const consultationResults = await db
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
        .where(whereClause)
        .orderBy(sortDirection)
        .limit(limit)
        .offset(offset);

      const consultationsList = consultationResults.map((consultation) => ({
        id: consultation.id,
        userId: consultation.userId,
        leadId: consultation.leadId,
        status: consultation.status,
        preferredDate: consultation.preferredDate?.toISOString() || null,
        preferredTime: consultation.preferredTime,
        message: consultation.message,
        isNotified: consultation.isNotified,
        scheduledDate: consultation.scheduledDate?.toISOString() || null,
        scheduledTime: consultation.scheduledTime,
        calendarEventId: consultation.calendarEventId,
        meetingLink: consultation.meetingLink,
        icsAttachment: consultation.icsAttachment,
        createdAt: consultation.createdAt.toISOString(),
        updatedAt: consultation.updatedAt.toISOString(),
        userEmail: consultation.userEmail,
        userName: consultation.userName,
        userBusinessType: consultation.userBusinessType,
        userContactPhone: consultation.userContactPhone,
        leadEmail: consultation.leadEmail,
        leadBusinessName: consultation.leadBusinessName,
        leadPhone: consultation.leadPhone,
      }));

      const response = {
        consultations: consultationsList,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };

      return createSuccessResponse(response);
    } catch (error) {
      logger.error("Error fetching consultations list", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.consultation.admin.list.get.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}

/**
 * Export repository instance
 */
export const consultationAdminListRepository =
  new ConsultationAdminListRepositoryImpl();
