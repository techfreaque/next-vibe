/**
 * Social Platform Repository
 * Implements repository pattern for social platform operations
 */

import "server-only";

import { eq } from "drizzle-orm";
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

import { socialPlatforms } from "./db";
import type {
  SocialGetResponseTypeOutput,
  SocialPutRequestTypeOutput,
  SocialPutResponseTypeOutput,
} from "./definition";
import { PlatformPriority, SocialPlatform } from "./enum";

type SectionCompletionStatus = SocialGetResponseTypeOutput["completionStatus"];

// Extract types from enum values
type SocialPlatformType = (typeof SocialPlatform)[keyof typeof SocialPlatform];
type PlatformPriorityType =
  (typeof PlatformPriority)[keyof typeof PlatformPriority];

/**
 * Convert string to SocialPlatform enum
 */
function convertToSocialPlatform(
  value?: string | null,
): SocialPlatformType | undefined {
  if (!value) {
    return undefined;
  }
  return Object.values(SocialPlatform).includes(value as SocialPlatformType)
    ? (value as SocialPlatformType)
    : undefined;
}

/**
 * Convert string to PlatformPriority enum
 */
function convertToPlatformPriority(
  value?: string | null,
): PlatformPriorityType | undefined {
  if (!value) {
    return undefined;
  }
  return Object.values(PlatformPriority).includes(value as PlatformPriorityType)
    ? (value as PlatformPriorityType)
    : undefined;
}

/**
 * Calculate completion status for social platforms data
 */
function calculateSocialCompletionStatus(data: {
  platforms?: Array<{
    platform: string;
    username: string;
    isActive: boolean;
    priority: string;
  }>;
  contentStrategy?: string;
  postingFrequency?: string;
  goals?: string;
}): SectionCompletionStatus {
  // Define all social fields for completion tracking (4 fields total)
  const allFields = [
    "platforms",
    "contentStrategy",
    "postingFrequency",
    "goals",
  ];

  const completedFields = allFields.filter((field) => {
    if (field === "platforms") {
      return Array.isArray(data.platforms) && data.platforms.length > 0;
    }
    if (field === "contentStrategy") {
      return (
        data.contentStrategy !== undefined &&
        data.contentStrategy !== null &&
        data.contentStrategy !== ""
      );
    }
    if (field === "postingFrequency") {
      return (
        data.postingFrequency !== undefined &&
        data.postingFrequency !== null &&
        data.postingFrequency !== ""
      );
    }
    if (field === "goals") {
      return (
        data.goals !== undefined && data.goals !== null && data.goals !== ""
      );
    }
    return false;
  }).length;

  const totalFields = allFields.length;
  const completionPercentage = Math.round(
    (completedFields / totalFields) * 100,
  );

  // Required: at least one platform
  const platforms = data.platforms || [];
  const missingRequiredFields = platforms.length === 0 ? ["platforms"] : [];
  const isComplete = completionPercentage >= 80;

  return {
    isComplete,
    completedFields,
    totalFields,
    completionPercentage,
    missingRequiredFields,
  };
}

/**
 * Social Platform Repository Interface
 * Defines contract for social platform operations
 */
export interface SocialPlatformRepository {
  /**
   * Get social platforms with business logic
   */
  getSocialPlatforms(
    userId: DbId,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<SocialGetResponseTypeOutput>>;

  /**
   * Update social platforms with business logic
   */
  updateSocialPlatforms(
    userId: DbId,
    data: SocialPutRequestTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<SocialPutResponseTypeOutput>>;
}

/**
 * Social Platform Repository Implementation
 * Uses Drizzle ORM for database operations
 */
export class SocialPlatformRepositoryImpl implements SocialPlatformRepository {
  /**
   * Get social platforms with business logic
   */
  async getSocialPlatforms(
    userId: DbId,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<SocialGetResponseTypeOutput>> {
    try {
      // Check permissions - only allow access to own data or admin access
      const currentUserId = authRepository.requireUserId(user);
      if (currentUserId !== userId) {
        // Check if user has admin role
        const userRoleResponse = await userRolesRepository.findByUserId(
          currentUserId,
          logger,
        );
        if (
          !userRoleResponse.success ||
          !userRoleResponse.data?.find((r) => r.role === UserRole.ADMIN)
        ) {
          return createErrorResponse(
            "app.api.v1.core.businessData.social.get.errors.unauthorized.title",
            ErrorResponseTypes.UNAUTHORIZED,
          );
        }
      }

      // Get social platform data
      const result = await db
        .select()
        .from(socialPlatforms)
        .where(eq(socialPlatforms.userId, userId))
        .limit(1);

      const socialPlatformData = result[0];

      if (!socialPlatformData) {
        // Return default empty data
        const responseData = {
          platforms: [],
          contentStrategy: "",
          postingFrequency: "",
          goals: "",
        };
        const completionStatus = calculateSocialCompletionStatus(responseData);
        return createSuccessResponse({
          ...responseData,
          completionStatus,
        } as SocialGetResponseTypeOutput);
      }

      // Robust handling of any data format in database
      let platformItems: Array<{
        platform: string;
        username: string;
        isActive: boolean;
        priority: string;
      }> = [];

      try {
        if (
          socialPlatformData.platforms &&
          Array.isArray(socialPlatformData.platforms)
        ) {
          const platforms = socialPlatformData.platforms;

          if (platforms.length === 0) {
            // Empty array - no platforms
            platformItems = [];
          } else {
            const firstPlatform = platforms[0];

            if (typeof firstPlatform === "string") {
              // Old format: ["instagram", "twitter"] - convert to empty array
              // This avoids validation errors and lets user start fresh
              platformItems = [];
            } else if (
              typeof firstPlatform === "object" &&
              firstPlatform !== null
            ) {
              // New format: [{platform: "instagram", username: "..."}, ...]
              // Convert and validate each platform
              platformItems = platforms
                .map((platform) => {
                  if (!platform || typeof platform !== "object") {
                    return null;
                  }

                  // Convert string values to proper enum types
                  const convertedPlatform = convertToSocialPlatform(
                    platform.platform,
                  );
                  const convertedPriority = convertToPlatformPriority(
                    platform.priority,
                  );

                  // Only include platforms with valid conversions
                  if (
                    !convertedPlatform ||
                    !convertedPriority ||
                    typeof platform.username !== "string" ||
                    platform.username.trim().length === 0 ||
                    typeof platform.isActive !== "boolean"
                  ) {
                    return null;
                  }

                  return {
                    platform: convertedPlatform,
                    username: platform.username,
                    isActive: platform.isActive,
                    priority: convertedPriority,
                  };
                })
                .filter((platform) => platform !== null);
            } else {
              // Unknown format - default to empty
              platformItems = [];
            }
          }
        } else {
          // Not an array or null - default to empty
          platformItems = [];
        }
      } catch (error) {
        // Any error in processing - default to empty array
        logger.error(
          "app.api.v1.core.businessData.social.errors.processingPlatforms",
          parseError(error),
        );
        platformItems = [];
      }

      const responseData = {
        platforms: platformItems,
        contentStrategy: socialPlatformData.contentStrategy || "",
        postingFrequency: socialPlatformData.postingFrequency || "",
        goals: socialPlatformData.goals || "",
      };
      const completionStatus = calculateSocialCompletionStatus(responseData);

      return createSuccessResponse({
        ...responseData,
        completionStatus,
      } as SocialGetResponseTypeOutput);
    } catch (error) {
      logger.error(
        "app.api.v1.core.businessData.social.get.errors.server.title",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.businessData.social.get.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Update social platforms with business logic
   */
  async updateSocialPlatforms(
    userId: DbId,
    data: SocialPutRequestTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<SocialPutResponseTypeOutput>> {
    try {
      // Check permissions - only allow access to own data
      const currentUserId = authRepository.requireUserId(user);
      if (currentUserId !== userId) {
        return createErrorResponse(
          "app.api.v1.core.businessData.social.put.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // Check if record exists
      const existingResult = await db
        .select()
        .from(socialPlatforms)
        .where(eq(socialPlatforms.userId, userId))
        .limit(1);

      const existingData = existingResult[0];

      if (!existingData) {
        // Create new record - store full platform objects
        const insertResult = await db
          .insert(socialPlatforms)
          .values({
            userId,
            platforms: data.platforms || [],
            contentStrategy: data.contentStrategy || null,
            postingFrequency: data.postingFrequency || null,
            goals: data.goals || null,
          })
          .returning();

        const newRecord = insertResult[0];
        if (!newRecord) {
          return createErrorResponse(
            "app.api.v1.core.businessData.social.put.errors.server.title",
            ErrorResponseTypes.DATABASE_ERROR,
          );
        }

        // Return the platforms that were actually saved (with usernames)
        const platformItems = data.platforms;

        const responseData = {
          platforms: platformItems,
          contentStrategy: data.contentStrategy,
          postingFrequency: data.postingFrequency,
          goals: data.goals,
        };
        const completionStatus = calculateSocialCompletionStatus(responseData);

        return createSuccessResponse({
          message: "app.api.v1.core.businessData.social.put.success.message",
          ...responseData,
          completionStatus,
        } as SocialPutResponseTypeOutput);
      }

      // Update existing record - store full platform objects
      const updateResult = await db
        .update(socialPlatforms)
        .set({
          platforms: data.platforms || [],
          contentStrategy: data.contentStrategy || null,
          postingFrequency: data.postingFrequency || null,
          goals: data.goals || null,
          updatedAt: new Date(),
        })
        .where(eq(socialPlatforms.userId, userId))
        .returning();

      const updatedRecord = updateResult[0];
      if (!updatedRecord) {
        return createErrorResponse(
          "app.api.v1.core.businessData.social.put.errors.server.title",
          ErrorResponseTypes.DATABASE_ERROR,
        );
      }

      // Return the platforms that were actually saved (with usernames)
      const updatedPlatformItems = data.platforms;

      const responseData = {
        platforms: updatedPlatformItems,
        contentStrategy: data.contentStrategy,
        postingFrequency: data.postingFrequency,
        goals: data.goals,
      };
      const completionStatus = calculateSocialCompletionStatus(responseData);

      return createSuccessResponse({
        message: "app.api.v1.core.businessData.social.put.success.message",
        ...responseData,
        completionStatus,
      } as SocialPutResponseTypeOutput);
    } catch (error) {
      logger.error(
        "app.api.v1.core.businessData.social.put.errors.server.title",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.businessData.social.put.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}

/**
 * Singleton Repository Instance
 */
export const socialPlatformRepository = new SocialPlatformRepositoryImpl();
