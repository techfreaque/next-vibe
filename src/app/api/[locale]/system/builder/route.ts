/**
 * Builder Route
 * API route for building and bundling packages for npm distribution
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import builderEndpoints from "./definition";
import { builderRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: builderEndpoints,
  [Methods.POST]: {
    handler: ({ data, locale, logger }) => {
      return builderRepository.execute(data, locale, logger);
    },
  },
});
