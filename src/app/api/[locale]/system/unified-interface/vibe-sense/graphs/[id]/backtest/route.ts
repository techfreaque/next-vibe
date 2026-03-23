/**
 * Vibe Sense - Graph Backtest Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { VibeSenseRepository } from "../../../repository";

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
