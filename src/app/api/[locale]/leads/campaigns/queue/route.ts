/**
 * Campaign Queue API Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { scopedTranslation } from "./i18n";
import { CampaignQueueRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, logger, locale }) => {
      const { t } = scopedTranslation.scopedT(locale);
      return CampaignQueueRepository.getQueue(data, logger, t);
    },
  },
});
