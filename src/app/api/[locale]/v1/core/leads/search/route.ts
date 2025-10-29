/**
 * Lead Search API Route Handler
 * Handles GET requests for searching leads
 */

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";

import definitions from "./definition";
import { leadSearchRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      return await leadSearchRepository.searchLeads(data, user, locale, logger);
    },
  },
});
