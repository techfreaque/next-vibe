/**
 * User Role Management API Route Handlers
 * Add/remove roles from specific users (admin only)
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { UserRoleManagementRepository } from "./repository";

export const { POST, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger }) =>
      UserRoleManagementRepository.addUserRole(
        data,
        urlPathParams,
        user,
        logger,
      ),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger }) =>
      UserRoleManagementRepository.removeUserRole(
        data,
        urlPathParams,
        user,
        logger,
      ),
  },
});
