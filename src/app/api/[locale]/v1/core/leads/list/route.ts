/**
 * Leads List API Route Handler
 * Handles GET requests for listing leads with filtering and pagination
 */

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";

import endpoints from "./definition";
import { leadsListRepository as repository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ data, user, logger, locale }) =>
      repository.listLeads(data, user, logger, locale),
  },
});
