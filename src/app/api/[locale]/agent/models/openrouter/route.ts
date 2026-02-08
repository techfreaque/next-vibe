/**
 * OpenRouter Models API Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import openRouterEndpoints from "./definition";
import { OpenRouterModelsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: openRouterEndpoints,
  [Methods.GET]: {
    handler: ({ logger }) => OpenRouterModelsRepository.fetchModels(logger),
  },
});
