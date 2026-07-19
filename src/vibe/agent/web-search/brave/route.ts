/**
 * Brave Search API Route Handler
 * Handles GET requests for web search
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import braveSearchDefinition from "./definition";
import { BraveSearchRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: braveSearchDefinition,
  [Methods.GET]: {
    handler: ({ data, user, logger, t, toolExecutionContext }) =>
      BraveSearchRepository.search(
        data.query,
        {
          maxResults: data.maxResults,
          includeNews: data.includeNews,
          freshness: data.freshness,
        },
        logger,
        t,
        user,
        toolExecutionContext,
      ),
  },
});
