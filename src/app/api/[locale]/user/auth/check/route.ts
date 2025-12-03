/**
 * Auth Check Route
 * Provides endpoint to check authentication status (works for all platforms)
 *
 * This endpoint runs on the SERVER and checks authentication via:
 * - Web/Browser: Validates HTTP-only cookies
 * - Native: Validates Bearer token from Authorization header
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";

import endpoints from "./definition";

/**
 * GET /api/[locale]/user/auth/check
 * Check authentication status for current user
 */
export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  GET: {
    handler: (props) => {
      // The endpoint handler already validates authentication
      // and provides the user object if authenticated

      const authenticated = !props.user.isPublic;
      const tokenValid = authenticated;

      props.logger.debug("Auth check result", {
        authenticated,
        isPublic: props.user.isPublic,
        userId: authenticated ? props.user.id : undefined,
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
