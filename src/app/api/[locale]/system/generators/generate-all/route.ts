/**
 * Generate All Route Handler
 * Handles POST requests for running all code generators
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import generateAllEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: generateAllEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, locale }) => {
      const { GenerateAllRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return GenerateAllRepository.generateAll(data, logger, locale);
    },
  },
});
