/**
 * Individual Lead API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { LeadsRepository } from "../../repository";
import definitions from "./definition";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ urlPathParams, logger }) => {
      return await LeadsRepository.getLeadById(urlPathParams.id, logger);
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async ({ urlPathParams, data, logger }) => {
      return await LeadsRepository.updateLead(urlPathParams.id, data, logger);
    },
  },
});
