/**
 * Vibe Sense - Graph Detail + Data Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";
import { VibeSenseRepository } from "next-vibe/dataflow/repository";

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
