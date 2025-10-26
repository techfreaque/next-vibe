/**
 * User By ID Repository Implementation
 * Business logic for CRUD operations on individual users
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
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { users } from "@/app/api/[locale]/v1/core/user/db";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
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
        return createErrorResponse(
          "app.api.v1.core.users.user.errors.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
          { userId: data.id },
        );
      }

      logger.debug("User found successfully", { userId: foundUser.id });

      return createSuccessResponse({
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
          userRoles: [], // TODO: Fetch user roles from database
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
        userRoles: [], // TODO: Fetch user roles from database
        createdAt: foundUser.createdAt.toISOString(),
        updatedAt: foundUser.updatedAt.toISOString(),
      });
    } catch (error) {
      logger.error("Error getting user by ID", parseError(error));
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.users.user.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
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
        return createErrorResponse(
          "app.api.v1.core.users.user.errors.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
          { userId: userId },
        );
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
        return createErrorResponse(
          "app.api.v1.core.users.user.errors.internal.title",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }

      logger.debug("User updated successfully", { userId });

      return createSuccessResponse({
        id: updatedUser.id,
        leadId: null,
        email: updatedUser.email,
        privateName: updatedUser.privateName,
        publicName: updatedUser.publicName,
        emailVerified: updatedUser.emailVerified,
        isActive: updatedUser.isActive,
        stripeCustomerId: updatedUser.stripeCustomerId,
        userRoles: [], // TODO: Fetch user roles from database
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
      });
    } catch (error) {
      logger.error("Error updating user", parseError(error));
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.users.user.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  async deleteUser(
    data: { id: string },
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserDeleteResponseOutput>> {
    try {
      logger.debug("Deleting user", { id: data.id?.toISOString() || null, requestingUser: user.id });

      // Check if user exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, data.id))
        .limit(1);

      if (!existingUser) {
        return createErrorResponse(
          "app.api.v1.core.users.user.errors.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
          { userId: data.id },
        );
      }

      // Delete user
      await db.delete(users).where(eq(users.id, data.id));

      logger.debug("User deleted successfully", { userId: data.id });

      return createSuccessResponse({
        // Structured response format
        deletionResult: {
          success: true,
          message: "app.api.v1.core.users.user.delete.success.title",
          deletedAt: new Date().toISOString(),
        },
        // Backward compatibility - flat fields
        success: true,
        message: "app.api.v1.core.users.user.delete.success.title",
      });
    } catch (error) {
      logger.error("Error deleting user", parseError(error));
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.users.user.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }
}

export const userByIdRepository = new UserByIdRepositoryImpl();
