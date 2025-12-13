/**
 * Lead Engagement Tracking API Route Handler
 * Tracks email opens, clicks, and other engagement metrics
 */
import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
    handler: async ({ data, user, logger }) => {
      return await leadTrackingRepository.handleClickTracking(
        data,
        user,
        logger,
      );
    },
  },
});
