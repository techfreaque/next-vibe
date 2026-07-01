/**
 * URL Cache Cleanup Route Handler
 * Thin wrapper - all logic lives in repository.ts
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { UrlCacheCleanupRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ logger }) =>
      await UrlCacheCleanupRepository.cleanup(logger),
  },
});
