/**
 * Unified Web Search API Route Handler
 * Handles GET requests for web search, dispatching to the preferred provider
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import webSearchDefinition from "./definition";
import { WebSearchRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: webSearchDefinition,
  [Methods.GET]: {
    handler: ({ data, user, logger, t, locale, streamContext }) =>
      WebSearchRepository.search(data, user, logger, t, locale, streamContext),
  },
});
