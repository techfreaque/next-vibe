/**
 * Individual User API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import { userByIdRepository } from "./repository";

export const { GET, PUT, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: async ({ urlVariables, user, locale, logger }) => {
      return await userByIdRepository.getUserById(
        { id: urlVariables.id },
        user,
        locale,
        logger,
      );
    },
  },
  [Methods.PUT]: {
    email: undefined,
    handler: async ({ data, urlVariables, user, logger }) => {
      return await userByIdRepository.updateUser(
        data,
        urlVariables.id,
        user,
        logger,
      );
    },
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: async ({ urlVariables, user, locale, logger }) => {
      return await userByIdRepository.deleteUser(
        { id: urlVariables.id },
        user,
        locale,
        logger,
      );
    },
  },
});
