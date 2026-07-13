import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
/**
 * Batch Operations API Route Handler
 * Handles PATCH requests for batch updating leads
 */
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { BatchRepository } from "./repository";

export const { PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    handler: ({ data, logger, t, locale }) =>
      BatchRepository.batchUpdateLeads(data, logger, t, locale),
  },
  [Methods.DELETE]: {
    handler: ({ data, logger, t, locale }) =>
      BatchRepository.batchDeleteLeads(data, logger, locale, t),
  },
});
