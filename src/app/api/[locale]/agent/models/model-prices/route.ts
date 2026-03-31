/**
 * Unified Model Prices API Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import modelPricesEndpoints from "./definition";
import { ModelPricesRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: modelPricesEndpoints,
  [Methods.GET]: {
    handler: ({ logger, t }) => ModelPricesRepository.fetchAndUpdate(logger, t),
  },
});
