/**
 * Media Model Prices API Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import mediaPricesEndpoints from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: mediaPricesEndpoints,
  [Methods.GET]: {
    handler: async ({ logger, t }) => {
      const { MediaPricesRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return MediaPricesRepository.fetchAndUpdate(logger, t);
    },
  },
});
