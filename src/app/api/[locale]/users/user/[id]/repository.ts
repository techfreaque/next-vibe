/**
 * User By ID Repository Implementation
 * Business logic for CRUD operations on individual users
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { users } from "@/app/api/[locale]/user/db";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  UserDeleteRequestOutput,
  UserDeleteResponseOutput,
  UserGetResponseOutput,
  UserPutRequestOutput,
  UserPutResponseOutput,
} from "./definition";

export interface UserByIdRepository {
  getUserById(
    data: { id: string },
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserGetResponseOutput>>;

  updateUser(
    data: UserPutRequestOutput,
    userId: string,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserPutResponseOutput>>;

  deleteUser(
    data: { id: string },
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserDeleteResponseOutput>>;
}

export class UserByIdRepositoryImpl implements UserByIdRepository {
  async getUserById(
    data: { id: string },
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserGetResponseOutput>> {
    try {
      logger.debug("Getting user by ID", {
        id: data.id,
        requestingUser: user.id,
      });

      const [foundUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, data.id))
        .limit(1);

      if (!foundUser) {
        return fail({
          message: "app.api.users.user.errors.not_found.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId: data.id },
        });
      }

      logger.debug("User found successfully", { userId: foundUser.id });

      // Fetch user roles from database
      const { userRolesRepository } =
        await import("@/app/api/[locale]/user/user-roles/repository");
      const userRolesResponse = await userRolesRepository.findByUserId(
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

  async updateUser(
    data: UserPutRequestOutput,
    userId: string,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserPutResponseOutput>> {
    try {
      logger.debug("Updating user", { id: userId, requestingUser: user.id });

      // Check if user exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!existingUser) {
        return fail({
          message: "app.api.users.user.errors.not_found.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId: userId },
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
        .where(eq(users.id, userId))
        .returning();

      if (!updatedUser) {
        return fail({
          message: "app.api.users.user.errors.internal.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.debug("User updated successfully", { userId });

      // Fetch user roles from database
      const { userRolesRepository } =
        await import("@/app/api/[locale]/user/user-roles/repository");
      const userRolesResponse = await userRolesRepository.findByUserId(
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

  async deleteUser(
    data: UserDeleteRequestOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserDeleteResponseOutput>> {
    try {
      logger.debug("Deleting user", {
        id: data.id,
        requestingUser: user.id,
      });

      // Check if user exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, data.id))
        .limit(1);

      if (!existingUser) {
        return fail({
          message: "app.api.users.user.errors.not_found.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId: data.id },
        });
      }

      // Delete user
      await db.delete(users).where(eq(users.id, data.id));

      logger.debug("User deleted successfully", { userId: data.id });

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

export const userByIdRepository = new UserByIdRepositoryImpl();
