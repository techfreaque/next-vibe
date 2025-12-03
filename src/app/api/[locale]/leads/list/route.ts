/**
 * Leads List API Route Handler
 * Handles GET requests for listing leads with filtering and pagination
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { leadsListRepository as repository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ data, user, logger, locale }) =>
      repository.listLeads(data, user, logger, locale),
  },
});
