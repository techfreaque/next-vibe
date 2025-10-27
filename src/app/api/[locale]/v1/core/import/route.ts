/**
 * Import API Route Handlers
 * Next.js API route handlers with validation and business logic delegation
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import definitions from "./definition";
import { importRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: () => importRepository.importCsv(),
  },
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, logger }) =>
      importRepository.listImportJobs(user.id, data, logger),
  },
});
