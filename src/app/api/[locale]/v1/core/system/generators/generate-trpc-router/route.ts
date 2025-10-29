/**
 * Generate tRPC Router Route Handler
 * Handles POST requests for tRPC router generation
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import generateTrpcRouterEndpoints from "./definition";
import { generateTrpcRouterRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: generateTrpcRouterEndpoints,
  [Methods.POST]: {
    handler: ({ data, locale }) => {
      return generateTrpcRouterRepository.generateTrpcRouter(data, locale);
    },
  },
});
