/**
 * WS Provider Models API Route Handler
 * /api/agent/ai-stream/ws-provider/models
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { WsProviderModelsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: () => WsProviderModelsRepository.listModels(),
  },
});
