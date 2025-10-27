/**
 * Leads Stats API Route Handler
 * Handles GET requests for leads statistics
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import definitions from "./definition";
import { leadsStatsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      return await leadsStatsRepository.getLeadsStats(
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
