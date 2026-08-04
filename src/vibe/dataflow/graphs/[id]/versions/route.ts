/**
 * Vibe Sense - Graph Version History Route
 */

import "server-only";

import { Methods } from "../../../../core/definition/enums";
import { endpointsHandler } from "../../../../core/route/multi";
import { VibeSenseRepository } from "../../../repository";
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
