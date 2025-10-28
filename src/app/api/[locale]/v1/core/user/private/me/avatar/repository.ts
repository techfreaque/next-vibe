/**
 * Avatar Repository
 * Handles user avatar operations
 */

import { revalidatePath } from "next/cache";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import type { CountryLanguage } from "@/i18n/core/config";

import { UserDetailLevel } from "../../../enum";
import { userRepository } from "../../../repository";
import type {
  AvatarDeleteResponseOutput,
  AvatarPostResponseOutput,
} from "./definition";

/**
 * Avatar Repository Interface
 */
export interface AvatarRepository {
  /**
   * Upload a user's avatar
   */
  uploadAvatar(
    userId: DbId,
    file: File,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<AvatarPostResponseOutput>>;

  /**
   * Delete a user's avatar
   */
  deleteAvatar(
    userId: DbId,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<AvatarDeleteResponseOutput>>;
}

/**
 * Avatar Repository Implementation
 * Handles user avatar operations
 */
export class AvatarRepositoryImpl implements AvatarRepository {
  /**
   * Upload a user's avatar
   * @param userId - The user ID
   * @param file - The avatar file
   * @param logger - Logger instance for debugging and monitoring
   * @returns ResponseType with avatar URL
   */
  async uploadAvatar(
    userId: DbId,
    file: File,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<AvatarPostResponseOutput>> {
    try {
      // TODO: Use file parameter when implementing actual file upload
      logger.debug(
        "app.api.v1.core.user.private.me.avatar.debug.uploadingUserAvatar",
        { userId },
      );

      // Check if user exists
      const userResponse = await userRepository.getUserById(
        userId,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      );
      if (!userResponse.success) {
        return createErrorResponse(
          "app.api.v1.core.user.private.me.avatar.errors.user_not_found",
          ErrorResponseTypes.NOT_FOUND,
          { userId },
        );
      }

      // TODO: Implement file upload to storage service
      // TODO: Add avatar field to database schema
      // Implementation would handle file upload to storage service
      const avatarUrl = `https://example.com/avatars/${userId}.jpg`;

      // TODO: Uncomment when avatar field is added to DB schema
      // await db
      //   .update(users)
      //   .set({
      //     avatarUrl: avatarUrl,
      //     updatedAt: new Date(),
      //   })
      //   .where(eq(users.id, userId));

      // Revalidate relevant paths
      revalidatePath(`/dashboard/profile`);
      revalidatePath(`/profile`);

      return createSuccessResponse<AvatarPostResponseOutput>({
        response: {
          success: true,
          message: "app.api.v1.core.user.private.me.avatar.success.uploaded",
          avatarUrl: avatarUrl,
          uploadTime: new Date().toISOString(),
          nextSteps: [
            "app.api.v1.core.user.private.me.avatar.success.nextSteps.visible",
            "app.api.v1.core.user.private.me.avatar.success.nextSteps.update",
          ],
        },
      });
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.private.me.avatar.debug.errorUploadingUserAvatar",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.user.private.me.avatar.errors.failed_to_upload_avatar",
        ErrorResponseTypes.INTERNAL_ERROR,
        { userId, error: String(error) },
      );
    }
  }

  /**
   * Delete a user's avatar
   * @param userId - The user ID
   * @param logger - Logger instance for debugging and monitoring
   * @returns ResponseType with boolean result
   */
  async deleteAvatar(
    userId: DbId,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<AvatarDeleteResponseOutput>> {
    try {
      logger.debug(
        "app.api.v1.core.user.private.me.avatar.debug.deletingUserAvatar",
        { userId },
      );

      // Check if user exists
      const userResponse = await userRepository.getUserById(
        userId,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      );
      if (!userResponse.success) {
        return createErrorResponse(
          "app.api.v1.core.user.private.me.avatar.errors.user_not_found",
          ErrorResponseTypes.NOT_FOUND,
          { userId },
        );
      }

      // TODO: Implement deletion from storage service
      // TODO: Add avatar field to database schema

      // TODO: Uncomment when avatar field is added to DB schema
      // await db
      //   .update(users)
      //   .set({
      //     avatarUrl: null,
      //     updatedAt: new Date(),
      //   })
      //   .where(eq(users.id, userId));

      // Revalidate relevant paths
      revalidatePath(`/dashboard/profile`);
      revalidatePath(`/profile`);

      return createSuccessResponse<AvatarDeleteResponseOutput>({
        success: true,
        message: "app.api.v1.core.user.private.me.avatar.success.deleted",
        nextSteps: [
          "app.api.v1.core.user.private.me.avatar.success.nextSteps.default",
          "app.api.v1.core.user.private.me.avatar.success.nextSteps.uploadNew",
        ],
      });
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.private.me.avatar.debug.errorDeletingUserAvatar",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.user.private.me.avatar.errors.failed_to_delete_avatar",
        ErrorResponseTypes.INTERNAL_ERROR,
        { userId, error: String(error) },
      );
    }
  }
}

/**
 * Avatar repository singleton instance
 */
export const avatarRepository = new AvatarRepositoryImpl();
