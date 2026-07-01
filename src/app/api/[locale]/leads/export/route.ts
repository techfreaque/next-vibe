import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
/**
 * Leads Export API Route Handler
 * Handles CSV/Excel export operations for leads
 */
import { endpointsHandler } from "next-vibe/core/route/multi";
import { LeadsRepository } from "next-vibe/identity/lead/repository";

import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      LeadsRepository.exportLeads(data, logger, locale),
  },
});
