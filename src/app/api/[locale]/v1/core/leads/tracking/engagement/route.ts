/**
 * Lead Engagement Tracking API Route Handler
 * Tracks email opens, clicks, and other engagement metrics
 */
import "server-only";

import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import { LeadTrackingRepository } from "../repository";
import definitions from "./definition";

/**
 * Export handlers using endpointsHandler
 */
export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, request, locale, user, logger }) => {
      const clientInfo = LeadTrackingRepository.extractClientInfo(request);

      // Call repository with request data
      const repositoryResult =
        await LeadTrackingRepository.handleEngagementWithRelationship(
          data,
          clientInfo,
          locale,
          user,
          logger,
        );

      if (!repositoryResult.success) {
        return repositoryResult;
      }

      // Repository should return data matching LeadEngagementResponseOutput
      return createSuccessResponse(repositoryResult.data);
    },
  },
  [Methods.GET]: {
    handler: async ({ data, request, user, logger }) => {
      const startTime = Date.now();

      // Extract data fields with type assertions (validated by endpoint definition)
      const leadId = data.id as string;
      const campaignId = (data.campaignId ?? null) as string | null;
      const stage = (data.stage ?? null) as string | null;
      const source = (data.source ?? null) as string | null;
      const targetUrl = data.url as string;

      logger.info("leads.tracking.click.start", {
        id: leadId,
        campaignId,
        url: targetUrl,
        source,
        userAgent: request?.headers.get("user-agent") ?? null,
        ip:
          request?.headers.get("x-forwarded-for") ||
          request?.headers.get("x-real-ip") ||
          null,
      });

      try {
        // Check if user is logged in using the user object from apiHandler
        const isLoggedIn = !user.isPublic;
        const userId = authRepository.extractUserId(user);

        if (isLoggedIn && userId) {
          logger.debug("leads.tracking.user.authenticated", {
            userId,
            leadId,
          });
        } else {
          logger.debug("leads.tracking.user.anonymous", {
            leadId,
          });
        }

        // Extract client info
        const clientInfo = LeadTrackingRepository.extractClientInfo(request);

        // Handle click tracking with lead status update
        const result = await LeadTrackingRepository.handleClickTracking(
          {
            id: leadId,
            campaignId,
            stage,
            source,
            url: targetUrl,
          },
          clientInfo,
          logger,
          isLoggedIn,
          undefined, // userEmail not needed for current implementation
        );

        const duration = Date.now() - startTime;
        logger.info("leads.tracking.click.completed", {
          id: leadId,
          url: targetUrl,
          duration,
          success: result.success,
        });

        if (!result.success) {
          return createErrorResponse(
            result.message || "error.default",
            ErrorResponseTypes.INTERNAL_ERROR,
          );
        }

        // Repository should return data matching ClickTrackingResponseOutput
        return createSuccessResponse(result.data);
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.error("leads.tracking.click.error", error, {
          id: leadId,
          url: targetUrl,
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
