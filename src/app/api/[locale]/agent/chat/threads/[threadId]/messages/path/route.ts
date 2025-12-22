/**
 * Message Path Route Handler
 * Handles GET requests for getting message paths
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { definitions } from "./definition";
import { pathRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, data, user, locale, logger }) =>
      pathRepository.getPath(urlPathParams, data, user, locale, logger),
  },
});
