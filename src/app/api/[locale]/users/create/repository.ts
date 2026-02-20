/**
 * Users Create Repository Implementation
 * Business logic for creating new users
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
import { hashPassword } from "next-vibe/shared/utils/password";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { type NewUser, userRoles, users } from "@/app/api/[locale]/user/db";
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
        return fail({
          message: "app.api.users.create.post.errors.internal.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Add roles if provided
      if (data.adminSettings?.roles && data.adminSettings.roles.length > 0) {
        await db.insert(userRoles).values(
          data.adminSettings.roles.map((role) => ({
            userId: createdUser.id,
            role: role as (typeof userRoles.$inferInsert)["role"],
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
          message: t("app.api.users.create.post.success.message.content"),
        },
        userInfo: {
          id: createdUser.id,
          email: createdUser.email,
          privateName: createdUser.privateName,
          publicName: createdUser.publicName,
          createdAt: createdUser.createdAt,
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
        responseCreatedAt: createdUser.createdAt,
        responseUpdatedAt: createdUser.updatedAt,
      };

      // Send SMS notifications (fire and forget - don't fail user creation if SMS fails)
      void sendWelcomeSms(responseData, logger)
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

      return success(responseData);
    } catch (error) {
      logger.error("Error creating user", parseError(error));
      return fail({
        message: "app.api.users.create.post.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { details: parseError(error).message },
      });
    }
  }
}

export const userCreateRepository = new UserCreateRepositoryImpl();
