/**
 * Subscription Admin Stats API Route Handler
 * Handles GET requests for subscription statistics
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { SubscriptionAdminStatsRepository } from "./repository";

/**
 * Export handlers using endpointsHandler
 */
export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, logger, locale }) => {
      return await SubscriptionAdminStatsRepository.getStats(
        data,
        logger,
        locale,
      );
    },
  },
});
