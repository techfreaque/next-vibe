/**
 * Vibe Sense — Graph Promote Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { scopedTranslation as vibeSenseScopedTranslation } from "../../../i18n";
import { VibeSenseRepository } from "../../../repository";

import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ urlPathParams, logger, locale }) => {
      const t = vibeSenseScopedTranslation.scopedT(locale).t;
      return VibeSenseRepository.promoteGraph(urlPathParams.id, logger, t);
    },
  },
});
