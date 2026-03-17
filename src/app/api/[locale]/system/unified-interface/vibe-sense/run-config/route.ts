/**
 * Vibe Sense — Run Config Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { scopedTranslation } from "./i18n";
import { RunConfigRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, logger, locale }) => {
      const t = scopedTranslation.scopedT(locale).t;
      return RunConfigRepository.execute(data, logger, t);
    },
  },
});
