/**
 * Generate All Route Handler
 * Handles POST requests for running all code generators
 */

import "server-only";

import { Methods } from "../definition/enums";
import { endpointsHandler } from "../route/multi";
import generateAllEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: generateAllEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger }) =>
      (
        await import(/* @vite-ignore */ "./repository")
      ).GenerateAllRepository.generateAll(data, logger),
  },
});
