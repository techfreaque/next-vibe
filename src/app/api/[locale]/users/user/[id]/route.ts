/**
 * Individual User API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { UserByIdRepository } from "./repository";

export const { GET, PUT, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      UserByIdRepository.getUserById(urlPathParams, user, logger, locale),
  },
  [Methods.PUT]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      UserByIdRepository.updateUser(data, urlPathParams, user, logger, locale),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      UserByIdRepository.deleteUser(urlPathParams, user, logger, locale),
  },
});
