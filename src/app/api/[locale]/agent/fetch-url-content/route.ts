/**
 * Fetch URL Content API Route Handler
 * Handles GET requests for URL content fetching
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import fetchUrlContentDefinition from "./definition";
import { FetchUrlContentRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: fetchUrlContentDefinition,
  [Methods.GET]: {
    handler: ({ data, logger }) => {
      return FetchUrlContentRepository.fetchUrl(data.url, logger);
    },
  },
});
