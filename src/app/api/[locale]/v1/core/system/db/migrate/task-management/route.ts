/**
 * Database Migration Task Management Route
 * HTTP endpoint for database migration task operations
 * Optional route - only created because migration task management HTTP access is useful
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { migrationTaskManagementRepository as repository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, logger }) =>
      repository.executeMigrationTaskOperation(data, logger),
  },
});
