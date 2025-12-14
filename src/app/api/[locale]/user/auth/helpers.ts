/**
 * Auth Helpers
 * Pure helper functions for creating user payloads
 * Extracted from BaseAuthHandler to separate business logic from platform infrastructure
 */

import type { UserPermissionRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import type { JwtPayloadType, JwtPrivatePayloadType } from "./types";

/**
 * Create public user payload
 * Used for unauthenticated users (guest/anonymous)
 *
 * @param leadId - Lead ID from database
 * @throws Error if leadId is missing
 */
export function createPublicUser(leadId: string): JwtPayloadType {
  if (!leadId) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Auth infrastructure helper throws for invalid state
    throw new Error("leadId from DB required for public user");
  }
  return {
    leadId,
    isPublic: true,
    roles: [UserPermissionRole.PUBLIC],
  };
}

/**
 * Create private user payload
 * Used for authenticated users
 *
 * @param userId - User ID from database
 * @param leadId - Lead ID from database
 * @throws Error if userId or leadId is missing
 */
export function createPrivateUser(
  userId: string,
  leadId: string,
  roles: (typeof UserPermissionRoleValue)[],
): JwtPrivatePayloadType {
  if (!leadId) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Auth infrastructure helper throws for invalid state
    throw new Error("leadId from DB required for private user");
  }
  if (!userId) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Auth infrastructure helper throws for invalid state
    throw new Error("userId required for private user");
  }
  return {
    id: userId,
    leadId,
    isPublic: false,
    roles,
  };
}
