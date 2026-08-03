/**
 * Vibe Sense - Graph Detail + Data Route
 */

import "server-only";

import { Methods } from "../../../../core/definition/enums";
import { endpointsHandler } from "../../../../core/route/multi";
import { VibeSenseRepository } from "../../../repository";

import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      VibeSenseRepository.getGraph(
        urlPathParams.id,
        { resolution: data.resolution, cursor: data.cursor },
        user,
        logger,
        locale,
      ),
  },
});
