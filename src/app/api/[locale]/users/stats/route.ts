/**
 * Users Stats API Route Handler
 * Handles GET requests for user statistics
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { usersStatsRepository } from "./repository";

/**
 * Export handlers using endpointsHandler
 */
export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: async ({ data, user, locale, logger }) => {
      return await usersStatsRepository.getUserStats(
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
