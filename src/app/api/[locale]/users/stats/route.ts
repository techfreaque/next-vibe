/**
 * Users Stats API Route Handler
 * Handles GET requests for user statistics
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { UsersStatsRepository } from "./repository";

/**
 * Export handlers using endpointsHandler
 */
export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: async ({ data, logger, locale }) =>
      UsersStatsRepository.getUserStats(data, logger, locale),
  },
});
