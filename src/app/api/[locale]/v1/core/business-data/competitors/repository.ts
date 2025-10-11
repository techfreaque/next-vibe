/**
 * Competitors Repository
 * Implements repository pattern for competitors operations
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

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { userRolesRepository } from "@/app/api/[locale]/v1/core/user/user-roles/repository";

import { competitors } from "./db";
import type {
  CompetitorsGetResponseTypeOutput,
  CompetitorsPutRequestTypeOutput,
  CompetitorsPutResponseTypeOutput,
} from "./definition";

type SectionCompletionStatus =
  CompetitorsGetResponseTypeOutput["completionStatus"];

/**
 * Calculate completion status for competitors data
 */
function calculateCompetitorsCompletionStatus(
  data: Partial<CompetitorsGetResponseTypeOutput>,
): SectionCompletionStatus {
  // Define all competitors fields for completion tracking
  const allFields = [
    "competitors",
    "mainCompetitors",
    "competitiveAdvantages",
    "competitiveDisadvantages",
    "marketPosition",
    "differentiators",
    "competitorStrengths",
    "competitorWeaknesses",
    "marketGaps",
    "additionalNotes",
  ];

  const completedFields = allFields.filter((field) => {
    const value = data[field as keyof CompetitorsGetResponseTypeOutput];
    return value !== undefined && value !== null && value !== "";
  }).length;

  const totalFields = allFields.length;
  const completionPercentage = Math.round(
    (completedFields / totalFields) * 100,
  );

  // Required fields for competitors
  const requiredFields = ["competitors", "mainCompetitors"];
  const missingRequiredFields = requiredFields.filter((field) => {
    const value = data[field as keyof CompetitorsGetResponseTypeOutput];
    return !value || value === "";
  });

  const isComplete = missingRequiredFields.length === 0 && completedFields >= 5; // At least 5 fields filled

  return {
    isComplete,
    completedFields,
    totalFields,
    completionPercentage,
    missingRequiredFields,
  };
}

/**
 * Competitors Repository Interface
 */
export interface CompetitorsRepository {
  getCompetitors(
    userId: DbId,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CompetitorsGetResponseTypeOutput>>;

  updateCompetitors(
    userId: DbId,
    data: CompetitorsPutRequestTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CompetitorsPutResponseTypeOutput>>;
}

/**
 * Competitors Repository Implementation
 */
class CompetitorsRepositoryImpl implements CompetitorsRepository {
  /**
   * Get competitors data for a user
   */
  async getCompetitors(
    userId: DbId,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CompetitorsGetResponseTypeOutput>> {
    try {
      const actualUserId = authRepository.requireUserId(user);
      const canAccess = await this.canAccessCompetitors(
        actualUserId,
        userId,
        logger,
      );

      if (!canAccess) {
        return createErrorResponse(
          "app.api.v1.core.businessData.competitors.get.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      const competitorsData = await db
        .select()
        .from(competitors)
        .where(eq(competitors.userId, userId))
        .limit(1);

      const result = competitorsData[0];

      const responseData = {
        competitors: result?.competitors || "",
        mainCompetitors: result?.mainCompetitors || "",
        competitiveAdvantages: result?.competitiveAdvantages || "",
        competitiveDisadvantages: result?.competitiveDisadvantages || "",
        marketPosition: result?.marketPosition || "",
        differentiators: result?.differentiators || "",
        competitorStrengths: result?.competitorStrengths || "",
        competitorWeaknesses: result?.competitorWeaknesses || "",
        marketGaps: result?.marketGaps || "",
        additionalNotes: result?.additionalNotes || "",
      };

      const completionStatus =
        calculateCompetitorsCompletionStatus(responseData);

      return createSuccessResponse({
        ...responseData,
        completionStatus,
      } as CompetitorsGetResponseTypeOutput);
    } catch (error) {
      logger.error(
        "app.api.v1.core.businessData.competitors.get.errors.server.title",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.businessData.competitors.get.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Update competitors data for a user
   */
  async updateCompetitors(
    userId: DbId,
    data: CompetitorsPutRequestTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CompetitorsPutResponseTypeOutput>> {
    try {
      const actualUserId = authRepository.requireUserId(user);
      const canAccess = await this.canAccessCompetitors(
        actualUserId,
        userId,
        logger,
      );

      if (!canAccess) {
        return createErrorResponse(
          "app.api.v1.core.businessData.competitors.put.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      await withTransaction(logger, async (tx) => {
        const existingCompetitors = await tx
          .select()
          .from(competitors)
          .where(eq(competitors.userId, userId))
          .limit(1);

        if (existingCompetitors.length > 0) {
          await tx
            .update(competitors)
            .set({
              competitors: data.competitors,
              mainCompetitors: data.mainCompetitors,
              competitiveAdvantages: data.competitiveAdvantages,
              competitiveDisadvantages: data.competitiveDisadvantages,
              marketPosition: data.marketPosition,
              differentiators: data.differentiators,
              competitorStrengths: data.competitorStrengths,
              competitorWeaknesses: data.competitorWeaknesses,
              marketGaps: data.marketGaps,
              additionalNotes: data.additionalNotes,
              updatedAt: new Date(),
            })
            .where(eq(competitors.userId, userId));
        } else {
          await tx.insert(competitors).values({
            userId,
            competitors: data.competitors,
            mainCompetitors: data.mainCompetitors,
            competitiveAdvantages: data.competitiveAdvantages,
            competitiveDisadvantages: data.competitiveDisadvantages,
            marketPosition: data.marketPosition,
            differentiators: data.differentiators,
            competitorStrengths: data.competitorStrengths,
            competitorWeaknesses: data.competitorWeaknesses,
            marketGaps: data.marketGaps,
            additionalNotes: data.additionalNotes,
          });
        }
      });

      const responseData = {
        competitors: data.competitors || undefined,
        mainCompetitors: data.mainCompetitors || undefined,
        competitiveAdvantages: data.competitiveAdvantages || undefined,
        competitiveDisadvantages: data.competitiveDisadvantages || undefined,
        marketPosition: data.marketPosition || undefined,
        differentiators: data.differentiators || undefined,
        competitorStrengths: data.competitorStrengths || undefined,
        competitorWeaknesses: data.competitorWeaknesses || undefined,
        marketGaps: data.marketGaps || undefined,
        additionalNotes: data.additionalNotes || undefined,
      };

      const completionStatus =
        calculateCompetitorsCompletionStatus(responseData);

      const result: CompetitorsPutResponseTypeOutput = {
        message: "app.api.v1.core.businessData.competitors.put.success.message",
        ...responseData,
        completionStatus,
      };

      return createSuccessResponse(result);
    } catch (error) {
      logger.error(
        "app.api.v1.core.businessData.competitors.put.errors.server.title",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.businessData.competitors.put.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Check if user can access competitors data
   */
  private async canAccessCompetitors(
    actualUserId: DbId,
    targetUserId: DbId,
    logger: EndpointLogger,
  ): Promise<boolean> {
    if (actualUserId === targetUserId) {
      return true;
    }

    const userRoles = await userRolesRepository.findByUserId(
      actualUserId,
      logger,
    );
    if (userRoles.success) {
      return userRoles.data.some((role) => role.role === UserRole.ADMIN);
    }

    return false;
  }
}

export const competitorsRepository = new CompetitorsRepositoryImpl();
