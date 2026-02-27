/**
 * Global Message Search Route Handler
 * Handles GET requests for searching messages across all threads
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { GlobalMessageSearchRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, t, logger }) =>
      GlobalMessageSearchRepository.searchMessages(data, user, t, logger),
  },
});
