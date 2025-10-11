/**
 * Audience Repository
 * Implements repository pattern for audience operations
 */

import { eq } from "drizzle-orm";
import { withTransaction } from "next-vibe/server/db/repository-helpers";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { userRolesRepository } from "@/app/api/[locale]/v1/core/user/user-roles/repository";

import { audience } from "./db";
import type {
  AudienceGetResponseOutput,
  AudiencePutRequestOutput,
  AudiencePutResponseOutput,
} from "./definition";

type SectionCompletionStatus = AudienceGetResponseOutput["completionStatus"];

/**
 * Audience Repository Interface
 */
export interface AudienceRepository {
  getAudience(
    userId: DbId,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<AudienceGetResponseOutput>>;

  updateAudience(
    userId: DbId,
    data: AudiencePutRequestOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<AudiencePutResponseOutput>>;
}

/**
 * Calculate completion status for audience data
 */
function calculateAudienceCompletionStatus(
  data: Omit<AudienceGetResponseOutput, "completionStatus">,
): SectionCompletionStatus {
  // Define all audience fields for completion tracking
  const allFields: (keyof Omit<
    AudienceGetResponseOutput,
    "completionStatus"
  >)[] = [
    "targetAudience",
    "ageRange",
    "gender",
    "location",
    "income",
    "interests",
    "values",
    "lifestyle",
    "onlineBehavior",
    "purchaseBehavior",
    "preferredChannels",
    "painPoints",
    "motivations",
    "additionalNotes",
  ];

  const completedFields = allFields.filter((field) => {
    const value = data[field];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== undefined && value !== null && value !== "";
  }).length;

  const totalFields = allFields.length;
  const completionPercentage = Math.round(
    (completedFields / totalFields) * 100,
  );

  // Required fields for audience
  const requiredFields = ["targetAudience"];
  const missingRequiredFields = requiredFields.filter((field) => {
    const value =
      data[field as keyof Omit<AudienceGetResponseOutput, "completionStatus">];
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return !value || value === "";
  });

  const isComplete = missingRequiredFields.length === 0 && completedFields >= 6; // At least 6 fields filled

  return {
    isComplete,
    completedFields,
    totalFields,
    completionPercentage,
    missingRequiredFields,
  };
}

/**
 * Audience Repository Implementation
 */
class AudienceRepositoryImpl implements AudienceRepository {
  /**
   * Get audience data for a user
   */
  async getAudience(
    userId: DbId,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<AudienceGetResponseOutput>> {
    try {
      const canAccess = await this.canAccessAudience(user.id, userId, logger);

      if (!canAccess) {
        return createErrorResponse(
          "app.api.v1.core.businessData.audience.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      const audienceData = await db
        .select()
        .from(audience)
        .where(eq(audience.userId, userId))
        .limit(1);

      const result = audienceData[0];

      const responseData: Omit<AudienceGetResponseOutput, "completionStatus"> =
        {
          targetAudience: result?.targetAudience || undefined,
          ageRange: result?.ageRange
            ? (JSON.parse(
                result.ageRange,
              ) as AudienceGetResponseOutput["ageRange"])
            : undefined,
          gender: result?.gender
            ? (JSON.parse(result.gender) as AudienceGetResponseOutput["gender"])
            : undefined,
          location: result?.location || undefined,
          income: result?.income
            ? (JSON.parse(result.income) as AudienceGetResponseOutput["income"])
            : undefined,
          interests: result?.interests || undefined,
          values: result?.values || undefined,
          lifestyle: result?.lifestyle || undefined,
          onlineBehavior: result?.onlineBehavior || undefined,
          purchaseBehavior: result?.purchaseBehavior || undefined,
          preferredChannels: result?.preferredChannels
            ? (JSON.parse(
                result.preferredChannels,
              ) as AudienceGetResponseOutput["preferredChannels"])
            : undefined,
          painPoints: result?.painPoints || undefined,
          motivations: result?.motivations || undefined,
          additionalNotes: result?.additionalNotes || undefined,
        };

      const completionStatus = calculateAudienceCompletionStatus(responseData);

      const fullResponse: AudienceGetResponseOutput = {
        ...responseData,
        completionStatus,
      };

      return createSuccessResponse(fullResponse);
    } catch (error) {
      logger.error("audience.repository.get.error", error);
      return createErrorResponse(
        "app.api.v1.core.businessData.audience.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Update audience data for a user
   */
  async updateAudience(
    userId: DbId,
    data: AudiencePutRequestOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<AudiencePutResponseOutput>> {
    try {
      const canAccess = await this.canAccessAudience(user.id, userId, logger);

      if (!canAccess) {
        return createErrorResponse(
          "app.api.v1.core.businessData.audience.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      await withTransaction(logger, async (tx) => {
        const existingAudience = await tx
          .select()
          .from(audience)
          .where(eq(audience.userId, userId))
          .limit(1);

        if (existingAudience.length > 0) {
          await tx
            .update(audience)
            .set({
              targetAudience: data.targetAudience,
              ageRange: data.ageRange
                ? JSON.stringify(data.ageRange)
                : undefined,
              gender: data.gender ? JSON.stringify(data.gender) : undefined,
              location: data.location,
              income: data.income ? JSON.stringify(data.income) : undefined,
              interests: data.interests,
              values: data.values,
              lifestyle: data.lifestyle,
              onlineBehavior: data.onlineBehavior,
              purchaseBehavior: data.purchaseBehavior,
              preferredChannels: data.preferredChannels
                ? JSON.stringify(data.preferredChannels)
                : undefined,
              painPoints: data.painPoints,
              motivations: data.motivations,
              additionalNotes: data.additionalNotes,
              updatedAt: new Date(),
            })
            .where(eq(audience.userId, userId));
        } else {
          await tx.insert(audience).values({
            userId,
            targetAudience: data.targetAudience || "",
            ageRange: data.ageRange ? JSON.stringify(data.ageRange) : undefined,
            gender: data.gender ? JSON.stringify(data.gender) : undefined,
            location: data.location,
            income: data.income ? JSON.stringify(data.income) : undefined,
            interests: data.interests,
            values: data.values,
            lifestyle: data.lifestyle,
            onlineBehavior: data.onlineBehavior,
            purchaseBehavior: data.purchaseBehavior,
            preferredChannels: data.preferredChannels
              ? JSON.stringify(data.preferredChannels)
              : undefined,
            painPoints: data.painPoints,
            motivations: data.motivations,
            additionalNotes: data.additionalNotes,
          });
        }
      });

      // Prepare response data
      const responseData: Omit<AudienceGetResponseOutput, "completionStatus"> =
        {
          targetAudience: data.targetAudience || undefined,
          ageRange: data.ageRange || undefined,
          gender: data.gender || undefined,
          location: data.location || undefined,
          income: data.income || undefined,
          interests: data.interests || undefined,
          values: data.values || undefined,
          lifestyle: data.lifestyle || undefined,
          onlineBehavior: data.onlineBehavior || undefined,
          purchaseBehavior: data.purchaseBehavior || undefined,
          preferredChannels: data.preferredChannels || undefined,
          painPoints: data.painPoints || undefined,
          motivations: data.motivations || undefined,
          additionalNotes: data.additionalNotes || undefined,
        };

      const completionStatus = calculateAudienceCompletionStatus(responseData);

      const fullResponse: AudiencePutResponseOutput = {
        message: "app.api.v1.core.businessData.audience.put.success.message",
        completionStatus,
      };

      return createSuccessResponse(fullResponse);
    } catch (error) {
      logger.error("audience.repository.update.error", error);
      return createErrorResponse(
        "app.api.v1.core.businessData.audience.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Check if user can access audience data
   */
  private async canAccessAudience(
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

export const audienceRepository = new AudienceRepositoryImpl();
