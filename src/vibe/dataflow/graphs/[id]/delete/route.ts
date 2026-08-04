/**
 * Vibe Sense - Graph Delete Route
 */

import "server-only";

import { Methods } from "../../../../core/definition/enums";
import { endpointsHandler } from "../../../../core/route/multi";
import { VibeSenseRepository } from "../../../repository";
import definitions from "./definition";

export const { DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.DELETE]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      VibeSenseRepository.deleteGraph(urlPathParams.id, user, logger, locale),
  },
});
