/**
 * Users List API Route Handler
 * Handles GET requests for listing users with filtering and pagination
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { UserListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, logger, locale }) =>
      UserListRepository.listUsers(data, user, logger, locale),
  },
});
