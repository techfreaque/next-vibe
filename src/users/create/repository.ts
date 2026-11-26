/**
 * Users Create Repository Implementation
 * Business logic for creating new users
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLocaleFromLanguageAndCountry } from "next-vibe/core/i18n/core/language-utils";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { withTransaction } from "next-vibe/database/utils/repository-helpers";
import { hashPassword } from "next-vibe/identity/auth/password";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { type NewUser, userRoles, users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import type {
  UserCreateRequestOutput,
  UserCreateResponseOutput,
} from "./definition";
import type { UsersCreateT } from "./i18n";

export class UserCreateRepository {
  static async createUser(
    data: UserCreateRequestOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: UsersCreateT,
  ): Promise<ResponseType<UserCreateResponseOutput>> {
    if (!user.roles.includes(UserPermissionRole.ADMIN)) {
      return fail({
        message: t("post.errors.forbidden.description"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }
    try {
      logger.debug("Creating user", {
        requestingUser: user.id,
        locale,
      });

      // Hash password
      const hashedPassword = await hashPassword(data.basicInfo.password);

      // Prepare user data using actual schema fields
      const newUser: NewUser = {
        email: data.basicInfo.email,
        password: hashedPassword,
        privateName: data.basicInfo.privateName,
        publicName: data.basicInfo.publicName,
        locale: getLocaleFromLanguageAndCountry(
          data.basicInfo.language,
          data.basicInfo.country,
        ),
        isActive: data.adminSettings?.isActive ?? true,
        emailVerified: data.adminSettings?.emailVerified ?? false,
        marketingConsent: false,
        isBanned: false,
        bannedReason: null,
        stripeCustomerId: null,
        createdBy: user.id,
        updatedBy: user.id,
      };

      return await withTransaction(logger, async (tx) => {
        const [createdUser] = await tx
          .insert(users)
          .values(newUser)
          .onConflictDoNothing({ target: users.email })
          .returning();
        if (!createdUser) {
          return fail({
            message: t("post.errors.conflict.description"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
        const roles = [...new Set(data.adminSettings?.roles)];
        const userRolesResult =
          roles.length > 0
            ? await tx
                .insert(userRoles)
                .values(
                  roles.map((role) => ({
                    userId: createdUser.id,
                    role,
                    assignedBy: user.id,
                  })),
                )
                .returning({ id: userRoles.id, role: userRoles.role })
            : [];
        logger.debug("User created successfully", { userId: createdUser.id });

        // Prepare response data
        const responseData: UserCreateResponseOutput = {
          success: {
            created: true,
            message: t("post.success.message.content"),
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
          responseUserRoles: userRolesResult,
          responseCreatedAt: createdUser.createdAt,
          responseUpdatedAt: createdUser.updatedAt,
        };

        return success(responseData);
      });
    } catch (error) {
      logger.error("Could not create account", {
        errorName: parseError(error).name,
      });
      return fail({
        message: t("post.errors.internal.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
