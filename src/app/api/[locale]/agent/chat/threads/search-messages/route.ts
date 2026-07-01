/**
 * Global Message Search Route Handler
 * Handles GET requests for searching messages across all threads
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { GlobalMessageSearchRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, t, logger }) =>
      GlobalMessageSearchRepository.searchMessages(data, user, t, logger),
  },
});
