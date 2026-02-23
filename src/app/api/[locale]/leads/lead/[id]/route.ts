/**
 * Individual Lead API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { scopedTranslation as leadsScopedTranslation } from "../../i18n";
import { LeadsRepository } from "../../repository";
import definitions from "./definition";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ urlPathParams, logger, locale }) => {
      const leadsT = leadsScopedTranslation.scopedT(locale).t;
      return await LeadsRepository.getLeadById(
        urlPathParams.id,
        logger,
        leadsT,
      );
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async ({ urlPathParams, data, logger, locale }) => {
      const leadsT = leadsScopedTranslation.scopedT(locale).t;
      return await LeadsRepository.updateLead(
        urlPathParams.id,
        data,
        logger,
        leadsT,
      );
    },
  },
});
