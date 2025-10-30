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
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
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
      logger.debug(
        "app.api.v1.core.user.private.me.avatar.debug.uploadingUserAvatar",
        { userId, fileName: file.name, fileSize: file.size, fileType: file.type },
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

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return createErrorResponse(
          "app.api.v1.core.user.private.me.avatar.errors.invalid_file_type",
          ErrorResponseTypes.VALIDATION_ERROR,
          { allowedTypes: allowedTypes.join(", "), providedType: file.type },
        );
      }

      // Validate file size (max 5MB)
      const maxSizeBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeBytes) {
        return createErrorResponse(
          "app.api.v1.core.user.private.me.avatar.errors.file_too_large",
          ErrorResponseTypes.VALIDATION_ERROR,
          { maxSize: "5MB", providedSize: `${Math.round(file.size / 1024 / 1024)}MB` },
        );
      }

      // Convert file to base64 and store in database
      // In a production environment, this should upload to a cloud storage service (S3, Cloudinary, etc.)
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const avatarUrl = `data:${file.type};base64,${base64}`;

      // Update user avatar in database
      const { eq } = await import("drizzle-orm");
      const { db } = await import("@/app/api/[locale]/v1/core/system/db");
      const { users } = await import("../../../db");

      await db
        .update(users)
        .set({
          avatarUrl: avatarUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      logger.info("Avatar uploaded successfully", {
        userId,
        fileType: file.type,
        fileSize: file.size,
      });

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

      // Delete avatar from database
      const { eq } = await import("drizzle-orm");
      const { db } = await import("@/app/api/[locale]/v1/core/system/db");
      const { users } = await import("../../../db");

      await db
        .update(users)
        .set({
          avatarUrl: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      logger.info("Avatar deleted successfully", { userId });

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
