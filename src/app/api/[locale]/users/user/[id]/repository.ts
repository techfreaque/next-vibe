/**
 * User By ID Repository Implementation
 * Business logic for CRUD operations on individual users
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { users } from "@/app/api/[locale]/user/db";
import type { CountryLanguage } from "@/i18n/core/config";

import { UserRolesRepository } from "../../../user/user-roles/repository";
import type {
  UserDeleteResponseOutput,
  UserDeleteUrlParamsTypeOutput,
  UserGetResponseOutput,
  UserGetUrlParamsTypeOutput,
  UserPutRequestOutput,
  UserPutResponseOutput,
  UserPutUrlParamsTypeOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class UserByIdRepository {
  static async getUserById(
    urlPathParams: UserGetUrlParamsTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserGetResponseOutput>> {
    try {
      logger.debug("Getting user by ID", {
        id: urlPathParams.id,
        requestingUser: user.id,
      });

      const [foundUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, urlPathParams.id))
        .limit(1);

      if (!foundUser) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("id.get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId: urlPathParams.id },
        });
      }

      logger.debug("User found successfully", { userId: foundUser.id });

      const userRolesResponse = await UserRolesRepository.findByUserId(
        foundUser.id,
        logger,
        locale,
      );

      // Default to empty array if roles fetch fails
      const userRoles = userRolesResponse.success ? userRolesResponse.data : [];

      if (!userRolesResponse.success) {
        logger.warn("Failed to fetch user roles", {
          userId: foundUser.id,
          error: userRolesResponse.message,
        });
      }

      return success({
        userProfile: {
          basicInfo: {
            id: foundUser.id,
            email: foundUser.email,
            privateName: foundUser.privateName,
            publicName: foundUser.publicName,
          },
        },
        accountStatus: {
          isActive: foundUser.isActive,
          emailVerified: foundUser.emailVerified,
          stripeCustomerId: foundUser.stripeCustomerId,
          userRoles: userRoles,
        },
        timestamps: {
          createdAt: foundUser.createdAt,
          updatedAt: foundUser.updatedAt,
        },
        leadId: null,
        email: foundUser.email,
        privateName: foundUser.privateName,
        publicName: foundUser.publicName,
        emailVerified: foundUser.emailVerified,
        isActive: foundUser.isActive,
        stripeCustomerId: foundUser.stripeCustomerId,
        userRoles: userRoles,
        createdAt: foundUser.createdAt,
        updatedAt: foundUser.updatedAt,
      });
    } catch (error) {
      logger.error("Error getting user by ID", parseError(error));
      const parsedError = parseError(error);
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("id.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  static async updateUser(
    data: UserPutRequestOutput,
    urlPathParams: UserPutUrlParamsTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserPutResponseOutput>> {
    try {
      logger.debug("Updating user", {
        id: urlPathParams.id,
        requestingUser: user.id,
      });

      // Check if user exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, urlPathParams.id))
        .limit(1);

      if (!existingUser) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("id.put.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId: urlPathParams.id },
        });
      }

      // Prepare update data
      const updateData: Partial<typeof users.$inferInsert> = {
        updatedBy: user.id,
      };

      // Handle flat field structure
      if (data.privateName !== undefined) {
        updateData.privateName = data.privateName;
      }
      if (data.publicName !== undefined) {
        updateData.publicName = data.publicName;
      }
      if (data.email !== undefined) {
        updateData.email = data.email;
      }
      if (data.isActive !== undefined) {
        updateData.isActive = data.isActive;
      }
      if (data.emailVerified !== undefined) {
        updateData.emailVerified = data.emailVerified;
      }
      if (data.isBanned !== undefined) {
        updateData.isBanned = data.isBanned;
      }
      if (data.bannedReason !== undefined) {
        updateData.bannedReason = data.bannedReason;
      }

      // Update user
      const [updatedUser] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, urlPathParams.id))
        .returning();

      if (!updatedUser) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("id.put.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.debug("User updated successfully", { userId: urlPathParams.id });

      const userRolesResponse = await UserRolesRepository.findByUserId(
        updatedUser.id,
        logger,
        locale,
      );

      // Default to empty array if roles fetch fails
      const userRoles = userRolesResponse.success ? userRolesResponse.data : [];

      if (!userRolesResponse.success) {
        logger.warn("Failed to fetch user roles", {
          userId: updatedUser.id,
          error: userRolesResponse.message,
        });
      }

      return success({
        id: updatedUser.id,
        leadId: null,
        email: updatedUser.email,
        privateName: updatedUser.privateName,
        publicName: updatedUser.publicName,
        emailVerified: updatedUser.emailVerified,
        isActive: updatedUser.isActive,
        isBanned: updatedUser.isBanned,
        bannedReason: updatedUser.bannedReason,
        stripeCustomerId: updatedUser.stripeCustomerId,
        userRoles: userRoles,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      });
    } catch (error) {
      logger.error("Error updating user", parseError(error));
      const parsedError = parseError(error);
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("id.put.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  static async deleteUser(
    urlPathParams: UserDeleteUrlParamsTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserDeleteResponseOutput>> {
    try {
      logger.debug("Deleting user", {
        id: urlPathParams.id,
        requestingUser: user.id,
      });

      // Check if user exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, urlPathParams.id))
        .limit(1);

      if (!existingUser) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("id.delete.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId: urlPathParams.id },
        });
      }

      // Delete user
      await db.delete(users).where(eq(users.id, urlPathParams.id));

      logger.debug("User deleted successfully", { userId: urlPathParams.id });

      return success({
        success: true,
        message: "User deleted successfully",
        deletedAt: new Date(),
      });
    } catch (error) {
      logger.error("Error deleting user", parseError(error));
      const parsedError = parseError(error);
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("id.delete.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}
