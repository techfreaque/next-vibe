/**
 * Avatar Repository
 * Handles user avatar operations
 */

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import { users } from "../../../db";
import { UserDetailLevel } from "../../../enum";
import { BaseUserRepositoryImpl, userRepository } from "../../../repository";
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
    logger: EndpointLogger,
  ): Promise<ResponseType<AvatarPostResponseOutput>>;

  /**
   * Delete a user's avatar
   */
  deleteAvatar(
    userId: DbId,
    logger: EndpointLogger,
  ): Promise<ResponseType<AvatarDeleteResponseOutput>>;
}

/**
 * Avatar Repository Implementation
 * Handles user avatar operations
 */
export class AvatarRepositoryImpl
  extends BaseUserRepositoryImpl
  implements AvatarRepository
{
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
        logger,
      );
      if (!userResponse.success) {
        return createErrorResponse(
          "userAvatar.errors.user_not_found",
          ErrorResponseTypes.NOT_FOUND,
          { userId },
        );
      }

      // Implementation would handle file upload to storage service
      // For now, simulate with a placeholder URL
      // TODO: Implement file upload to storage service
      const avatarUrl = `https://example.com/avatars/${userId}.jpg`;

      // Update user with new avatar URL
      await db
        .update(users)
        .set({
          imageUrl: avatarUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

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
        error,
      );
      return createErrorResponse(
        "userAvatar.errors.failed_to_upload_avatar",
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
        logger,
      );
      if (!userResponse.success) {
        return createErrorResponse(
          "userAvatar.errors.user_not_found",
          ErrorResponseTypes.NOT_FOUND,
          { userId },
        );
      }

      // Implementation would handle deleting from storage service

      // Update user to remove avatar URL
      await db
        .update(users)
        .set({
          imageUrl: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

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
        error,
      );
      return createErrorResponse(
        "userAvatar.errors.failed_to_delete_avatar",
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
