/**
 * TRPC Integration Validation Route
 * HTTP endpoint for TRPC integration validation operations
 * Optional route - only created because validation HTTP access is useful for development
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import endpoints from "./definition";
import { trpcValidationRepository as repository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, logger }) =>
      repository.executeValidationOperation(data, logger),
  },
});
