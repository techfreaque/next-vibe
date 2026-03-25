/**
 * Media Model Prices API Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import mediaPricesEndpoints from "./definition";
import { MediaPricesRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: mediaPricesEndpoints,
  [Methods.GET]: {
    handler: ({ logger, t }) => MediaPricesRepository.fetchAndUpdate(logger, t),
  },
});
