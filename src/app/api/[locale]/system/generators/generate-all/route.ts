/**
 * Generate All Route Handler
 * Handles POST requests for running all code generators
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import generateAllEndpoints from "./definition";
import { generateAllRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: generateAllEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger }) => generateAllRepository.generateAll(data, logger),
  },
});
