/**
 * Unified Model Prices API Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import modelPricesEndpoints from "./definition";
import { ModelPricesRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: modelPricesEndpoints,
  [Methods.GET]: {
    handler: ({ logger, t }) => ModelPricesRepository.fetchAndUpdate(logger, t),
  },
});
