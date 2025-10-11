/**
 * Consultation List Repository
 * Dedicated repository for consultation list endpoint
 */

import "server-only";

import { and, asc, desc, eq, inArray } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import { consultations } from "../db";
import { ConsultationSortField, SortOrder } from "../enum";
import type {
  ConsultationListRequestTypeOutput,
  ConsultationListResponseTypeInput,
} from "./definition";

/**
 * Consultation List Repository Interface
 */
export interface ConsultationListRepository {
  /**
   * Get consultations with filtering and pagination
   */
  getConsultations(
    userId: string,
    filters: ConsultationListRequestTypeOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationListResponseTypeInput>>;

  /**
   * Get all consultations for a user (simple version without filters)
   */
  getAllConsultations(
    userId: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      consultations: Array<{
        id: string;
        userId: string;
        preferredDate: Date | null;
        preferredTime: string | null;
        message: string | null;
        status: string;
        isNotified: boolean;
        scheduledDate: Date | null;
        scheduledTime: string | null;
        createdAt: Date;
        updatedAt: Date;
      }>;
      total: number;
    }>
  >;
}

/**
 * Consultation List Repository Implementation
 */
export class ConsultationListRepositoryImpl
  implements ConsultationListRepository
{
  /**
   * Get consultations with filtering and pagination
   */
  async getConsultations(
    userId: string,
    filters: ConsultationListRequestTypeOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationListResponseTypeInput>> {
    try {
      // Build query with filters
      const whereConditions = [
        eq(consultations.userId, filters.userId || userId),
      ];

      // Add status filter if provided (supports multiple statuses)
      if (filters.status && filters.status.length > 0) {
        // filters.status already contains the correct enum values (translation keys)
        // which match what the database expects
        whereConditions.push(inArray(consultations.status, filters.status));
      }

      // Build dynamic sorting
      const orderByClause = [];
      const sortFields = filters.sortBy || [ConsultationSortField.CREATED_AT];
      const sortOrders = filters.sortOrder || [SortOrder.DESC];

      for (let i = 0; i < sortFields.length; i++) {
        const field = sortFields[i];
        const order = sortOrders[i] || sortOrders[0] || "desc"; // Use first order if not enough orders provided

        const column = (():
          | typeof consultations.createdAt
          | typeof consultations.updatedAt
          | typeof consultations.preferredDate
          | typeof consultations.status => {
          switch (field) {
            case ConsultationSortField.CREATED_AT:
              return consultations.createdAt;
            case ConsultationSortField.UPDATED_AT:
              return consultations.updatedAt;
            case ConsultationSortField.PREFERRED_DATE:
              return consultations.preferredDate;
            case ConsultationSortField.STATUS:
              return consultations.status;
            default:
              return consultations.createdAt; // fallback
          }
        })();

        orderByClause.push(
          order === SortOrder.ASC ? asc(column) : desc(column),
        );
      }

      // Parse limit and offset with defaults
      const limit = filters.limit ? parseInt(filters.limit, 10) : 10;
      const offset = filters.offset ? parseInt(filters.offset, 10) : 0;

      // Execute query with all filters and dynamic sorting
      const userConsultations = await db
        .select()
        .from(consultations)
        .where(and(...whereConditions))
        .orderBy(...orderByClause)
        .limit(limit)
        .offset(offset);

      // Map to response format - only include fields defined in the endpoint
      const consultationsData = userConsultations
        .filter((consultation) => consultation.userId !== null)
        .map((consultation) => ({
          id: consultation.id,
          userId: consultation.userId!,
          preferredDate: consultation.preferredDate,
          preferredTime: consultation.preferredTime,
          status: consultation.status,
          createdAt: consultation.createdAt,
          updatedAt: consultation.updatedAt,
        }));

      return createSuccessResponse({
        consultations: consultationsData,
        total: consultationsData.length,
      });
    } catch (error) {
      logger.error("Error fetching consultations", { error });
      return createErrorResponse(
        "app.api.v1.core.consultation.list.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: String(error) },
      );
    }
  }

  /**
   * Get all consultations for a user (simple version without filters)
   */
  async getAllConsultations(
    userId: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      consultations: Array<{
        id: string;
        userId: string;
        preferredDate: Date | null;
        preferredTime: string | null;
        message: string | null;
        status: string;
        isNotified: boolean;
        scheduledDate: Date | null;
        scheduledTime: string | null;
        createdAt: Date;
        updatedAt: Date;
      }>;
      total: number;
    }>
  > {
    try {
      // Get consultations directly from database
      const userConsultations = await db
        .select()
        .from(consultations)
        .where(eq(consultations.userId, userId))
        .orderBy(desc(consultations.createdAt));

      const consultationsData = userConsultations
        .filter((consultation) => consultation.userId !== null)
        .map((consultation) => ({
          id: consultation.id,
          userId: consultation.userId!,
          preferredDate: consultation.preferredDate,
          preferredTime: consultation.preferredTime,
          message: consultation.message,
          status: consultation.status,
          isNotified: consultation.isNotified,
          scheduledDate: consultation.scheduledDate,
          scheduledTime: consultation.scheduledTime,
          createdAt: consultation.createdAt,
          updatedAt: consultation.updatedAt,
        }));

      return createSuccessResponse({
        consultations: consultationsData,
        total: consultationsData.length,
      });
    } catch (error) {
      logger.error("Error getting consultations:", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.consultation.list.errors.server.title",
        ErrorResponseTypes.DATABASE_ERROR,
        { userId, error: parsedError.message },
      );
    }
  }
}

/**
 * Singleton instance
 */
export const consultationListRepository = new ConsultationListRepositoryImpl();
