import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
/**
 * CSV Import API Route Handlers
 * Next.js API route handlers with validation and notifications
 */
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { LeadsImportRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale, t }) =>
      LeadsImportRepository.importLeadsFromCsv(data, user, logger, t, locale),
  },
});
