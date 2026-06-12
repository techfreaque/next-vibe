/**
 * Release Tool Route
 * API route for managing package releases
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import releaseToolEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: releaseToolEndpoints,
  [Methods.POST]: {
    handler: async ({ data, locale, logger }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).releaseToolRepository.execute(data, locale, logger),
  },
});
