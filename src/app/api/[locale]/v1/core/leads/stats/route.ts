/**
 * Leads Stats API Route Handler
 * Handles GET requests for leads statistics
 */

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";

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
