/**
 * Subscription Admin Stats API Route Handler
 * Handles GET requests for subscription statistics
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { SubscriptionAdminStatsRepository } from "./repository";

/**
 * Export handlers using endpointsHandler
 */
export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, logger, locale }) =>
      SubscriptionAdminStatsRepository.getStats(data, logger, locale),
  },
});
