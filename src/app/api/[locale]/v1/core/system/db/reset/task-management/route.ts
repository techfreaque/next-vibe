/**
 * Database Reset Task Management Route
 * HTTP endpoint for database reset task operations
 * Optional route - only created because task management HTTP access is useful
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import endpoints from "./definition";
import { resetTaskManagementRepository as repository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      repository.executeTaskOperation(data, user, locale, logger),
  },
});
