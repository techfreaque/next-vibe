/**
 * Vibe Sense - Graph Version History Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";
import { VibeSenseRepository } from "next-vibe/core/utils/dataflow/repository";

import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      VibeSenseRepository.getVersionChain(
        urlPathParams.id,
        user,
        logger,
        locale,
      ),
  },
});
