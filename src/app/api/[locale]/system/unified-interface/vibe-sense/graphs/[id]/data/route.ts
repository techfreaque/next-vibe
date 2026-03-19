/**
 * Vibe Sense — Graph Detail + Data Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
