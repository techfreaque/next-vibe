/**
 * Config Create Route Handler
 * Handles POST requests for creating check.config.ts
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import configCreateEndpoints from "./definition";
import { ConfigCreateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: configCreateEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger, locale, platform }) => {
      return ConfigCreateRepository.execute(data, logger, locale, platform);
    },
  },
});
