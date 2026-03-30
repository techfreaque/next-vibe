/**
 * OpenRouter Models API Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import openRouterEndpoints from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: openRouterEndpoints,
  [Methods.GET]: {
    handler: async ({ logger, t }) => {
      const { OpenRouterModelsRepository } = await import("./repository");
      return OpenRouterModelsRepository.fetchModels(logger, t);
    },
  },
});
