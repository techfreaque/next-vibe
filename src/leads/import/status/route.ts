import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
/**
 * Import Jobs Management API Routes
 * Comprehensive CRUD operations for import jobs
 */
import { endpointsHandler } from "next-vibe/core/route/multi";

import { LeadsImportRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, data, logger, t }) =>
      LeadsImportRepository.listImportJobsFormatted(
        user.id,
        {
          status: data.filters.status,
          limit: data.filters.limit || 50,
          offset: data.filters.offset || 0,
        },
        logger,
        t,
      ),
  },
});
