/**
 * Generate All Route Handler
 * Handles POST requests for running all code generators
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import generateAllEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: generateAllEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, locale }) =>
      (
        await import(/* @vite-ignore */ "./repository")
      ).GenerateAllRepository.generateAll(data, logger, locale),
  },
});
