/**
 * Template Item Route Handlers
 * Next.js API route handlers for individual template operations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import { templateItemRepository } from "./repository";

/**
 * Handler that supports both Next.js, CLI and tRPC
 */
export const { GET, PUT, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ urlParams, user, logger }) => {
      const id = urlParams?.id as string;
      return await templateItemRepository.findById(id, user, logger);
    },
  },
  [Methods.PUT]: {
    handler: async ({ data, urlParams, user, logger }) => {
      const id = urlParams?.id as string;
      return await templateItemRepository.updateById(id, data, user, logger);
    },
  },
  [Methods.DELETE]: {
    handler: async ({ urlParams, user, logger }) => {
      const id = urlParams?.id as string;
      return await templateItemRepository.deleteById(id, user, logger);
    },
  },
});
