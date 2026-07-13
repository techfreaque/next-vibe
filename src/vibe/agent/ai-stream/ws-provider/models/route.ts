/**
 * WS Provider Models API Route Handler
 * /api/agent/ai-stream/ws-provider/models
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { WsProviderModelsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: () => WsProviderModelsRepository.listModels(),
  },
});
