/**
 * Fetch URL Content API Route Handler
 * Handles GET requests for URL content fetching
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import fetchUrlContentDefinition from "./definition";
import { FetchUrlContentRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: fetchUrlContentDefinition,
  [Methods.GET]: {
    handler: ({ data, logger, t }) =>
      FetchUrlContentRepository.fetchUrl(data.url, data.query, logger, t),
  },
});
