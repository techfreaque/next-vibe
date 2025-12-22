/**
 * Native User Roles Repository
 * Implements UserRolesRepository interface for React Native
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { DbId } from "@/app/api/[locale]/system/db/types";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { NewUserRole, UserRole } from "../db";
import type { UserPermissionRoleValue, UserRole as UserRoleEnum } from "./enum";
import type { UserRolesRepositoryType } from "./repository";

/**
 * Native User Roles Repository
 */
export class UserRolesRepository {
  static async findByUserId(
    // oxlint-disable-next-line no-unused-vars
    _userId: DbId,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<UserRole[]>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("findByUserId is not implemented on native");
  }

  static async findByUserIds(
    // oxlint-disable-next-line no-unused-vars
    _userIds: DbId[],
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<Map<DbId, UserRole[]>>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("findByUserIds is not implemented on native");
  }

  static async deleteByUserId(
    // oxlint-disable-next-line no-unused-vars
    _userId: DbId,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("deleteByUserId is not implemented on native");
  }

  static async findByUserIdAndRole(
    // oxlint-disable-next-line no-unused-vars
    _userId: DbId,
    // oxlint-disable-next-line no-unused-vars
    _role: (typeof UserRoleEnum)[keyof typeof UserRoleEnum],
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<UserRole>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("findByUserIdAndRole is not implemented on native");
  }

  static async addRole(
    // oxlint-disable-next-line no-unused-vars
    _data: NewUserRole,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<UserRole>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("addRole is not implemented on native");
  }

  static async removeRole(
    // oxlint-disable-next-line no-unused-vars
    _userId: DbId,
    // oxlint-disable-next-line no-unused-vars
    _role: (typeof UserRoleEnum)[keyof typeof UserRoleEnum],
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("removeRole is not implemented on native");
  }

  static async hasRole(
    // oxlint-disable-next-line no-unused-vars
    _userId: DbId,
    // oxlint-disable-next-line no-unused-vars
    _role: (typeof UserRoleEnum)[keyof typeof UserRoleEnum],
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("hasRole is not implemented on native");
  }

  static async getUserRoles(
    // oxlint-disable-next-line no-unused-vars
    _userId: DbId,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<(typeof UserPermissionRoleValue)[]>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getUserRoles is not implemented on native");
  }
}

// Compile-time type check
const _typeCheck: UserRolesRepositoryType = UserRolesRepository;
void _typeCheck;
