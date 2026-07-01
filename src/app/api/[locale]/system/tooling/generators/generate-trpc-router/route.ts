/**
 * Generate tRPC Router Route Handler
 * Handles POST requests for tRPC router generation
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import generateTrpcRouterEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: generateTrpcRouterEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, locale }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).GenerateTrpcRouterRepository.generateTrpcRouter(data, logger, locale),
  },
});
