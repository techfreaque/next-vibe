/**
 * Generate tRPC Router Route Handler
 * Handles POST requests for tRPC router generation
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import generateTrpcRouterEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: generateTrpcRouterEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, locale }) => {
      const { GenerateTrpcRouterRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return GenerateTrpcRouterRepository.generateTrpcRouter(
        data,
        logger,
        locale,
      );
    },
  },
});
