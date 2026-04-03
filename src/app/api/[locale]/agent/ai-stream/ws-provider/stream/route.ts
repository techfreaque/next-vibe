/**
 * WS Provider Stream Route Handler
 * POST /api/[locale]/agent/ai-stream/ws-provider/stream
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { WsProviderStreamRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, locale, logger, user, request }) =>
      WsProviderStreamRepository.stream({
        data,
        locale,
        logger,
        user,
        request,
      }),
  },
});
