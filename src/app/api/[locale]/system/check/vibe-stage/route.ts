/**
 * Vibe Stage Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import vibeStageEndpoints from "./definition";
import { VibeStageRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: vibeStageEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger, locale, t }) =>
      VibeStageRepository.execute(data, logger, locale, t),
  },
});
