/**
 * Builder Route
 * API route for building and bundling packages for npm distribution
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import builderEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: builderEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) => {
      const { builderRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return builderRepository.execute(data, logger, t);
    },
  },
});
