/**
 * Goals Repository
 * Implements repository pattern for goals operations
 */

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

import { goals } from "./db";
import type {
  GoalsGetResponseTypeOutput,
  GoalsPutRequestTypeOutput,
  GoalsPutResponseTypeOutput,
} from "./definition";
import type { BusinessGoal } from "./enum";

// Type for BusinessGoal values
type BusinessGoalType = (typeof BusinessGoal)[keyof typeof BusinessGoal];

// Type for section completion status based on the new objectField structure
type SectionCompletionStatus = GoalsGetResponseTypeOutput["completionStatus"];

/**
 * Calculate completion status for goals data
 */
function calculateGoalsCompletionStatus(
  data: Partial<GoalsGetResponseTypeOutput>,
): SectionCompletionStatus {
  // Define all goals fields for completion tracking (7 fields total from definition)
  const allFields = [
    "primaryBusinessGoal",
    "shortTermGoals",
    "longTermGoals",
    "revenueTargets",
    "growthMetrics",
    "successMetrics",
    "additionalNotes",
  ];

  const completedFields = allFields.filter((field) => {
    const value = data[field as keyof GoalsGetResponseTypeOutput];
    if (field === "primaryBusinessGoal") {
      return value !== undefined && value !== null && value !== "";
    }
    return value !== undefined && value !== null && value !== "";
  }).length;

  const totalFields = allFields.length;
  const completionPercentage = Math.round(
    (completedFields / totalFields) * 100,
  );

  // Required fields for goals
  const requiredFields = ["primaryBusinessGoal"];
  const missingRequiredFields = requiredFields.filter((field) => {
    const value = data[field as keyof GoalsGetResponseTypeOutput];
    return !value || value === "";
  });

  const isComplete = missingRequiredFields.length === 0 && completedFields >= 4; // At least 4 fields filled

  return {
    isComplete,
    completedFields,
    totalFields,
    completionPercentage,
    missingRequiredFields,
  };
}

/**
 * Goals Repository Interface
 */
export interface GoalsRepository {
  getGoals(
    userId: DbId,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<GoalsGetResponseTypeOutput>>;

  updateGoals(
    userId: DbId,
    data: GoalsPutRequestTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<GoalsPutResponseTypeOutput>>;
}

/**
 * Goals Repository Implementation
 */
class GoalsRepositoryImpl implements GoalsRepository {
  /**
   * Get goals data for a user
   */
  async getGoals(
    userId: DbId,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<GoalsGetResponseTypeOutput>> {
    try {
      const actualUserId = authRepository.requireUserId(user);
      const canAccess = await this.canAccessGoals(actualUserId, userId, logger);

      if (!canAccess) {
        return createErrorResponse(
          "app.api.v1.core.businessData.goals.get.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      const goalsData = await db
        .select()
        .from(goals)
        .where(eq(goals.userId, userId))
        .limit(1);

      const result = goalsData[0];

      // Get primaryBusinessGoal as single enum value (not array)
      const primaryBusinessGoal =
        (result?.primaryBusinessGoal as BusinessGoalType) || undefined;

      const responseData = {
        primaryBusinessGoal,
        shortTermGoals: result?.shortTermGoals || undefined,
        longTermGoals: result?.longTermGoals || undefined,
        revenueGoals: result?.revenueTargets || undefined,
        growthGoals: result?.growthMetrics || undefined,
        successMetrics: result?.successMetrics || undefined,
        additionalNotes: result?.additionalNotes || undefined,
      };

      const completionStatus = calculateGoalsCompletionStatus(responseData);

      return createSuccessResponse({
        ...responseData,
        completionStatus,
      });
    } catch (error) {
      logger.error(
        "app.api.v1.core.businessData.goals.get.errors.server.title",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.businessData.goals.get.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Update goals data for a user
   */
  async updateGoals(
    userId: DbId,
    data: GoalsPutRequestTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<GoalsPutResponseTypeOutput>> {
    try {
      const actualUserId = authRepository.requireUserId(user);
      const canAccess = await this.canAccessGoals(actualUserId, userId, logger);

      if (!canAccess) {
        return createErrorResponse(
          "app.api.v1.core.businessData.goals.get.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      await withTransaction(logger, async (tx) => {
        const existingGoals = await tx
          .select()
          .from(goals)
          .where(eq(goals.userId, userId))
          .limit(1);

        if (existingGoals.length > 0) {
          await tx
            .update(goals)
            .set({
              primaryBusinessGoal: data.primaryBusinessGoal,
              shortTermGoals: data.shortTermGoals,
              longTermGoals: data.longTermGoals,
              revenueTargets: data.revenueGoals,
              growthMetrics: data.growthGoals,
              successMetrics: data.successMetrics,
              additionalNotes: data.additionalNotes,
              updatedAt: new Date(),
            })
            .where(eq(goals.userId, userId));
        } else {
          await tx.insert(goals).values({
            userId,
            primaryBusinessGoal: data.primaryBusinessGoal,
            shortTermGoals: data.shortTermGoals,
            longTermGoals: data.longTermGoals,
            revenueTargets: data.revenueGoals,
            growthMetrics: data.growthGoals,
            successMetrics: data.successMetrics,
            additionalNotes: data.additionalNotes,
          });
        }
      });

      const responseData = {
        primaryBusinessGoal: data.primaryBusinessGoal,
        shortTermGoals: data.shortTermGoals,
        longTermGoals: data.longTermGoals,
        revenueGoals: data.revenueGoals,
        growthGoals: data.growthGoals,
        successMetrics: data.successMetrics,
        additionalNotes: data.additionalNotes,
      };

      const completionStatus = calculateGoalsCompletionStatus(responseData);

      return createSuccessResponse({
        message: "app.api.v1.core.businessData.goals.put.success.message",
        ...responseData,
        completionStatus,
      });
    } catch (error) {
      logger.error(
        "app.api.v1.core.businessData.goals.put.errors.server.title",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.businessData.goals.put.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Check if user can access goals data
   */
  private async canAccessGoals(
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

export const goalsRepository = new GoalsRepositoryImpl();
