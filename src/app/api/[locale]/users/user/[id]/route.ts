/**
 * Individual User API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { UserByIdRepository } from "./repository";

export const { GET, PUT, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger }) =>
      UserByIdRepository.getUserById(urlPathParams, user, logger),
  },
  [Methods.PUT]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger }) =>
      UserByIdRepository.updateUser(data, urlPathParams, user, logger),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger }) =>
      UserByIdRepository.deleteUser(urlPathParams, user, logger),
  },
});
