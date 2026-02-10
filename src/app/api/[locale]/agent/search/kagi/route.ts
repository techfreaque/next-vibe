/**
 * Kagi Search API Route Handler
 * Handles GET requests for web search and FastGPT
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import kagiSearchDefinition from "./definition";
import { KagiSearchRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: kagiSearchDefinition,
  [Methods.GET]: {
    handler: ({ data, logger }) => {
      return KagiSearchRepository.search(data, logger);
    },
  },
});
