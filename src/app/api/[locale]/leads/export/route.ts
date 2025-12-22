/**
 * Leads Export API Route Handler
 * Handles CSV/Excel export operations for leads
 */
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { LeadsRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, logger, t }) => {
      return await LeadsRepository.exportLeads(data, logger, t);
    },
  },
});
