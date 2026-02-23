/**
 * Avatar Repository
 * Handles user avatar operations
 */

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { DbId } from "@/app/api/[locale]/system/db/types";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { UserDetailLevel } from "../../../enum";
import { UserRepository } from "../../../repository";
import type {
  AvatarDeleteResponseOutput,
  AvatarPostResponseOutput,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

/**
 * Avatar Repository - Static class pattern
 * Handles user avatar operations
 */
export class AvatarRepository {
  /**
   * Upload a user's avatar
   * @param userId - The user ID
   * @param file - The avatar file
   * @param logger - Logger instance for debugging and monitoring
   * @returns ResponseType with avatar URL
   */
  static async uploadAvatar(
    userId: DbId,
    file: File,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<AvatarPostResponseOutput>> {
    try {
      logger.debug("Uploading user avatar", {
        userId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      // Check if user exists
      const userResponse = await UserRepository.getUserById(
        userId,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      );
      if (!userResponse.success) {
        return fail({
          message: t("errors.user_not_found"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId },
          cause: userResponse,
        });
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        return fail({
          message: t("errors.invalid_file_type"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            allowedTypes: allowedTypes.join(", "),
            providedType: file.type,
          },
        });
      }

      // Validate file size (max 5MB)
      const maxSizeBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeBytes) {
        return fail({
          message: t("errors.file_too_large"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            maxSize: "5MB",
            providedSize: `${Math.round(file.size / 1024 / 1024)}MB`,
          },
        });
      }

      // Convert file to base64 and store in database
      // In a production environment, this should upload to a cloud storage service (S3, Cloudinary, etc.)
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      const avatarUrl = `data:${file.type};base64,${base64}`;

      // Update user avatar in database
      const { eq } = await import("drizzle-orm");
      const { db } = await import("@/app/api/[locale]/system/db");
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

      return success<AvatarPostResponseOutput>({
        response: {
          success: true,
          message: t("success.uploaded"),
          avatarUrl: avatarUrl,
          uploadTime: new Date().toISOString(),
          nextSteps: [
            t("success.nextSteps.visible"),
            t("success.nextSteps.update"),
          ],
        },
      });
    } catch (error) {
      logger.error("Error uploading user avatar", parseError(error));
      return fail({
        message: t("errors.failed_to_upload_avatar"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { userId, error: String(error) },
      });
    }
  }

  /**
   * Delete a user's avatar
   * @param userId - The user ID
   * @param logger - Logger instance for debugging and monitoring
   * @returns ResponseType with boolean result
   */
  static async deleteAvatar(
    userId: DbId,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<AvatarDeleteResponseOutput>> {
    try {
      logger.debug("Deleting user avatar", { userId });

      // Check if user exists
      const userResponse = await UserRepository.getUserById(
        userId,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      );
      if (!userResponse.success) {
        return fail({
          message: t("errors.user_not_found"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId },
          cause: userResponse,
        });
      }

      // Delete avatar from database
      const { eq } = await import("drizzle-orm");
      const { db } = await import("@/app/api/[locale]/system/db");
      const { users } = await import("../../../db");

      await db
        .update(users)
        .set({
          avatarUrl: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      logger.info("Avatar deleted successfully", { userId });

      return success<AvatarDeleteResponseOutput>({
        success: true,
        message: t("success.deleted"),
        nextSteps: [
          t("success.nextSteps.default"),
          t("success.nextSteps.uploadNew"),
        ],
      });
    } catch (error) {
      logger.error("Error deleting user avatar", parseError(error));
      return fail({
        message: t("errors.failed_to_delete_avatar"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { userId, error: String(error) },
      });
    }
  }
}
