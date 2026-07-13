/**
 * Vibe Sense - Graph Promote Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";
import { VibeSenseRepository } from "next-vibe/dataflow/repository";

import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ urlPathParams, logger, locale }) =>
      VibeSenseRepository.promoteGraph(urlPathParams.id, logger, locale),
  },
});
