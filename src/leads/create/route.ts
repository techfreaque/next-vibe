import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
/**
 * Leads Create API Route Handler
 * Handles POST requests for creating new leads
 */
import { endpointsHandler } from "next-vibe/core/route/multi";
import { LeadsRepository } from "next-vibe/identity/lead/repository";

import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, logger, locale }) =>
      LeadsRepository.createLead(data, logger, locale),
  },
});
