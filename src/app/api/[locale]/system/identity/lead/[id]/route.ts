import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
/**
 * Individual Lead API Route Handlers
 * Next.js API route handlers with validation and notifications
 */
import { endpointsHandler } from "next-vibe/core/route/multi";

import { LeadsRepository } from "../repository";
import definitions from "./definition";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, logger, locale }) =>
      LeadsRepository.getLeadById(urlPathParams.id, logger, locale),
  },
  [Methods.PATCH]: {
    handler: ({ urlPathParams, data, logger, locale }) =>
      LeadsRepository.updateLead(urlPathParams.id, data, logger, locale),
  },
  [Methods.DELETE]: {
    handler: ({ urlPathParams, logger, locale }) =>
      LeadsRepository.deleteLead(urlPathParams.id, logger, locale),
  },
});
