/**
 * Generate All Route Handler
 * Handles POST requests for running all code generators
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import generateAllEndpoints from "./definition";
import { GenerateAllRepository } from "./repository";

export const { tools } = endpointsHandler({
  endpoint: generateAllEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger, locale }) =>
      GenerateAllRepository.generateAll(data, logger, locale),
  },
});
