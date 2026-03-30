/**
 * Build the application Route
 * API route for build the application
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import buildEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: buildEndpoints,
  [Methods.POST]: {
    handler: async ({ data, locale, logger, t }) => {
      const { BuildRepository } = await import(/* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository");
      return BuildRepository.execute(data, locale, logger, t);
    },
  },
});
