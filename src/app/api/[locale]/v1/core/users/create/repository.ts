/**
 * Users Create Repository Implementation
 * Business logic for creating new users
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
import { hashPassword } from "next-vibe/shared/utils/password";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import {
  type NewUser,
  userRoles,
  users,
} from "@/app/api/[locale]/v1/core/user/db";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type {
  UserCreateRequestOutput,
  UserCreateResponseOutput,
} from "./definition";
import { sendWelcomeSms } from "./sms";

export interface UserCreateRepository {
  createUser(
    data: UserCreateRequestOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: TFunction,
  ): Promise<ResponseType<UserCreateResponseOutput>>;
}

export class UserCreateRepositoryImpl implements UserCreateRepository {
  async createUser(
    data: UserCreateRequestOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: TFunction,
  ): Promise<ResponseType<UserCreateResponseOutput>> {
    try {
      logger.debug("Creating user", {
        email: data.basicInfo.email,
        requestingUser: user.id,
      });

      // Hash password
      const hashedPassword = await hashPassword(data.basicInfo.password);

      // Prepare user data using actual schema fields
      const newUser: NewUser = {
        email: data.basicInfo.email,
        password: hashedPassword,
        privateName: data.basicInfo.privateName,
        publicName: data.basicInfo.publicName,
        locale,
        isActive: data.adminSettings?.isActive ?? true,
        emailVerified: data.adminSettings?.emailVerified ?? false,
        marketingConsent: false,
        isBanned: false,
        bannedReason: null,
        stripeCustomerId: null,
        createdBy: user.id,
        updatedBy: user.id,
      };

      // Insert user
      const [createdUser] = await db.insert(users).values(newUser).returning();

      if (!createdUser) {
        return createErrorResponse(
          "app.api.v1.core.users.create.post.errors.internal.title",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }

      // Add roles if provided
      if (data.adminSettings?.roles && data.adminSettings.roles.length > 0) {
        await db.insert(userRoles).values(
          data.adminSettings.roles.map((role) => ({
            userId: createdUser.id,
            role,
            assignedBy: user.id,
          })),
        );
      }

      // Fetch user roles for response
      const userRolesResult = await db
        .select()
        .from(userRoles)
        .where(eq(userRoles.userId, createdUser.id));

      logger.debug("User created successfully", { userId: createdUser.id });

      // Prepare response data
      const responseData: UserCreateResponseOutput = {
        success: {
          created: true,
          message: t(
            "app.api.v1.core.users.create.post.success.message.content",
          ),
        },
        userInfo: {
          id: createdUser.id,
          email: createdUser.email,
          privateName: createdUser.privateName,
          publicName: createdUser.publicName,
          createdAt: createdUser.createdAt.toISOString(),
        },
        responseId: createdUser.id,
        responseLeadId: null,
        responseEmail: createdUser.email,
        responsePrivateName: createdUser.privateName,
        responsePublicName: createdUser.publicName,
        responseEmailVerified: createdUser.emailVerified,
        responseIsActive: createdUser.isActive,
        responseStripeCustomerId: createdUser.stripeCustomerId,
        responseUserRoles: userRolesResult.map((r) => ({
          id: r.id,
          role: r.role,
        })),
        responseCreatedAt: createdUser.createdAt.toISOString(),
        responseUpdatedAt: createdUser.updatedAt.toISOString(),
      };

      // Send SMS notifications (fire and forget - don't fail user creation if SMS fails)
      void sendWelcomeSms(responseData, user, locale, logger)
        .then((result) => {
          if (result.success) {
            logger.debug("Welcome SMS sent successfully", {
              userId: responseData.responseId,
            });
          } else {
            logger.error("Welcome SMS failed to send", {
              userId: responseData.responseId,
              error: result.message,
            });
          }
          return;
        })
        .catch((error) => {
          logger.error("Welcome SMS sending encountered an error", {
            userId: responseData.responseId,
            error: error instanceof Error ? error.message : String(error),
          });
          return;
        });

      return createSuccessResponse(responseData);
    } catch (error) {
      logger.error("Error creating user", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.users.create.post.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { details: parseError(error).message },
      );
    }
  }
}

export const userCreateRepository = new UserCreateRepositoryImpl();
