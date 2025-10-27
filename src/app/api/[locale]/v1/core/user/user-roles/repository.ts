/**
 * User Roles Repository
 * Manages user roles and permissions
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";

import type { NewUserRole, UserRole } from "../db";
import { insertUserRoleSchema, userRoles } from "../db";
import { UserRole as UserRoleEnum } from "./enum";

/**
 * User Roles Repository Interface
 */
export interface UserRolesRepository {
  /**
   * Find user roles by user ID
   */
  findByUserId(
    userId: DbId,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserRole[]>>;

  /**
   * Delete user roles by user ID
   */
  deleteByUserId(
    userId: DbId,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>>;

  /**
   * Find role by user ID and role value
   */
  findByUserIdAndRole(
    userId: DbId,
    role: (typeof UserRoleEnum)[keyof typeof UserRoleEnum],
    logger: EndpointLogger,
  ): Promise<ResponseType<UserRole>>;

  /**
   * Add role to user
   */
  addRole(
    data: NewUserRole,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserRole>>;

  /**
   * Remove role from user
   */
  removeRole(
    userId: DbId,
    role: (typeof UserRoleEnum)[keyof typeof UserRoleEnum],
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>>;

  /**
   * Check if user has role
   */
  hasRole(
    userId: DbId,
    role: (typeof UserRoleEnum)[keyof typeof UserRoleEnum],
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>>;
}

/**
 * User Roles Repository Implementation
 */
export class UserRolesRepositoryImpl implements UserRolesRepository {
  /**
   * Find user roles by user ID
   * @param userId - The user ID
   * @returns User roles or error response
   */
  async findByUserId(
    userId: DbId,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserRole[]>> {
    try {
      // Safety check for logger
      if (logger && typeof logger.debug === "function") {
        logger.debug("Finding user roles by user ID", { userId });
      }

      // Handle CLI-only user without database access
      if (userId === "00000000-0000-0000-0000-000000000001") {
        // Return CLI_OFF role for the default CLI user
        const cliRole: UserRole = {
          id: "cli-role-id",
          userId: userId,
          role: UserRoleEnum.CLI_OFF,
          assignedBy: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return createSuccessResponse([cliRole]);
      }

      const results = await db
        .select()
        .from(userRoles)
        .where(eq(userRoles.userId, userId));

      return createSuccessResponse(results);
    } catch (error) {
      const parsedError = parseError(error);

      // Safety check for logger
      if (logger && typeof logger.error === "function") {
        logger.error("Error finding user roles by user ID", parseError(error));
      }

      // Check if this is a database connection error
      if (
        parsedError.message.includes("ECONNREFUSED") ||
        parsedError.message.includes("connect")
      ) {
        return createErrorResponse(
          "app.api.v1.core.user.userRoles.errors.find_failed",
          ErrorResponseTypes.DATABASE_ERROR,
          {
            userId,
            error: parsedError.message,
            details: parsedError.message,
          },
        );
      }

      return createErrorResponse(
        "app.api.v1.core.user.userRoles.errors.find_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        { userId, error: parsedError.message },
      );
    }
  }

  /**
   * Find a role by user ID and role value
   * @param userId - The user ID
   * @param role - The role value
   * @returns User role or error response
   */
  async findByUserIdAndRole(
    userId: DbId,
    role: (typeof UserRoleEnum)[keyof typeof UserRoleEnum],
    logger: EndpointLogger,
  ): Promise<ResponseType<UserRole>> {
    try {
      logger.debug("Finding user role by user ID and role", { userId, role });

      // Handle CLI-only user without database access
      if (userId === "00000000-0000-0000-0000-000000000001") {
        // CLI user can have CLI_OFF, ADMIN, or AI_TOOL_OFF roles
        if (
          role === UserRoleEnum.CLI_OFF ||
          role === UserRoleEnum.ADMIN ||
          role === UserRoleEnum.AI_TOOL_OFF
        ) {
          const cliRole: UserRole = {
            id: "cli-role-id",
            userId: userId,
            role: role,
            assignedBy: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          return createSuccessResponse(cliRole);
        } else {
          return createErrorResponse(
            "app.api.v1.core.user.userRoles.errors.not_found",
            ErrorResponseTypes.NOT_FOUND,
            { userId, role },
          );
        }
      }

      const results = await db
        .select()
        .from(userRoles)
        .where(and(eq(userRoles.userId, userId), eq(userRoles.role, role)));

      if (results.length === 0) {
        return createErrorResponse(
          "app.api.v1.core.user.userRoles.errors.not_found",
          ErrorResponseTypes.NOT_FOUND,
          { userId, role },
        );
      }

      return createSuccessResponse(results[0]);
    } catch (error) {
      logger.error(
        "Error finding user role by user ID and role",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.user.userRoles.errors.lookup_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        { userId, role, error: parseError(error).message },
      );
    }
  }

  /**
   * Add a role to a user
   * @param data - The user role data
   * @returns Created user role or error response
   */
  async addRole(
    data: NewUserRole,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserRole>> {
    try {
      logger.debug("Adding role to user", {
        userId: data.userId,
        role: data.role,
      });

      // Check if the role already exists
      const existingRoleResult = await this.findByUserIdAndRole(
        data.userId,
        data.role,
        logger,
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
        return createErrorResponse(
          "app.api.v1.core.user.userRoles.errors.add_failed",
          ErrorResponseTypes.DATABASE_ERROR,
          { error: "app.api.v1.core.user.userRoles.errors.no_data_returned" },
        );
      }

      return createSuccessResponse(results[0]);
    } catch (error) {
      logger.error("Error adding role to user", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.user.userRoles.errors.add_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        {
          userId: data.userId,
          role: data.role,
          error: parseError(error).message,
        },
      );
    }
  }

  /**
   * Remove a role from a user
   * @param userId - The user ID
   * @param role - The role value
   * @returns Success or error response
   */
  async removeRole(
    userId: DbId,
    role: (typeof UserRoleEnum)[keyof typeof UserRoleEnum],
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    try {
      logger.debug("Removing role from user", { userId, role });

      const results = await db
        .delete(userRoles)
        .where(and(eq(userRoles.userId, userId), eq(userRoles.role, role)))
        .returning({ id: userRoles.id });

      return createSuccessResponse(results.length > 0);
    } catch (error) {
      logger.error("Error removing role from user", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.user.userRoles.errors.remove_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        { userId, role, error: parseError(error).message },
      );
    }
  }

  /**
   * Check if a user has a specific role
   * @param userId - The user ID
   * @param role - The role value
   * @returns Success or error response
   */
  async hasRole(
    userId: DbId,
    role: (typeof UserRoleEnum)[keyof typeof UserRoleEnum],
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    try {
      logger.debug("Checking if user has role", { userId, role });

      const existingRoleResult = await this.findByUserIdAndRole(
        userId,
        role,
        logger,
      );

      return createSuccessResponse(existingRoleResult.success);
    } catch (error) {
      logger.error("Error checking if user has role", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.user.userRoles.errors.check_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        { userId, role, error: parseError(error).message },
      );
    }
  }

  /**
   * Delete user roles by user ID
   * @param userId - The user ID
   * @returns Success or error response
   */
  async deleteByUserId(
    userId: DbId,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Deleting user roles by user ID", { userId });

      await db.delete(userRoles).where(eq(userRoles.userId, userId));

      return createSuccessResponse(undefined);
    } catch (error) {
      logger.error("Error deleting user roles by user ID", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.user.userRoles.errors.delete_failed",
        ErrorResponseTypes.DATABASE_ERROR,
        { userId, error: parseError(error).message },
      );
    }
  }
}

// Export singleton instance of the repository
export const userRolesRepository = new UserRolesRepositoryImpl();
