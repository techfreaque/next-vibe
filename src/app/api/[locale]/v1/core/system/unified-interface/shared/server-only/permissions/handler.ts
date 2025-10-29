/**
 * Base Permission Handler
 * Shared permission checking logic for all platforms
 */

import type { TranslationKey } from "@/i18n/core/static-types";

import type { JwtPayloadType } from "../../../../../user/auth/types";
import type { UserRoleValue } from "../../../../../user/user-roles/enum";
import { UserRole } from "../../../../../user/user-roles/enum";
import type { EndpointLogger } from "../../types/logger";

/**
 * Permission check result
 */
export interface PermissionResult {
  allowed: boolean;
  reason?: TranslationKey;
}

/**
 * Base permission handler
 */
export abstract class BasePermissionHandler {
  /**
   * Check if user has required roles
   */
  protected hasRequiredRoles(
    user: JwtPayloadType,
    requiredRoles: readonly (typeof UserRoleValue)[],
  ): boolean {
    // Public role is always allowed
    if (requiredRoles.includes(UserRole.PUBLIC)) {
      return true;
    }

    // Public users can only access PUBLIC endpoints
    if (user.isPublic) {
      return false;
    }

    // Check if user has any of the required roles
    // For now, we assume authenticated users have CUSTOMER role
    // In the future, this should check actual user roles from database
    return requiredRoles.includes(UserRole.CUSTOMER);
  }

  /**
   * Check if user is admin
   */
  protected async isAdmin(
    userId: string,
    logger: EndpointLogger,
  ): Promise<boolean> {
    // Import dynamically to avoid circular dependencies
    const { userRolesRepository } = await import(
      "../../../../../user/user-roles/repository"
    );

    const hasAdminRole = await userRolesRepository.hasRole(
      userId,
      UserRole.ADMIN,
      logger,
    );
    return hasAdminRole.success && hasAdminRole.data;
  }

  /**
   * Check if user is owner of resource
   */
  protected isOwner(userId: string, resourceOwnerId: string): boolean {
    return userId === resourceOwnerId;
  }

  /**
   * Check if user can access resource
   */
  protected canAccess(
    user: JwtPayloadType,
    resourceOwnerId: string,
    requiredRoles: readonly (typeof UserRoleValue)[],
  ): boolean {
    // Public users cannot access private resources
    if (user.isPublic) {
      return this.hasRequiredRoles(user, requiredRoles);
    }

    // Owner can always access
    if (user.id && this.isOwner(user.id, resourceOwnerId)) {
      return true;
    }

    // Check required roles
    return this.hasRequiredRoles(user, requiredRoles);
  }

  /**
   * Get role priority for comparison
   */
  protected getRolePriority(role: (typeof UserRoleValue)[number]): number {
    const priorities: Record<string, number> = {
      [UserRole.PUBLIC]: 0,
      [UserRole.CUSTOMER]: 1,
      [UserRole.ADMIN]: 2,
    };

    return priorities[role] ?? 0;
  }

  /**
   * Check if role A can access role B's resources
   */
  protected canAccessRole(
    userRole: (typeof UserRoleValue)[number],
    requiredRole: (typeof UserRoleValue)[number],
  ): boolean {
    return this.getRolePriority(userRole) >= this.getRolePriority(requiredRole);
  }

  /**
   * Check if user can perform action on resource
   */
  async checkPermission(
    user: JwtPayloadType,
    action: string,
    resource: {
      ownerId?: string;
      requiredRoles?: readonly (typeof UserRoleValue)[];
    });
    logger: EndpointLogger,
  ): Promise<PermissionResult> {
    // Public users have limited access
    if (user.isPublic) {
      if (resource.requiredRoles?.includes(UserRole.PUBLIC)) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason:
          "app.api.v1.core.system.unifiedInterface.shared.permissions.publicUsersCannotAccess",
      };
    }

    // Check if user is owner
    if (
      resource.ownerId &&
      user.id &&
      this.isOwner(user.id, resource.ownerId)
    ) {
      return { allowed: true };
    }

    // Check if user is admin
    if (user.id && (await this.isAdmin(user.id, logger))) {
      return { allowed: true };
    }

    // Check required roles
    if (
      resource.requiredRoles &&
      this.hasRequiredRoles(user, resource.requiredRoles)
    ) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason:
        "app.api.v1.core.system.unifiedInterface.shared.permissions.insufficientPermissions",
    };
  }
}
