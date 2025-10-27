/**
 * Lead Engagement Tracking API Route Handler
 * Tracks email opens, clicks, and other engagement metrics
 */
import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import { leadTrackingRepository } from "../repository";
import definitions from "./definition";

/**
 * Export handlers using endpointsHandler
 */
export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, request, locale, user, logger }) => {
      const clientInfo = leadTrackingRepository.extractClientInfo(request);
      return await leadTrackingRepository.handleEngagementWithRelationship(
        data,
        clientInfo,
        locale,
        user,
        logger,
      );
    },
  },
  [Methods.GET]: {
    handler: async ({ data, request, user, locale, logger }) => {
      const clientInfo = leadTrackingRepository.extractClientInfo(request);
      return await leadTrackingRepository.handleClickTracking(
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
