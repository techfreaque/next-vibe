/**
 * Individual Lead API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { LeadsRepository } from "../../repository";
import definitions from "./definition";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, logger, locale }) =>
      LeadsRepository.getLeadById(urlPathParams.id, logger, locale),
  },
  [Methods.PATCH]: {
    handler: ({ urlPathParams, data, logger, locale }) =>
      LeadsRepository.updateLead(urlPathParams.id, data, logger, locale),
  },
  [Methods.DELETE]: {
    handler: ({ urlPathParams, logger, locale }) =>
      LeadsRepository.deleteLead(urlPathParams.id, logger, locale),
  },
});
