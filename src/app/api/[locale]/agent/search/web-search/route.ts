/**
 * Unified Web Search API Route Handler
 * Handles GET requests for web search, dispatching to the preferred provider
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import webSearchDefinition from "./definition";
import { WebSearchRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: webSearchDefinition,
  [Methods.GET]: {
    handler: ({ data, user, logger, t, locale }) => {
      return WebSearchRepository.search(data, user, logger, t, locale);
    },
  },
});
