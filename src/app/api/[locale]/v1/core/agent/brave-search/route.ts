/**
 * Brave Search API Route Handler
 * Handles GET requests for web search
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import braveSearchDefinition from "./definition";
import { braveSearchRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: braveSearchDefinition,
  [Methods.GET]: {
    handler: ({ data, logger }) => {
      return braveSearchRepository.search(
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
