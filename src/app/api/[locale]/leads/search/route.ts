import "server-only";
/**
 * Lead Search API Route Handler
 * Handles GET requests for searching leads
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
