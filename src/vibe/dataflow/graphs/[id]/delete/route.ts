/**
 * Vibe Sense - Graph Delete Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";
import { VibeSenseRepository } from "next-vibe/dataflow/repository";

import definitions from "./definition";

export const { DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.DELETE]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      VibeSenseRepository.deleteGraph(urlPathParams.id, user, logger, locale),
  },
});
