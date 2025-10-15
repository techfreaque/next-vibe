/**
 * Generate tRPC Router Route Handler
 * Handles POST requests for tRPC router generation
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import generateTrpcRouterEndpoints from "./definition";
import { generateTrpcRouterRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: generateTrpcRouterEndpoints,
  [Methods.POST]: {
    handler: ({ data, locale, logger }) => {
      return generateTrpcRouterRepository.generateTrpcRouter(
        data,
        locale,
        logger,
      );
    },
  },
});
