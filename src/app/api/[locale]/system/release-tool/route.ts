/**
 * Release Tool Route
 * API route for managing package releases
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import releaseToolEndpoints from "./definition";
import { releaseToolRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: releaseToolEndpoints,
  [Methods.POST]: {
    handler: ({ data, locale, logger }) => {
      return releaseToolRepository.execute(data, locale, logger);
    },
  },
});
