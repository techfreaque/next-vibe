/**
 * Vibe Sense - Graph Backtest Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";
import { VibeSenseRepository } from "next-vibe/core/utils/dataflow/repository";

import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      VibeSenseRepository.backtestGraph(
        urlPathParams.id,
        {
          rangeFrom: data.rangeFrom,
          rangeTo: data.rangeTo,
          resolution: data.resolution,
        },
        user,
        logger,
        locale,
      ),
  },
});
