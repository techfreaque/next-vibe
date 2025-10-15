/**
 * Import API Route Handlers
 * Next.js API route handlers with validation and business logic delegation
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import { importRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger }) => {
      return importRepository.importCsv(data, user, logger);
    },
  },
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, logger }) => {
      return await importRepository.listImportJobs(user.id, data, logger);
    },
  },
});
