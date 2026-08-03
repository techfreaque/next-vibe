/**
 * Vibe Sense - Graph Edit (Branch) Route
 */

import "server-only";

import { Methods } from "../../../../core/definition/enums";
import { endpointsHandler } from "../../../../core/route/multi";

import definitions from "./definition";
import { GraphEditRepository } from "./repository";

export const { PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PUT]: {
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      GraphEditRepository.upsert(data, urlPathParams.id, user, logger, locale),
  },
});
