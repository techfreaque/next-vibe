/**
 * User Role Management Repository
 * Handles adding and removing roles from users
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { users } from "@/app/api/[locale]/user/db";
import { UserRolesRepository } from "@/app/api/[locale]/user/user-roles/repository";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  UserRoleDeleteRequestOutput,
  UserRoleDeleteResponseOutput,
  UserRoleDeleteUrlParamsOutput,
  UserRolePostRequestOutput,
  UserRolePostResponseOutput,
  UserRolePostUrlParamsOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class UserRoleManagementRepository {
  static async addUserRole(
    data: UserRolePostRequestOutput,
    urlPathParams: UserRolePostUrlParamsOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserRolePostResponseOutput>> {
    logger.debug("Adding role to user", {
      targetUserId: urlPathParams.id,
      role: data.role,
      requestingUser: user.id,
    });

    // Verify target user exists
    const [targetUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, urlPathParams.id))
      .limit(1);

    if (!targetUser) {
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("roles.post.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
        messageParams: { userId: urlPathParams.id },
      });
    }

    const result = await UserRolesRepository.addRole(
      { userId: urlPathParams.id, role: data.role },
      logger,
      locale,
    );

    if (!result.success || !result.data) {
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("roles.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { userId: urlPathParams.id, role: data.role },
      });
    }

    logger.debug("Role added successfully", {
      targetUserId: urlPathParams.id,
      role: data.role,
      roleId: result.data.id,
    });

    return success({
      roleId: result.data.id,
      userId: result.data.userId,
      assignedRole: result.data.role,
    });
  }

  static async removeUserRole(
    data: UserRoleDeleteRequestOutput,
    urlPathParams: UserRoleDeleteUrlParamsOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserRoleDeleteResponseOutput>> {
    logger.debug("Removing role from user", {
      targetUserId: urlPathParams.id,
      role: data.role,
      requestingUser: user.id,
    });

    // Verify target user exists
    const [targetUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, urlPathParams.id))
      .limit(1);

    if (!targetUser) {
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("roles.delete.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
        messageParams: { userId: urlPathParams.id },
      });
    }

    const result = await UserRolesRepository.removeRole(
      urlPathParams.id,
      data.role,
      logger,
      locale,
    );

    if (!result.success) {
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("roles.delete.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { userId: urlPathParams.id, role: data.role },
      });
    }

    logger.debug("Role removed successfully", {
      targetUserId: urlPathParams.id,
      role: data.role,
    });

    return success({
      success: result.data ?? false,
    });
  }
}
