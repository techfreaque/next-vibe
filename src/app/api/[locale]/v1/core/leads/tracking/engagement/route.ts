/**
 * Lead Engagement Tracking API Route Handler
 * Tracks email opens, clicks, and other engagement metrics
 */
import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";
import {
  createErrorResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { LeadTrackingRepository } from "../repository";
import definitions from "./definition";

/**
 * Export handlers using endpointHandler
 */
export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, request, locale, user, logger }) => {
      const clientInfo = LeadTrackingRepository.extractClientInfo(request);
      return await LeadTrackingRepository.handleEngagementWithRelationship(
        data,
        clientInfo,
        locale,
        user,
        logger,
      );
    },
  },
  [Methods.GET]: {
    handler: async ({ data, request, user, logger }) => {
      const startTime = Date.now();

      logger.info("leads.tracking.click.start", {
        id: data.id,
        campaignId: data.campaignId,
        url: data.url,
        source: data.source,
        userAgent: request?.headers.get("user-agent"),
        ip:
          request?.headers.get("x-forwarded-for") ||
          request?.headers.get("x-real-ip"),
      });

      try {
        // Check if user is logged in using the user object from apiHandler
        const isLoggedIn = !user.isPublic;
        const userId = authRepository.extractUserId(user);

        if (isLoggedIn && userId) {
          logger.debug("leads.tracking.user.authenticated", {
            userId,
            leadId: data.id,
          });
        } else {
          logger.debug("leads.tracking.user.anonymous", { leadId: data.id });
        }

        // Extract client info
        const clientInfo = LeadTrackingRepository.extractClientInfo(request);

        // Handle click tracking with lead status update
        const result = await LeadTrackingRepository.handleClickTracking(
          {
            ...data,
            source: data.source || "email",
          },
          clientInfo,
          isLoggedIn,
          undefined, // userEmail not needed for current implementation
          logger,
        );

        const duration = Date.now() - startTime;
        logger.info("leads.tracking.click.completed", {
          id: data.id,
          url: data.url,
          duration,
          success: result.success,
        });

        if (result.success) {
          // Return tracking result for client-side redirect
          return result;
        } else {
          // Return error result with fallback URL
          return createErrorResponse(
            result.message || "error.default",
            ErrorResponseTypes.INTERNAL_ERROR,
          );
        }
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.error("leads.tracking.click.error", error, {
          id: data.id,
          url: data.url,
          duration,
        });
        // Return error response
        return createErrorResponse(
          "error.default",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }
    },
  },
});
