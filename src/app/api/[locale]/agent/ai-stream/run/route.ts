/**
 * AI Stream Run Route
 * POST /api/[locale]/agent/ai-stream/run
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { AiStreamRunRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) =>
      AiStreamRunRepository.run(data, user, locale, logger),
  },
});
