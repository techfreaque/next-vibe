/**
 * Login Route Handler
 * Production-ready route handler following new pattern
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { LoginRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, request, logger, platform, locale, t }) =>
      LoginRepository.login(data, user, locale, request, logger, platform, t),
  },
});
