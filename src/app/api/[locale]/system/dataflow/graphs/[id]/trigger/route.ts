/**
 * Vibe Sense - Graph Trigger Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";
import { VibeSenseRepository } from "next-vibe/dataflow/repository";

import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      VibeSenseRepository.triggerGraph(
        urlPathParams.id,
        { rangeFrom: data.rangeFrom, rangeTo: data.rangeTo },
        user,
        logger,
        locale,
      ),
  },
});
