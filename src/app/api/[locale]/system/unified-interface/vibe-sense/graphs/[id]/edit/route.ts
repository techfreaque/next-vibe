/**
 * Vibe Sense - Graph Edit (Branch) Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { GraphEditRepository } from "./repository";

export const { PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PUT]: {
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      GraphEditRepository.upsert(data, urlPathParams.id, user, logger, locale),
  },
});
