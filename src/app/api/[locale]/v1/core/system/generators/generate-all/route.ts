/**
 * Generate All Route Handler
 * Handles POST requests for running all code generators
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import generateAllEndpoints from "./definition";
import { generateAllRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: generateAllEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      generateAllRepository.generateAll(data, user, locale, logger),
  },
});
