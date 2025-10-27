/**
 * Leads Export API Route Handler
 * Handles CSV/Excel export operations for leads
 */
import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import { leadsRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, locale, logger, t }) => {
      return await leadsRepository.exportLeads(data, user, locale, logger, t);
    },
  },
});
