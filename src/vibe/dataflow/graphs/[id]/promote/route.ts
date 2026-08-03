/**
 * Vibe Sense - Graph Promote Route
 */

import "server-only";

import { Methods } from "../../../../core/definition/enums";
import { endpointsHandler } from "../../../../core/route/multi";
import { VibeSenseRepository } from "../../../repository";

import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ urlPathParams, logger, locale }) =>
      VibeSenseRepository.promoteGraph(urlPathParams.id, logger, locale),
  },
});
