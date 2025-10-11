/**
 * Challenges Repository
 * Implements repository pattern for challenges operations
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

import { challenges } from "./db";
import type {
  ChallengesGetResponseTypeOutput,
  ChallengesPutRequestTypeOutput,
  ChallengesPutResponseTypeOutput,
} from "./definition";

type SectionCompletionStatus =
  ChallengesGetResponseTypeOutput["completionStatus"];

/**
 * Calculate completion status for challenges data
 */
function calculateChallengesCompletionStatus(
  data: Partial<ChallengesGetResponseTypeOutput>,
): SectionCompletionStatus {
  // Define all challenges fields for completion tracking
  const allFields = [
    "currentChallenges",
    "marketingChallenges",
    "operationalChallenges",
    "financialChallenges",
    "technicalChallenges",
    "biggestChallenge",
    "challengeImpact",
    "previousSolutions",
    "resourceConstraints",
    "budgetConstraints",
    "timeConstraints",
    "supportNeeded",
    "priorityAreas",
    "additionalNotes",
  ];

  const completedFields = allFields.filter((field) => {
    const value = data[field as keyof ChallengesGetResponseTypeOutput];
    return value !== undefined && value !== null && value !== "";
  }).length;

  const totalFields = allFields.length;
  const completionPercentage = Math.round(
    (completedFields / totalFields) * 100,
  );

  // Required fields for challenges
  const requiredFields = ["currentChallenges"];
  const missingRequiredFields = requiredFields.filter((field) => {
    const value = data[field as keyof ChallengesGetResponseTypeOutput];
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
 * Challenges Repository Interface
 */
export interface ChallengesRepository {
  getChallenges(
    userId: DbId,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ChallengesGetResponseTypeOutput>>;

  updateChallenges(
    userId: DbId,
    data: ChallengesPutRequestTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ChallengesPutResponseTypeOutput>>;
}

/**
 * Challenges Repository Implementation
 */
class ChallengesRepositoryImpl implements ChallengesRepository {
  /**
   * Get challenges data for a user
   */
  async getChallenges(
    userId: DbId,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ChallengesGetResponseTypeOutput>> {
    try {
      const actualUserId = authRepository.requireUserId(user);
      const canAccess = await this.canAccessChallenges(
        actualUserId,
        userId,
        logger,
      );

      if (!canAccess) {
        return createErrorResponse(
          "app.api.v1.core.businessData.challenges.get.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      const challengesData = await db
        .select()
        .from(challenges)
        .where(eq(challenges.userId, userId))
        .limit(1);

      const result = challengesData[0];

      const responseData = {
        currentChallenges: result?.currentChallenges || "",
        marketingChallenges: result?.marketingChallenges || "",
        operationalChallenges: result?.operationalChallenges || "",
        financialChallenges: result?.financialChallenges || "",
        technicalChallenges: result?.technicalChallenges || "",
        biggestChallenge: result?.biggestChallenge || "",
        challengeImpact: result?.challengeImpact || "",
        previousSolutions: result?.previousSolutions || "",
        resourceConstraints: result?.resourceConstraints || "",
        budgetConstraints: result?.budgetConstraints || "",
        timeConstraints: result?.timeConstraints || "",
        supportNeeded: result?.supportNeeded || "",
        priorityAreas: result?.priorityAreas || "",
        additionalNotes: result?.additionalNotes || "",
      };

      const completionStatus =
        calculateChallengesCompletionStatus(responseData);

      return createSuccessResponse({
        ...responseData,
        completionStatus,
      });
    } catch (error) {
      logger.error("challenges.repository.get.error", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.businessData.challenges.get.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Update challenges data for a user
   */
  async updateChallenges(
    userId: DbId,
    data: ChallengesPutRequestTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ChallengesPutResponseTypeOutput>> {
    try {
      const actualUserId = authRepository.requireUserId(user);
      const canAccess = await this.canAccessChallenges(
        actualUserId,
        userId,
        logger,
      );

      if (!canAccess) {
        return createErrorResponse(
          "app.api.v1.core.businessData.challenges.get.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      await withTransaction(logger, async (tx) => {
        const existingChallenges = await tx
          .select()
          .from(challenges)
          .where(eq(challenges.userId, userId))
          .limit(1);

        if (existingChallenges.length > 0) {
          await tx
            .update(challenges)
            .set({
              currentChallenges: data.currentChallenges,
              marketingChallenges: data.marketingChallenges,
              operationalChallenges: data.operationalChallenges,
              financialChallenges: data.financialChallenges,
              technicalChallenges: data.technicalChallenges,
              biggestChallenge: data.biggestChallenge,
              challengeImpact: data.challengeImpact,
              previousSolutions: data.previousSolutions,
              resourceConstraints: data.resourceConstraints,
              budgetConstraints: data.budgetConstraints,
              timeConstraints: data.timeConstraints,
              supportNeeded: data.supportNeeded,
              priorityAreas: data.priorityAreas,
              additionalNotes: data.additionalNotes,
              updatedAt: new Date(),
            })
            .where(eq(challenges.userId, userId));
        } else {
          await tx.insert(challenges).values({
            userId,
            currentChallenges: data.currentChallenges,
            marketingChallenges: data.marketingChallenges,
            operationalChallenges: data.operationalChallenges,
            financialChallenges: data.financialChallenges,
            technicalChallenges: data.technicalChallenges,
            biggestChallenge: data.biggestChallenge,
            challengeImpact: data.challengeImpact,
            previousSolutions: data.previousSolutions,
            resourceConstraints: data.resourceConstraints,
            budgetConstraints: data.budgetConstraints,
            timeConstraints: data.timeConstraints,
            supportNeeded: data.supportNeeded,
            priorityAreas: data.priorityAreas,
            additionalNotes: data.additionalNotes,
          });
        }
      });

      const responseData = {
        currentChallenges: data.currentChallenges,
        marketingChallenges: data.marketingChallenges,
        operationalChallenges: data.operationalChallenges,
        financialChallenges: data.financialChallenges,
        technicalChallenges: data.technicalChallenges,
        biggestChallenge: data.biggestChallenge,
        challengeImpact: data.challengeImpact,
        previousSolutions: data.previousSolutions,
        resourceConstraints: data.resourceConstraints,
        budgetConstraints: data.budgetConstraints,
        timeConstraints: data.timeConstraints,
        supportNeeded: data.supportNeeded,
        priorityAreas: data.priorityAreas,
        additionalNotes: data.additionalNotes,
      };

      const completionStatus =
        calculateChallengesCompletionStatus(responseData);

      return createSuccessResponse({
        message: "app.api.v1.core.businessData.challenges.put.success.message",
        ...responseData,
        completionStatus,
      });
    } catch (error) {
      logger.error("challenges.repository.update.error", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.businessData.challenges.put.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Check if user can access challenges data
   */
  private async canAccessChallenges(
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

export const challengesRepository = new ChallengesRepositoryImpl();
