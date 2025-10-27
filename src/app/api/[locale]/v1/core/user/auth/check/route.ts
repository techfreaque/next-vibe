/**
 * Auth Check Route
 * Provides endpoint to check authentication status (works for all platforms)
 *
 * This endpoint runs on the SERVER and checks authentication via:
 * - Web/Browser: Validates HTTP-only cookies
 * - Native: Validates Bearer token from Authorization header
 */

import { endpointHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import endpoints from "./definition";

/**
 * GET /api/[locale]/v1/core/user/auth/check
 * Check authentication status for current user
 */
export const { GET, tools } = endpointHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    allowedRoles: [UserRole.PUBLIC],
    handler: async ({ user, logger }) => {
      // The endpoint handler already validates authentication
      // and provides the user object if authenticated

      const authenticated = !user.isPublic;
      const tokenValid = authenticated;

      logger.debug("Auth check result", {
        authenticated,
        isPublic: user.isPublic,
        userId: authenticated ? user.id : undefined,
      });

      return {
        success: true,
        data: {
          authenticated,
          tokenValid,
        },
      };
    },
  },
});
