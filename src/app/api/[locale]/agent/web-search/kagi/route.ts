/**
 * Kagi Search API Route Handler
 * Handles GET requests for web search and FastGPT
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import kagiSearchDefinition from "./definition";
import { KagiSearchRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: kagiSearchDefinition,
  [Methods.GET]: {
    handler: ({ data, user, logger, t, streamContext }) =>
      KagiSearchRepository.search(data, logger, t, user, streamContext),
  },
});
