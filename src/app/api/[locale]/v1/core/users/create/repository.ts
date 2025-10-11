/**
 * Users Create Repository Implementation
 * Business logic for creating new users
 */

import "server-only";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { type NewUser, users } from "@/app/api/[locale]/v1/core/user/db";
import { PreferredContactMethod } from "@/app/api/[locale]/v1/core/user/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { hashPassword } from "next-vibe/shared/utils/password";

import type {
  UserCreateRequestTypeOutput,
  UserCreateResponseTypeOutput,
} from "./definition";
import { sendWelcomeSms } from "./sms";

export interface UserCreateRepository {
  createUser(
    data: UserCreateRequestTypeOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: TFunction,
  ): Promise<ResponseType<UserCreateResponseTypeOutput>>;
}

export class UserCreateRepositoryImpl implements UserCreateRepository {
  async createUser(
    data: UserCreateRequestTypeOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: TFunction,
  ): Promise<ResponseType<UserCreateResponseTypeOutput>> {
    try {
      logger.debug("Creating user", {
        email: data.basicInfo.email,
        requestingUser: user.id,
      });

      // Hash password if provided, use a default value if not
      const hashedPassword = data.basicInfo.password
        ? await hashPassword(data.basicInfo.password)
        : null; // Users without passwords will need to set one later

      // Prepare user data
      const newUser: NewUser = {
        leadId: data.adminSettings?.leadId || null,
        email: data.basicInfo.email,
        firstName: data.basicInfo.firstName,
        lastName: data.basicInfo.lastName,
        company: data.organizationInfo.company,
        phone: data.contactInfo?.phone || null,
        preferredContactMethod: PreferredContactMethod.EMAIL, // Default for now due to type complexity
        imageUrl: data.profileInfo?.imageUrl || null,
        bio: data.profileInfo?.bio || null,
        isActive: data.adminSettings?.isActive ?? true,
        emailVerified: data.adminSettings?.emailVerified ?? false,
        password: hashedPassword || "", // Provide empty string as fallback for non-null constraint
        createdBy: user.id,
        updatedBy: user.id,
      };

      // Insert user
      const [createdUser] = await db.insert(users).values(newUser).returning();

      if (!createdUser) {
        return createErrorResponse(
          "app.api.v1.core.users.create.post.errors.internal.title",
          ErrorResponseTypes.INTERNAL_ERROR,
          { error: "app.api.v1.core.users.create.errors.internal.description" },
        );
      }

      // Add roles if provided - skip for now due to type complexity
      // TODO: Fix role insertion with proper type mapping
      // if (data.adminSettings?.roles && data.adminSettings.roles.length > 0) {
      //   const roleInserts = data.adminSettings.roles.map((role) => ({
      //     userId: createdUser.id,
      //     role: role,
      //     assignedBy: user.id,
      //   }));
      //
      //   await db.insert(userRoles).values(roleInserts);
      // }

      logger.debug("User created successfully", { userId: createdUser.id });

      // Prepare response data
      const responseData: UserCreateResponseTypeOutput = {
        success: {
          created: true,
          message: "app.api.v1.core.users.create.post.success.message.content",
        },
        userInfo: {
          id: createdUser.id,
          email: createdUser.email,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          company: createdUser.company,
          createdAt: createdUser.createdAt.toISOString(),
        },
        responseId: createdUser.id,
        responseLeadId: createdUser.leadId,
        responseEmail: createdUser.email,
        responseFirstName: createdUser.firstName,
        responseLastName: createdUser.lastName,
        responseCompany: createdUser.company,
        responsePhone: createdUser.phone,
        responsePreferredContactMethod: createdUser.preferredContactMethod
          ? ((
              JSON.parse(createdUser.preferredContactMethod) as string[]
            )[0] as (typeof PreferredContactMethod)[keyof typeof PreferredContactMethod])
          : PreferredContactMethod.EMAIL,
        responseImageUrl: createdUser.imageUrl,
        responseBio: createdUser.bio,
        responseWebsite: null,
        responseJobTitle: null,
        responseEmailVerified: createdUser.emailVerified,
        responseIsActive: createdUser.isActive,
        responseStripeCustomerId: null,
        responseUserRoles: [],
        responseCreatedAt: createdUser.createdAt.toISOString(),
        responseUpdatedAt: createdUser.updatedAt.toISOString(),
      };

      // Send SMS notifications if phone number is provided
      if (responseData.responsePhone) {
        logger.debug("Sending SMS notifications for new user", {
          userId: responseData.responseId,
          phone: responseData.responsePhone,
        });

        // Send welcome SMS (fire and forget - don't fail user creation if SMS fails)
        sendWelcomeSms(responseData, user, locale, logger, t)
          .then((result) => {
            if (result.success) {
              logger.debug("Welcome SMS sent successfully", {
                userId: responseData.responseId,
                messageId: result.data.messageId,
              });
            } else {
              logger.warn("Welcome SMS failed to send", {
                userId: responseData.responseId,
                error: result.error,
              });
            }
          })
          .catch((error) => {
            logger.warn("Welcome SMS sending encountered an error", {
              userId: responseData.responseId,
              error: parseError(error).message,
            });
          });
      }

      return createSuccessResponse(responseData);
    } catch (error) {
      logger.error("Error creating user", error);
      return createErrorResponse(
        "app.api.v1.core.users.create.post.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }
}

export const userCreateRepository = new UserCreateRepositoryImpl();
