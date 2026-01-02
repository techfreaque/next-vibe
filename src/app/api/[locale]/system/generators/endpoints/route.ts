/**
 * Generators Functional API Route
 * Route handler for functional generator operations
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { functionalGeneratorsRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, logger }) => functionalGeneratorsRepository.runGenerators(data, logger),
  },
});
