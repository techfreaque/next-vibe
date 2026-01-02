/**
 * Message Search Route Handler
 * Handles GET requests for searching messages within a thread
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { MessageSearchRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, locale, logger }) =>
      MessageSearchRepository.searchMessages(data, urlPathParams, user, locale, logger),
  },
});
