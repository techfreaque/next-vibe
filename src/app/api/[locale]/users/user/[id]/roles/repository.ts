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

import type {
  UserRoleDeleteRequestOutput,
  UserRoleDeleteResponseOutput,
  UserRoleDeleteUrlParamsOutput,
  UserRolePostRequestOutput,
  UserRolePostResponseOutput,
  UserRolePostUrlParamsOutput,
} from "./definition";

export class UserRoleManagementRepository {
  static async addUserRole(
    data: UserRolePostRequestOutput,
    urlPathParams: UserRolePostUrlParamsOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
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
      return fail({
        message: "app.api.users.user.errors.not_found.title",
        errorType: ErrorResponseTypes.NOT_FOUND,
        messageParams: { userId: urlPathParams.id },
      });
    }

    const result = await UserRolesRepository.addRole(
      { userId: urlPathParams.id, role: data.role },
      logger,
    );

    if (!result.success || !result.data) {
      return fail({
        message: "app.api.users.user.id.roles.errors.add_failed",
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
      return fail({
        message: "app.api.users.user.errors.not_found.title",
        errorType: ErrorResponseTypes.NOT_FOUND,
        messageParams: { userId: urlPathParams.id },
      });
    }

    const result = await UserRolesRepository.removeRole(
      urlPathParams.id,
      data.role,
      logger,
    );

    if (!result.success) {
      return fail({
        message: "app.api.users.user.id.roles.errors.remove_failed",
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
