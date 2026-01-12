/**
 * Batch Operations API Route Handler
 * Handles PATCH requests for batch updating leads
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { BatchRepository } from "./repository";

export const { PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    handler: ({ data, logger }) =>
      BatchRepository.batchUpdateLeads(data, logger),
  },
  [Methods.DELETE]: {
    handler: ({ data, logger }) =>
      BatchRepository.batchDeleteLeads(data, logger),
  },
});
