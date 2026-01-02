/**
 * TRPC Integration Validation Route
 * HTTP endpoint for TRPC integration validation operations
 * Optional route - only created because validation HTTP access is useful for development
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { trpcValidationRepository as repository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, logger }) => repository.executeValidationOperation(data, logger),
  },
});
