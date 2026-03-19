/**
 * Lead Engagement Tracking API Route Handler
 * Tracks email opens, clicks, and other engagement metrics
 */
import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { LeadTrackingRepository } from "../repository";
import definitions from "./definition";

/**
 * Export handlers using endpointsHandler
 */
export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, request, locale, user, logger }) =>
      LeadTrackingRepository.handleEngagementWithRelationship(
        data,
        LeadTrackingRepository.extractClientInfo(request),
        locale,
        user,
        logger,
      ),
  },
  [Methods.GET]: {
    handler: ({ data, user, locale, logger }) =>
      LeadTrackingRepository.handleClickTracking(data, user, locale, logger),
  },
});
