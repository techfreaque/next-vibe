/**
 * Vibe Sense - Graph Archive Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";
import { VibeSenseRepository } from "next-vibe/core/utils/dataflow/repository";

import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      VibeSenseRepository.archiveGraph(urlPathParams.id, user, logger, locale),
  },
});
