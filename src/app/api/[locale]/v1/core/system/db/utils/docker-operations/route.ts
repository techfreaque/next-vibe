/**
 * Docker Operations Route
 * HTTP endpoint for Docker command execution
 * Optional route - only created because HTTP access is useful for this utility
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import endpoints from "./definition";
import { dockerOperationsRepository as repository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, locale, logger }) => {
      return repository.executeCommand(data, locale, logger);
    },
  },
});
