/**
 * Vibe Sense — Graphs List + Create Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { scopedTranslation as vibeSenseScopedTranslation } from "../i18n";
import { VibeSenseRepository } from "../repository";

import definitions from "./definition";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ user, logger, locale }) => {
      const t = vibeSenseScopedTranslation.scopedT(locale).t;
      return VibeSenseRepository.listGraphs(user, logger, t);
    },
  },
  [Methods.POST]: {
    handler: async ({ data, user, logger, locale }) => {
      const t = vibeSenseScopedTranslation.scopedT(locale).t;
      return VibeSenseRepository.createGraph(
        {
          name: data.name,
          slug: data.slug,
          description: data.description,
          config: data.config,
        },
        user,
        logger,
        t,
      );
    },
  },
});
