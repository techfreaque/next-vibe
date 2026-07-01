/**
 * Message Search Route Handler
 * Handles GET requests for searching messages within a thread
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { MessageSearchRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, t, logger }) =>
      MessageSearchRepository.searchMessages(
        data,
        urlPathParams,
        user,
        t,
        logger,
      ),
  },
});
