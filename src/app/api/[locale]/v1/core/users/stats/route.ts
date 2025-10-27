/**
 * Users Stats API Route Handler
 * Handles GET requests for user statistics
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import definitions from "./definition";
import { usersStatsRepository } from "./repository";

/**
 * Export handlers using endpointHandler
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
