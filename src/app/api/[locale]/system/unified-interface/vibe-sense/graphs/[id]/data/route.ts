/**
 * Vibe Sense — Graph Detail + Data Route
 *
 * GET  — Fetch graph metadata (for the chart workspace)
 * POST — Execute graph and return time-series data
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { scopedTranslation as vibeSenseScopedTranslation } from "../../../i18n";
import { VibeSenseRepository } from "../../../repository";

import definitions from "./definition";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ urlPathParams, user, logger, locale }) => {
      const t = vibeSenseScopedTranslation.scopedT(locale).t;
      return VibeSenseRepository.getGraph(urlPathParams.id, user, logger, t);
    },
  },
  [Methods.POST]: {
    handler: async ({ data, urlPathParams, user, logger, locale }) => {
      const t = vibeSenseScopedTranslation.scopedT(locale).t;
      return VibeSenseRepository.getGraphData(
        urlPathParams.id,
        { rangeFrom: data.rangeFrom, rangeTo: data.rangeTo },
        user,
        logger,
        t,
      );
    },
  },
});
