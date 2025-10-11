/**
 * Business Data Repository
 * Aggregates data from all business data sub-repositories
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { userRolesRepository } from "@/app/api/[locale]/v1/core/user/user-roles/repository";
import type { CountryLanguage } from "@/i18n/core/config";

import { audienceRepository } from "./audience/repository";
import { brandRepository } from "./brand/repository";
import { businessInfoRepository } from "./business-info/repository";
import { challengesRepository } from "./challenges/repository";
import { competitorsRepository } from "./competitors/repository";
import type { BusinessDataGetResponseTypeOutput } from "./definition";
import { goalsRepository } from "./goals/repository";
import { profileRepository } from "./profile/repository";
import { socialPlatformRepository } from "./social/repository";

type SectionCompletionStatus =
  BusinessDataGetResponseTypeOutput["completionStatus"]["audience"];

/**
 * Interface for data that may have completion status
 */

interface DataWithPossibleCompletionStatus {
  completionStatus?: BusinessDataGetResponseTypeOutput["completionStatus"][keyof BusinessDataGetResponseTypeOutput["completionStatus"]];
}

/**
 * Extract completion status from response data safely
 */
function extractCompletionStatus(
  data: DataWithPossibleCompletionStatus | null | undefined,
): SectionCompletionStatus {
  const defaultStatus: SectionCompletionStatus = {
    isComplete: false,
    completedFields: 0,
    totalFields: 0,
    completionPercentage: 0,
    missingRequiredFields: [],
  };

  if (!data) {
    return defaultStatus;
  }

  // If the data already has a completionStatus property, use it
  if (data.completionStatus && typeof data.completionStatus === "object") {
    return data.completionStatus as SectionCompletionStatus;
  }

  // Otherwise, return default status for now
  return defaultStatus;
}

/**
 * Business Data Repository Interface
 */
interface IBusinessDataRepository {
  getAllBusinessData(
    userId: DbId,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<BusinessDataGetResponseTypeOutput>>;
}

/**
 * Calculate overall completion status from individual section statuses
 * Only includes active sections (not commented out in the UI)
 */
function calculateOverallCompletionStatus(
  sectionStatuses: Record<string, SectionCompletionStatus>,
): {
  isComplete: boolean;
  completedSections: number;
  totalSections: number;
  completionPercentage: number;
} {
  // Only include active sections that are not commented out in the UI
  const activeSectionKeys = ["profile", "businessInfo", "social"];
  const activeSections = activeSectionKeys
    .map((key) => sectionStatuses[key])
    .filter(Boolean); // Filter out any undefined sections

  const completedSections = activeSections.filter(
    (section) => section.isComplete,
  ).length;
  const totalSections = activeSections.length;
  const completionPercentage = Math.round(
    (completedSections / totalSections) * 100,
  );

  return {
    isComplete: completedSections === totalSections,
    completedSections,
    totalSections,
    completionPercentage,
  };
}

/**
 * Business Data Repository Implementation
 */
class BusinessDataRepositoryImpl implements IBusinessDataRepository {
  /**
   * Get completion status for all business data sections
   * Fetches only completion status from all sub-repositories in parallel
   */
  async getAllBusinessData(
    userId: DbId,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<BusinessDataGetResponseTypeOutput>> {
    try {
      const actualUserId = authRepository.requireUserId(user);
      logger.debug("app.api.v1.core.businessData.debug.fetchingData", {
        userId,
        actualUserId,
      });

      const canAccess = await this.canAccessBusinessData(
        actualUserId,
        userId,
        logger,
      );

      if (!canAccess) {
        return createErrorResponse(
          "app.api.v1.core.businessData.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // Fetch completion status from all repositories in parallel
      const [
        audienceResult,
        brandResult,
        businessInfoResult,
        challengesResult,
        competitorsResult,
        goalsResult,
        profileResult,
        socialResult,
      ] = await Promise.allSettled([
        audienceRepository.getAudience(userId, user, logger),
        brandRepository.getBrand(userId, user, logger),
        businessInfoRepository.getBusinessInfo(userId, user, locale, logger),
        challengesRepository.getChallenges(userId, user, logger),
        competitorsRepository.getCompetitors(userId, user, logger),
        goalsRepository.getGoals(userId, user, logger),
        profileRepository.getProfile(userId, user, logger),
        socialPlatformRepository.getSocialPlatforms(userId, user, logger),
      ]);

      // Create default completion status
      const defaultStatus: SectionCompletionStatus = {
        isComplete: false,
        completedFields: 0,
        totalFields: 0,
        completionPercentage: 0,
        missingRequiredFields: [],
      };

      const sectionStatuses = {
        audience:
          audienceResult.status === "fulfilled" && audienceResult.value.success
            ? extractCompletionStatus(
                audienceResult.value.data as DataWithPossibleCompletionStatus,
              )
            : defaultStatus,
        brand:
          brandResult.status === "fulfilled" && brandResult.value.success
            ? extractCompletionStatus(
                brandResult.value.data as DataWithPossibleCompletionStatus,
              )
            : defaultStatus,
        businessInfo:
          businessInfoResult.status === "fulfilled" &&
          businessInfoResult.value.success
            ? extractCompletionStatus(
                businessInfoResult.value
                  .data as DataWithPossibleCompletionStatus,
              )
            : defaultStatus,
        challenges:
          challengesResult.status === "fulfilled" &&
          challengesResult.value.success
            ? extractCompletionStatus(
                challengesResult.value.data as DataWithPossibleCompletionStatus,
              )
            : defaultStatus,
        competitors:
          competitorsResult.status === "fulfilled" &&
          competitorsResult.value.success
            ? extractCompletionStatus(
                competitorsResult.value
                  .data as DataWithPossibleCompletionStatus,
              )
            : defaultStatus,
        goals:
          goalsResult.status === "fulfilled" && goalsResult.value.success
            ? extractCompletionStatus(
                goalsResult.value.data as DataWithPossibleCompletionStatus,
              )
            : defaultStatus,
        profile:
          profileResult.status === "fulfilled" && profileResult.value.success
            ? extractCompletionStatus(
                profileResult.value.data as DataWithPossibleCompletionStatus,
              )
            : defaultStatus,
        social:
          socialResult.status === "fulfilled" && socialResult.value.success
            ? extractCompletionStatus(
                socialResult.value.data as DataWithPossibleCompletionStatus,
              )
            : defaultStatus,
      };

      // Calculate overall completion status
      const overall = calculateOverallCompletionStatus(sectionStatuses);

      // Return only completion status data
      const aggregatedData: BusinessDataGetResponseTypeOutput = {
        completionStatus: {
          audience: sectionStatuses.audience,
          brand: sectionStatuses.brand,
          businessInfo: sectionStatuses.businessInfo,
          challenges: sectionStatuses.challenges,
          competitors: sectionStatuses.competitors,
          goals: sectionStatuses.goals,
          profile: sectionStatuses.profile,
          social: sectionStatuses.social,
          overall,
        },
      };

      logger.debug("app.api.v1.core.businessData.debug.dataAggregated", {
        overallCompletionPercentage: overall.completionPercentage,
        completedSections: overall.completedSections,
        totalSections: overall.totalSections,
      });

      return createSuccessResponse(aggregatedData);
    } catch (error) {
      logger.error(
        "app.api.v1.core.businessData.errors.failedToGetData",
        error,
      );
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.businessData.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  /**
   * Check if user can access business data
   */
  private async canAccessBusinessData(
    actualUserId: DbId,
    targetUserId: DbId,
    logger: EndpointLogger,
  ): Promise<boolean> {
    if (actualUserId === targetUserId) {
      return true;
    }

    try {
      const userRoles = await userRolesRepository.findByUserId(
        actualUserId,
        logger,
      );
      if (userRoles.success) {
        const isAdmin = userRoles.data.some(
          (role) => role.role === UserRole.ADMIN,
        );
        logger.debug("app.api.v1.core.businessData.debug.accessCheck", {
          actualUserId,
          targetUserId,
          isAdmin,
        });
        return isAdmin;
      }

      logger.debug("app.api.v1.core.businessData.debug.accessDenied", {
        actualUserId,
        targetUserId,
        access: false,
      });
      return false;
    } catch (error) {
      logger.error(
        "app.api.v1.core.businessData.errors.accessCheckFailed",
        error,
      );
      return false;
    }
  }
}

export const businessDataRepository = new BusinessDataRepositoryImpl();
