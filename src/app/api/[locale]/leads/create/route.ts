/**
 * Leads Create API Route Handler
 * Handles POST requests for creating new leads
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { scopedTranslation as leadsScopedTranslation } from "../i18n";
import { LeadsRepository } from "../repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, logger, locale }) => {
      const leadsT = leadsScopedTranslation.scopedT(locale).t;
      return LeadsRepository.createLead(data, logger, leadsT);
    },
  },
});
