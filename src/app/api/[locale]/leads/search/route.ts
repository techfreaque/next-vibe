import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
/**
 * Lead Search API Route Handler
 * Handles GET requests for searching leads
 */
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { LeadSearchRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, t, logger, locale }) =>
      LeadSearchRepository.searchLeads(data, t, logger, locale),
  },
});
