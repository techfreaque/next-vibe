/**
 * Journey Variants Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { scopedTranslation } from "./i18n";
import { JourneyVariantsRepository } from "./repository";

export const { GET, POST, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ logger, locale }) => {
      const { t } = scopedTranslation.scopedT(locale);
      return JourneyVariantsRepository.getAll(logger, t);
    },
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, locale }) => {
      const { t } = scopedTranslation.scopedT(locale);
      return JourneyVariantsRepository.register(data, logger, t);
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, logger, locale }) => {
      const { t } = scopedTranslation.scopedT(locale);
      return JourneyVariantsRepository.update(data, logger, t);
    },
  },
});
