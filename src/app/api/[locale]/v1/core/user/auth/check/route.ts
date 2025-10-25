/**
 * Auth Check Route
 * Provides endpoint to check authentication status (works for all platforms)
 *
 * This endpoint runs on the SERVER and checks authentication via:
 * - Web/Browser: Validates HTTP-only cookies
 * - Native: Validates Bearer token from Authorization header
 */

import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { endpointsHandler } from "../../../system/unified-ui/cli/vibe/endpoints/endpoint-handler";
import { Methods } from "../../../system/unified-ui/cli/vibe/endpoints/endpoint-types/types";
import {
  type CheckAuthStatusGetRequestOutput,
  checkAuthStatusGetRequestSchema,
  type CheckAuthStatusGetResponseOutput,
} from "./definition";
import endpoints from "./definition";

/**
 * GET /api/[locale]/v1/core/user/auth/check
 * Check authentication status for current user
 */
export const { GET, tools } = endpointsHandler({
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
