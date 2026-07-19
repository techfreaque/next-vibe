/**
 * User Role Management API Route Handlers
 * Add/remove roles from specific users (admin only)
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { UserRoleManagementRepository } from "./repository";

export const { POST, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      UserRoleManagementRepository.addUserRole(
        data,
        urlPathParams,
        user,
        logger,
        locale,
      ),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      UserRoleManagementRepository.removeUserRole(
        data,
        urlPathParams,
        user,
        logger,
        locale,
      ),
  },
});
