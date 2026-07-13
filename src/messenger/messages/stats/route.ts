/**
 * Email Stats API Route Handler
 * Handles GET requests for email statistics
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { EmailStatsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: ({ data, user, logger, t }) =>
      EmailStatsRepository.getStats(data, user, logger, t),
  },
});
