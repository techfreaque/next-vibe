/**
 * Public Creator Profile Route Handler
 */

import "server-only";

import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";

import endpoints from "./definition";
import { CreatorProfileRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ data, locale, logger, t }) =>
      CreatorProfileRepository.getCreatorProfile(data, locale, logger, t),
  },
});
