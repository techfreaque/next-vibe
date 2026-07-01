import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
/**
 * Leads Stats API Route Handler
 * Handles GET requests for leads statistics
 */
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { LeadStatsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, t, logger }) =>
      LeadStatsRepository.getLeadsStats(data, t, logger),
  },
});
