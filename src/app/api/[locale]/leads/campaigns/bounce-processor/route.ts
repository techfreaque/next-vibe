/**
 * Bounce Processor Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { scopedTranslation } from "./i18n";
import { BounceProcessorRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, locale }) => {
      const { t } = scopedTranslation.scopedT(locale);
      return BounceProcessorRepository.run(data, logger, t);
    },
  },
});
