/**
 * Session Cleanup Route Handler
 * Called by cron to clean up expired sessions and tokens
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { SessionCleanupRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      SessionCleanupRepository.executeSessionCleanup(data, logger, locale),
  },
});
