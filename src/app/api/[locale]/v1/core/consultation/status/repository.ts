/**
 * Consultation Status Repository
 * Handles database operations for consultation status queries
 */

import "server-only";

import { desc, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import { consultations } from "../db";
import { ConsultationStatus } from "../enum";
import type { ConsultationStatusResponseTypeOutput } from "./definition";

/**
 * Consultation Status Repository Interface
 */
export interface ConsultationStatusRepository {
  getConsultationStatus(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationStatusResponseTypeOutput>>;
}

/**
 * Consultation Status Repository Implementation
 */
export class ConsultationStatusRepositoryImpl
  implements ConsultationStatusRepository
{
  async getConsultationStatus(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationStatusResponseTypeOutput>> {
    try {
      logger.debug("Getting consultation status", { userId });

      // Get the most recent consultation for the user
      const [consultation] = await db
        .select({
          id: consultations.id,
          status: consultations.status,
          preferredDate: consultations.preferredDate,
          preferredTime: consultations.preferredTime,
          scheduledDate: consultations.scheduledDate,
          createdAt: consultations.createdAt,
        })
        .from(consultations)
        .where(eq(consultations.userId, userId))
        .orderBy(desc(consultations.createdAt))
        .limit(1);

      if (!consultation) {
        logger.debug("No consultation found for user", { userId });
        return createSuccessResponse({
          isScheduled: false,
        });
      }

      const isScheduled =
        consultation.status === ConsultationStatus.SCHEDULED ||
        consultation.status === ConsultationStatus.CONFIRMED;

      logger.debug("Consultation status retrieved", {
        userId,
        consultationId: consultation.id,
        isScheduled,
        status: consultation.status,
      });

      // Return format matching endpoint schema exactly
      return createSuccessResponse({
        isScheduled,
        scheduledAt: consultation.scheduledDate?.toISOString(),
        consultant: isScheduled ? undefined : undefined, // TODO: Add consultant field to schema
        status: consultation.status,
      });
    } catch (error) {
      logger.error("Error getting consultation status", { error, userId });
      return createErrorResponse(
        "app.api.v1.core.consultation.status.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: String(error) },
      );
    }
  }
}

export const consultationStatusRepository =
  new ConsultationStatusRepositoryImpl();
