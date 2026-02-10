/**
 * Brave Search API Route Handler
 * Handles GET requests for web search
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import braveSearchDefinition from "./definition";
import { BraveSearchRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: braveSearchDefinition,
  [Methods.GET]: {
    handler: ({ data, logger }) => {
      return BraveSearchRepository.search(
        data.query,
        {
          maxResults: data.maxResults,
          includeNews: data.includeNews,
          freshness: data.freshness,
        },
        logger,
      );
    },
  },
});
