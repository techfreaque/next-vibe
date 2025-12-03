/**
 * Build the application Route
 * API route for build the application
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import buildEndpoints from "./definition";
import { buildRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: buildEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) => {
      return buildRepository.execute(data, user, locale, logger);
    },
  },
});
