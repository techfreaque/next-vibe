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

export class UserByIdRepository {
  static async getUserById(
    urlPathParams: UserGetUrlParamsTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
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
        return fail({
          message: "app.api.users.user.errors.not_found.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId: urlPathParams.id },
        });
      }

      logger.debug("User found successfully", { userId: foundUser.id });

      const userRolesResponse = await UserRolesRepository.findByUserId(
        foundUser.id,
        logger,
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
          createdAt: foundUser.createdAt.toISOString(),
          updatedAt: foundUser.updatedAt.toISOString(),
        },
        leadId: null,
        email: foundUser.email,
        privateName: foundUser.privateName,
        publicName: foundUser.publicName,
        emailVerified: foundUser.emailVerified,
        isActive: foundUser.isActive,
        stripeCustomerId: foundUser.stripeCustomerId,
        userRoles: userRoles,
        createdAt: foundUser.createdAt.toISOString(),
        updatedAt: foundUser.updatedAt.toISOString(),
      });
    } catch (error) {
      logger.error("Error getting user by ID", parseError(error));
      const parsedError = parseError(error);
      return fail({
        message: "app.api.users.user.errors.internal.title",
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
        return fail({
          message: "app.api.users.user.errors.not_found.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId: urlPathParams.id },
        });
      }

      // Prepare update data
      const updateData: Partial<typeof users.$inferInsert> = {
        updatedBy: user.id,
      };

      // Handle nested basicInfo structure
      if (data.basicInfo?.privateName !== undefined) {
        updateData.privateName = data.basicInfo.privateName;
      }
      if (data.basicInfo?.publicName !== undefined) {
        updateData.publicName = data.basicInfo.publicName;
      }
      if (data.basicInfo?.email !== undefined) {
        updateData.email = data.basicInfo.email;
      }

      // Handle nested adminSettings structure
      if (data.adminSettings?.isActive !== undefined) {
        updateData.isActive = data.adminSettings.isActive;
      }
      if (data.adminSettings?.emailVerified !== undefined) {
        updateData.emailVerified = data.adminSettings.emailVerified;
      }

      // Update user
      const [updatedUser] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, urlPathParams.id))
        .returning();

      if (!updatedUser) {
        return fail({
          message: "app.api.users.user.errors.internal.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.debug("User updated successfully", { userId: urlPathParams.id });

      const userRolesResponse = await UserRolesRepository.findByUserId(
        updatedUser.id,
        logger,
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
        stripeCustomerId: updatedUser.stripeCustomerId,
        userRoles: userRoles,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
      });
    } catch (error) {
      logger.error("Error updating user", parseError(error));
      const parsedError = parseError(error);
      return fail({
        message: "app.api.users.user.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  static async deleteUser(
    urlPathParams: UserDeleteUrlParamsTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
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
        return fail({
          message: "app.api.users.user.errors.not_found.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId: urlPathParams.id },
        });
      }

      // Delete user
      await db.delete(users).where(eq(users.id, urlPathParams.id));

      logger.debug("User deleted successfully", { userId: urlPathParams.id });

      return success({
        success: true,
        message: "app.api.users.user.delete.success.title",
        deletedAt: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Error deleting user", parseError(error));
      const parsedError = parseError(error);
      return fail({
        message: "app.api.users.user.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}
