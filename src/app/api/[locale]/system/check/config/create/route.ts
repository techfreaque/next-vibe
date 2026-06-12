/**
 * Config Create Route Handler
 * Handles POST requests for creating check.config.ts
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import configCreateEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: configCreateEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t, platform, locale }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).ConfigCreateRepository.execute(data, logger, t, platform, locale),
  },
});
