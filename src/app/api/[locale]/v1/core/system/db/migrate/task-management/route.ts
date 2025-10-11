/**
 * Database Migration Task Management Route
 * HTTP endpoint for database migration task operations
 * Optional route - only created because migration task management HTTP access is useful
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import endpoints from "./definition";
import { migrationTaskManagementRepository as repository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, logger }) =>
      repository.executeMigrationTaskOperation(data, logger),
  },
});
