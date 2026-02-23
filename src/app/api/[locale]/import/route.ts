/**
 * Import API Route Handlers
 * Next.js API route handlers with validation and business logic delegation
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { importRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ t }) => importRepository.importCsv(t),
  },
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, logger, t }) =>
      importRepository.listImportJobs(user.id, data, logger, t),
  },
});
