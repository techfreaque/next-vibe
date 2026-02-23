/**
 * User Roles Repository
 * Manages user roles and permissions
 */

import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { DbId } from "@/app/api/[locale]/system/db/types";
import { createDefaultCliUser } from "@/app/api/[locale]/system/unified-interface/cli/auth/cli-user";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { NewUserRole, UserRole } from "../db";
import { insertUserRoleSchema, userRoles } from "../db";
import type { UserRoleDB } from "./enum";
import {
  type UserPermissionRoleValue,
  type UserRole as UserRoleEnum,
} from "./enum";
import { scopedTranslation } from "./i18n";

/**
 * User Roles Repository
 */
export class UserRolesRepository {
  /**
   * Find user roles by user ID
   * @param userId - The user ID
   * @returns User roles or error response
   */
  static async findByUserId(
    userId: DbId,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserRole[]>> {
    try {
      // Handle CLI-only user without database access
      const defaultCliUser = createDefaultCliUser();
      if (userId === defaultCliUser.id) {
        // Return empty roles for the default CLI user
        // The CLI user bypasses role checks via CLI_AUTH_BYPASS marker in endpoint definitions
        // Platform markers like CLI_OFF, CLI_AUTH_BYPASS are NEVER stored as user roles
        return success([]);
      }

      const results = await db
        .select()
        .from(userRoles)
        .where(eq(userRoles.userId, userId));

      return success(results);
    } catch (error) {
      const parsedError = parseError(error);

      // Safety check for logger
      if (logger && typeof logger.error === "function") {
        logger.error("Error finding user roles by user ID", parseError(error));
      }

      const { t } = scopedTranslation.scopedT(locale);

      // Check if this is a database connection error
      if (
        parsedError.message.includes("ECONNREFUSED") ||
        parsedError.message.includes("connect")
      ) {
        return fail({
          message: t("errors.find_failed"),
          errorType: ErrorResponseTypes.DATABASE_ERROR,
          messageParams: {
            userId,
            error: parsedError.message,
            details: parsedError.message,
          },
        });
      }

      return fail({
        message: t("errors.find_failed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { userId, error: parsedError.message },
      });
    }
  }

  /**
   * Find user roles for multiple user IDs (batch operation)
   * Optimized to avoid N+1 queries when fetching roles for multiple users
   * @param userIds - Array of user IDs to fetch roles for
   * @returns Map of userId -> roles for efficient lookups
   */
  static async findByUserIds(
    userIds: DbId[],
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<Map<DbId, UserRole[]>>> {
    try {
      logger.debug("Batch finding user roles for multiple users", {
        count: userIds.length,
      });

      // Handle empty array
      if (userIds.length === 0) {
        return success(new Map());
      }

      // Filter out default CLI user if present
      const defaultCliUser = createDefaultCliUser();
      const validUserIds = userIds.filter((id) => id !== defaultCliUser.id);

      // If all users were CLI default users, return empty map
      if (validUserIds.length === 0) {
        const emptyMap = new Map<DbId, UserRole[]>();
        userIds.forEach((id) => emptyMap.set(id, []));
        return success(emptyMap);
      }

      // Single batch query for all user roles
      const results = await db
        .select()
        .from(userRoles)
        .where(inArray(userRoles.userId, validUserIds));

      // Group roles by userId for efficient lookup
      const rolesMap = new Map<DbId, UserRole[]>();

      // Initialize map with empty arrays for all requested users
      userIds.forEach((id) => rolesMap.set(id, []));

      // Populate with actual roles
      results.forEach((role) => {
        const existing = rolesMap.get(role.userId) || [];
        existing.push(role);
        rolesMap.set(role.userId, existing);
      });

      logger.debug("Batch role lookup completed", {
        requestedUsers: userIds.length,
        totalRoles: results.length,
      });

      return success(rolesMap);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Error batch finding user roles", parsedError);
      const { t } = scopedTranslation.scopedT(locale);

      return fail({
        message: t("errors.batch_find_failed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: {
          count: userIds.length,
          error: parsedError.message,
        },
      });
    }
  }

  /**
   * Find a role by user ID and role value
   * @param userId - The user ID
   * @param role - The role value
   * @returns User role or error response
   */
  static async findByUserIdAndRole(
    userId: DbId,
    role: (typeof UserRoleEnum)[keyof typeof UserRoleEnum],
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserRole>> {
    try {
      // Handle CLI-only user without database access
      const defaultCliUser = createDefaultCliUser();
      if (userId === defaultCliUser.id) {
        // CLI user has no roles in database
        // Platform markers (CLI_OFF, CLI_AUTH_BYPASS, etc.) are NEVER user roles
        // Access control is handled by platform-access checker, not user roles
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.not_found"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId, role },
        });
      }

      const results = await db
        .select()
        .from(userRoles)
        .where(
          and(
            eq(userRoles.userId, userId),
            eq(userRoles.role, role as (typeof UserRoleDB)[number]),
          ),
        );

      if (results.length === 0) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.not_found"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId, role },
        });
      }

      return success(results[0]);
    } catch (error) {
      logger.error(
        "Error finding user role by user ID and role",
        parseError(error),
      );
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.lookup_failed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { userId, role, error: parseError(error).message },
      });
    }
  }

  /**
   * Add a role to a user
   * @param data - The user role data
   * @returns Created user role or error response
   */
  static async addRole(
    data: NewUserRole,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserRole>> {
    try {
      // Check if the role already exists
      const existingRoleResult = await UserRolesRepository.findByUserIdAndRole(
        data.userId,
        data.role,
        logger,
        locale,
      );

      if (existingRoleResult.success) {
        return existingRoleResult;
      }

      // Create the role - only include fields that exist in DB schema
      const roleData = {
        userId: data.userId,
        role: data.role,
      };

      // Create the role
      const validatedData = insertUserRoleSchema.parse(roleData);
      const results = await db
        .insert(userRoles)
        .values(validatedData)
        .returning();

      if (results.length === 0) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.add_failed"),
          errorType: ErrorResponseTypes.DATABASE_ERROR,
          messageParams: {
            error: t("errors.no_data_returned"),
          },
        });
      }

      return success(results[0]);
    } catch (error) {
      logger.error("Error adding role to user", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.add_failed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: {
          userId: data.userId,
          role: data.role,
          error: parseError(error).message,
        },
      });
    }
  }

  /**
   * Remove a role from a user
   * @param userId - The user ID
   * @param role - The role value
   * @returns Success or error response
   */
  static async removeRole(
    userId: DbId,
    role: (typeof UserRoleEnum)[keyof typeof UserRoleEnum],
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<boolean>> {
    try {
      logger.debug("Removing role from user", { userId, role });

      const results = await db
        .delete(userRoles)
        .where(
          and(
            eq(userRoles.userId, userId),
            eq(userRoles.role, role as (typeof UserRoleDB)[number]),
          ),
        )
        .returning({ id: userRoles.id });

      return success(results.length > 0);
    } catch (error) {
      logger.error("Error removing role from user", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.remove_failed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { userId, role, error: parseError(error).message },
      });
    }
  }

  /**
   * Check if a user has a specific role
   * @param userId - The user ID
   * @param role - The role value
   * @returns Success or error response
   */
  static async hasRole(
    userId: DbId,
    role: (typeof UserRoleEnum)[keyof typeof UserRoleEnum],
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<boolean>> {
    try {
      const existingRoleResult = await UserRolesRepository.findByUserIdAndRole(
        userId,
        role,
        logger,
        locale,
      );

      return success(existingRoleResult.success);
    } catch (error) {
      logger.error("Error checking if user has role", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.check_failed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { userId, role, error: parseError(error).message },
      });
    }
  }

  /**
   * Delete user roles by user ID
   * @param userId - The user ID
   * @returns Success or error response
   */
  static async deleteByUserId(
    userId: DbId,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Deleting user roles by user ID", { userId });

      await db.delete(userRoles).where(eq(userRoles.userId, userId));

      return success();
    } catch (error) {
      logger.error("Error deleting user roles by user ID", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.delete_failed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { userId, error: parseError(error).message },
      });
    }
  }

  /**
   * Get user role values as array of strings
   * @param userId - The user ID
   * @returns Array of role strings or error response
   */
  static async getUserRoles(
    userId: DbId,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<(typeof UserPermissionRoleValue)[]>> {
    try {
      const rolesResult = await UserRolesRepository.findByUserId(
        userId,
        logger,
        locale,
      );

      if (!rolesResult.success || !rolesResult.data) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.find_failed"),
          errorType: ErrorResponseTypes.DATABASE_ERROR,
          messageParams: { userId },
        });
      }

      // Database only contains permission roles (platform markers are never stored)
      // Safe to cast as UserPermissionRoleValue since UserRoleDB only contains permission roles
      const roleValues = rolesResult.data.map(
        (r) => r.role as typeof UserPermissionRoleValue,
      );
      return success(roleValues);
    } catch (error) {
      logger.error("Error getting user permission roles", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.find_failed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { userId, error: parseError(error).message },
      });
    }
  }
}

// Type for native repository type checking
export type UserRolesRepositoryType = Pick<
  typeof UserRolesRepository,
  keyof typeof UserRolesRepository
>;
