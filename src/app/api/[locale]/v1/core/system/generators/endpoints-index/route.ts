/**
 * Endpoints Index Generator API Route
 * Route handler for endpoints index generation
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { endpointsIndexGeneratorRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, logger }) =>
      endpointsIndexGeneratorRepository.generateEndpointsIndex(data, logger),
  },
});
