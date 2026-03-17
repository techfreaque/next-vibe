/**
 * Vibe Sense — Graph Version History Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { scopedTranslation as vibeSenseScopedTranslation } from "../../../i18n";
import { VibeSenseRepository } from "../../../repository";

import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ urlPathParams, user, logger, locale }) => {
      const t = vibeSenseScopedTranslation.scopedT(locale).t;
      return VibeSenseRepository.getVersionChain(
        urlPathParams.id,
        user,
        logger,
        t,
      );
    },
  },
});
