/**
 * User Profile (Me) Route Handlers
 * Production-ready route handlers following new pattern
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import meEndpoints from "./definition";
import { emailChangeConfirmEmailTemplate } from "./email";
import { UserProfileRepository } from "./repository";

export const { GET, POST, DELETE, tools } = endpointsHandler({
  endpoint: meEndpoints,
  [Methods.GET]: {
    handler: ({ user, logger, locale, t }) =>
      UserProfileRepository.getProfile(user, locale, logger, t),
  },
  [Methods.POST]: {
    // A requested new address gets its confirm link (no-op otherwise)
    email: [{ template: emailChangeConfirmEmailTemplate, ignoreErrors: true }],
    handler: ({ data, user, logger, locale, t }) =>
      UserProfileRepository.updateProfile(data, user, locale, logger, t),
  },
  [Methods.DELETE]: {
    handler: ({ user, logger, locale, t }) =>
      UserProfileRepository.deleteAccount(user, locale, logger, t),
  },
});
