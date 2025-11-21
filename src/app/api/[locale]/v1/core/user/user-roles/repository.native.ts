/**
 * Native User Roles Repository
 * Implements UserRolesRepository interface for React Native
 *
 * POLYFILL PATTERN: This file makes the same repository interface work on native
 * by calling HTTP endpoints instead of direct database access.
 *
 * IMPLEMENTATION STRATEGY:
 * - All methods return "not implemented" errors (not used in page.tsx)
 * - Can be implemented with nativeEndpoint() when needed
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import type { NewUserRole, UserRole } from "../db";
import type { UserRole as UserRoleEnum, UserPermissionRoleValue } from "./enum";
// Import interface for type compatibility
import type { UserRolesRepository } from "./repository";

/**
 * Native User Roles Repository Implementation
 * Uses HTTP client to call API endpoints
 */
class UserRolesRepositoryNativeImpl implements UserRolesRepository {
  private createNotImplementedError<T>(method: string): ResponseType<T> {
    return fail({
      message: "app.api.v1.core.user.userRoles.errors.endpoint_not_created",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { method },
    });
  }

  async findByUserId(
    userId: DbId,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserRole[]>> {
    logger.warn(
      "findByUserId not implemented on native - not used in page.tsx",
    );
    return await Promise.resolve(
      this.createNotImplementedError<UserRole[]>("findByUserId"),
    );
  }

  async findByUserIds(
    userIds: DbId[],
    logger: EndpointLogger,
  ): Promise<ResponseType<Map<DbId, UserRole[]>>> {
    logger.warn(
      "findByUserIds not implemented on native - not used in page.tsx",
    );
    return await Promise.resolve(
      this.createNotImplementedError<Map<DbId, UserRole[]>>("findByUserIds"),
    );
  }

  async deleteByUserId(
    userId: DbId,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    logger.warn(
      "deleteByUserId not implemented on native - not used in page.tsx",
    );
    return await Promise.resolve(
      this.createNotImplementedError<void>("deleteByUserId"),
    );
  }

  async findByUserIdAndRole(
    userId: DbId,
    role: (typeof UserRoleEnum)[keyof typeof UserRoleEnum],
    logger: EndpointLogger,
  ): Promise<ResponseType<UserRole>> {
    logger.warn(
      "findByUserIdAndRole not implemented on native - not used in page.tsx",
    );
    return await Promise.resolve(
      this.createNotImplementedError<UserRole>("findByUserIdAndRole"),
    );
  }

  async addRole(
    data: NewUserRole,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserRole>> {
    logger.warn("addRole not implemented on native - not used in page.tsx");
    return await Promise.resolve(
      this.createNotImplementedError<UserRole>("addRole"),
    );
  }

  async removeRole(
    userId: DbId,
    role: (typeof UserRoleEnum)[keyof typeof UserRoleEnum],
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    logger.warn("removeRole not implemented on native - not used in page.tsx");
    return await Promise.resolve(
      this.createNotImplementedError<boolean>("removeRole"),
    );
  }

  async hasRole(
    userId: DbId,
    role: (typeof UserRoleEnum)[keyof typeof UserRoleEnum],
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    logger.warn("hasRole not implemented on native - not used in page.tsx");
    return await Promise.resolve(
      this.createNotImplementedError<boolean>("hasRole"),
    );
  }

  async getUserRoles(
    userId: DbId,
    logger: EndpointLogger,
  ): Promise<ResponseType<(typeof UserPermissionRoleValue)[]>> {
    logger.warn(
      "getUserRoles not implemented on native - not used in page.tsx",
    );
    return await Promise.resolve(
      this.createNotImplementedError<(typeof UserPermissionRoleValue)[]>("getUserRoles"),
    );
  }
}

/**
 * Singleton instance
 * Export with same name as server implementation for drop-in replacement
 */
export const userRolesRepository = new UserRolesRepositoryNativeImpl();
