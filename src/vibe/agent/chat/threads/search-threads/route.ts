/**
 * Thread Search API Route Handler
 * Handles GET requests for searching threads
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { definitions } from "./definition";
import { SearchThreadsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, data, logger, locale }) =>
      SearchThreadsRepository.searchThreads(user.id, data, logger, locale),
  },
});
