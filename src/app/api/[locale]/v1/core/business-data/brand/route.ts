/**
 * Brand API Route Handlers
 * Next.js API route handlers with validation and business logic delegation
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

import definitions from "./definition";
import { brandRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, logger }) => {
      return await brandRepository.getBrand(user.id, user, logger);
    },
  },
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, logger }) => {
      return await brandRepository.updateBrand(user.id, data, user, logger);
    },
  },
});
