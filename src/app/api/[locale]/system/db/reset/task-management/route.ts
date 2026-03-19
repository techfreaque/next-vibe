/**
 * Database Reset Task Management Route
 * HTTP endpoint for database reset task operations
 * Optional route - only created because task management HTTP access is useful
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { ResetTaskManagementRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, t, logger }) =>
      ResetTaskManagementRepository.executeTaskOperation(data, t, logger),
  },
});
