/**
 * Lead Engagement Tracking API Route Handler
 * Tracks email opens, clicks, and other engagement metrics
 */
import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
