/**
 * Profile Repository
 * Implements repository pattern for profile operations
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
import { users } from "@/app/api/[locale]/v1/core/user/db";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { userRolesRepository } from "@/app/api/[locale]/v1/core/user/user-roles/repository";

import type {
  ProfileGetResponseTypeOutput,
  ProfilePutRequestTypeOutput,
  ProfilePutResponseTypeOutput,
} from "./definition";

type SectionCompletionStatus = ProfileGetResponseTypeOutput["completionStatus"];

/**
 * Profile Repository Interface
 */
export interface ProfileRepository {
  getProfile(
    userId: DbId,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ProfileGetResponseTypeOutput>>;

  updateProfile(
    userId: DbId,
    data: ProfilePutRequestTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ProfilePutResponseTypeOutput>>;
}

/**
 * Calculate completion status for profile data
 */
function calculateProfileCompletionStatus(
  data: Partial<ProfileGetResponseTypeOutput>,
): SectionCompletionStatus {
  // Define all profile fields for completion tracking (6 fields from definition)
  const allFields = [
    "fullName",
    "jobTitle",
    "bio",
    "expertise",
    "professionalBackground",
    "additionalNotes",
  ];

  const completedFields = allFields.filter((field) => {
    const value = data[field as keyof ProfileGetResponseTypeOutput];
    return value !== undefined && value !== null && value !== "";
  }).length;

  const totalFields = allFields.length;
  const completionPercentage = Math.round(
    (completedFields / totalFields) * 100,
  );

  // Required fields for profile
  const requiredFields = ["firstName", "lastName"];
  const missingRequiredFields = requiredFields.filter((field) => {
    const value = data[field as keyof ProfileGetResponseTypeOutput];
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
 * Profile Repository Implementation
 * Implements business logic for profile operations
 */
class ProfileRepositoryImpl implements ProfileRepository {
  /**
   * Get profile information for a user
   */
  async getProfile(
    userId: DbId,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ProfileGetResponseTypeOutput>> {
    try {
      // Get the actual user ID from JWT
      const actualUserId = authRepository.requireUserId(user);

      // Check if user can access this data
      const canAccess = await this.canAccessProfile(
        actualUserId,
        userId,
        logger,
      );
      if (!canAccess) {
        return createErrorResponse(
          "app.api.v1.core.businessData.profile.get.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // Get profile data from users table
      const userData = await db
        .select({
          firstName: users.firstName,
          lastName: users.lastName,
          bio: users.bio,
          phone: users.phone,
          website: users.website,
          jobTitle: users.jobTitle,
          company: users.company,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      const result = userData[0];

      // Check if user exists
      if (!result) {
        return createErrorResponse(
          "app.api.v1.core.businessData.profile.put.errors.notFound.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      const responseData = {
        fullName:
          result.firstName && result.lastName
            ? `${result.firstName} ${result.lastName}`.trim()
            : result.firstName || undefined,
        jobTitle: result.jobTitle || undefined,
        bio: result.bio || undefined,
        expertise: undefined, // Not stored in database yet
        professionalBackground: undefined, // Not stored in database yet
        additionalNotes: undefined, // Not stored in database yet
      };

      const completionStatus = calculateProfileCompletionStatus(responseData);

      return createSuccessResponse({
        ...responseData,
        completionStatus,
      } as ProfileGetResponseTypeOutput);
    } catch (error) {
      logger.error(
        "app.api.v1.core.businessData.profile.get.errors.server.title",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.businessData.profile.get.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Update profile information for a user
   */
  async updateProfile(
    userId: DbId,
    data: ProfilePutRequestTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ProfilePutResponseTypeOutput>> {
    try {
      // Get the actual user ID from JWT
      const actualUserId = authRepository.requireUserId(user);

      // Check if user can access this data
      const canAccess = await this.canAccessProfile(
        actualUserId,
        userId,
        logger,
      );
      if (!canAccess) {
        return createErrorResponse(
          "app.api.v1.core.businessData.profile.put.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // First check if user exists
      const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (existingUser.length === 0) {
        return createErrorResponse(
          "app.api.v1.core.businessData.profile.put.errors.notFound.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // Update user profile data
      await withTransaction(logger, async (tx) => {
        // Update the user record with profile data
        await tx
          .update(users)
          .set({
            // fullName will be split into firstName/lastName for database storage
            firstName: data.fullName ? data.fullName.split(" ")[0] : undefined,
            lastName: data.fullName
              ? data.fullName.split(" ").slice(1).join(" ")
              : undefined,
            bio: data.bio,
            jobTitle: data.jobTitle,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));
      });

      const responseData = {
        fullName: data.fullName ?? undefined,
        jobTitle: data.jobTitle ?? undefined,
        bio: data.bio ?? undefined,
        expertise: data.expertise ?? undefined,
        professionalBackground: data.professionalBackground ?? undefined,
        additionalNotes: data.additionalNotes ?? undefined,
      };

      const completionStatus = calculateProfileCompletionStatus(responseData);

      return createSuccessResponse({
        message: "app.api.v1.core.businessData.profile.put.success.message",
        ...responseData,
        completionStatus,
      } as ProfilePutResponseTypeOutput);
    } catch (error) {
      logger.error(
        "app.api.v1.core.businessData.profile.put.errors.server.title",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.businessData.profile.put.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Check if user can access profile data
   */
  private async canAccessProfile(
    actualUserId: DbId,
    targetUserId: DbId,
    logger: EndpointLogger,
  ): Promise<boolean> {
    // Users can always access their own data
    if (actualUserId === targetUserId) {
      return true;
    }

    // Check if user is admin
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

export const profileRepository = new ProfileRepositoryImpl();
