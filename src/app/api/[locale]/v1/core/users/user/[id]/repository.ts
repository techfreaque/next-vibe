/**
 * User By ID Repository Implementation
 * Business logic for CRUD operations on individual users
 */

import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { users } from "@/app/api/[locale]/v1/core/user/db";
import type { CountryLanguage } from "@/i18n/core/config";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type {
  UserDeleteResponseTypeOutput,
  UserGetResponseTypeOutput,
  UserPutRequestTypeOutput,
} from "./definition";

export interface UserByIdRepository {
  getUserById(
    data: { id: string },
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserGetResponseTypeOutput>>;

  updateUser(
    data: UserPutRequestTypeOutput,
    userId: string,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserGetResponseTypeOutput>>;

  deleteUser(
    data: { id: string },
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserDeleteResponseTypeOutput>>;
}

export class UserByIdRepositoryImpl implements UserByIdRepository {
  async getUserById(
    data: { id: string },
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserGetResponseTypeOutput>> {
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
        // Structured response format
        userProfile: {
          basicInfo: {
            id: foundUser.id,
            email: foundUser.email,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            company: foundUser.company,
          },
          contactDetails: {
            phone: foundUser.phone,
            preferredContactMethod: foundUser.preferredContactMethod,
            website: foundUser.website,
          },
        },
        profileDetails: {
          imageUrl: foundUser.imageUrl,
          bio: foundUser.bio,
          jobTitle: foundUser.jobTitle,
          leadId: foundUser.leadId,
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
        // Backward compatibility - flat fields
        leadId: foundUser.leadId,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        company: foundUser.company,
        phone: foundUser.phone,
        preferredContactMethod: foundUser.preferredContactMethod,
        imageUrl: foundUser.imageUrl,
        bio: foundUser.bio,
        website: foundUser.website,
        jobTitle: foundUser.jobTitle,
        emailVerified: foundUser.emailVerified,
        isActive: foundUser.isActive,
        stripeCustomerId: foundUser.stripeCustomerId,
        userRoles: [], // TODO: Fetch user roles from database
        createdAt: foundUser.createdAt.toISOString(),
        updatedAt: foundUser.updatedAt.toISOString(),
      });
    } catch (error) {
      logger.error("Error getting user by ID", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.users.user.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  async updateUser(
    data: UserPutRequestTypeOutput,
    userId: string,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserGetResponseTypeOutput>> {
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
      if (data.basicInfo?.firstName !== undefined) {
        updateData.firstName = data.basicInfo.firstName;
      }
      if (data.basicInfo?.lastName !== undefined) {
        updateData.lastName = data.basicInfo.lastName;
      }
      if (data.basicInfo?.company !== undefined) {
        updateData.company = data.basicInfo.company;
      }
      if (data.basicInfo?.jobTitle !== undefined) {
        updateData.jobTitle = data.basicInfo.jobTitle;
      }
      if (data.basicInfo?.email !== undefined) {
        updateData.email = data.basicInfo.email;
      }

      // Handle nested contactInfo structure
      if (data.contactInfo?.phone !== undefined) {
        updateData.phone = data.contactInfo.phone;
      }
      if (data.contactInfo?.website !== undefined) {
        updateData.website = data.contactInfo.website;
      }

      // Handle nested profileDetails structure
      if (data.profileDetails?.bio !== undefined) {
        updateData.bio = data.profileDetails.bio;
      }

      // Handle nested adminSettings structure
      if (data.adminSettings?.isActive !== undefined) {
        updateData.isActive = data.adminSettings.isActive;
      }
      if (data.adminSettings?.emailVerified !== undefined) {
        updateData.emailVerified = data.adminSettings.emailVerified;
      }
      if (data.adminSettings?.leadId !== undefined) {
        updateData.leadId = data.adminSettings.leadId;
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
        // Structured response format (same as GET)
        userProfile: {
          basicInfo: {
            id: updatedUser.id,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            company: updatedUser.company,
          },
          contactDetails: {
            phone: updatedUser.phone,
            preferredContactMethod: updatedUser.preferredContactMethod,
            website: updatedUser.website,
          },
        },
        profileDetails: {
          imageUrl: updatedUser.imageUrl,
          bio: updatedUser.bio,
          jobTitle: updatedUser.jobTitle,
          leadId: updatedUser.leadId,
        },
        accountStatus: {
          isActive: updatedUser.isActive,
          emailVerified: updatedUser.emailVerified,
          stripeCustomerId: updatedUser.stripeCustomerId,
          userRoles: [], // TODO: Fetch user roles from database
        },
        timestamps: {
          createdAt: updatedUser.createdAt.toISOString(),
          updatedAt: updatedUser.updatedAt.toISOString(),
        },
        // Backward compatibility - flat fields
        leadId: updatedUser.leadId,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        company: updatedUser.company,
        phone: updatedUser.phone,
        preferredContactMethod: updatedUser.preferredContactMethod,
        imageUrl: updatedUser.imageUrl,
        bio: updatedUser.bio,
        website: updatedUser.website,
        jobTitle: updatedUser.jobTitle,
        emailVerified: updatedUser.emailVerified,
        isActive: updatedUser.isActive,
        stripeCustomerId: updatedUser.stripeCustomerId,
        userRoles: [], // TODO: Fetch user roles from database
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
      });
    } catch (error) {
      logger.error("Error updating user", error);
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
  ): Promise<ResponseType<UserDeleteResponseTypeOutput>> {
    try {
      logger.debug("Deleting user", { id: data.id, requestingUser: user.id });

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
      logger.error("Error deleting user", error);
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
