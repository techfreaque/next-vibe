/**
 * Individual Lead API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

import { leadsRepository } from "../../repository";
import definitions from "./definition";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ urlVariables, user, locale, logger }) => {
      return await leadsRepository.getLeadById(urlVariables.id, user, locale, logger);
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async ({ urlVariables, data, user, locale, logger }) => {
      return await leadsRepository.updateLead(urlVariables.id, data, user, locale, logger);
    },
  },
});
