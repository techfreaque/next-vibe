/**
 * Users Create API Route Handler
 * Handles POST requests for creating new users
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import {
  userCreateAdminNotificationEmailTemplate,
  userCreateWelcomeEmailTemplate,
} from "../../user/public/signup/email";
import definitions from "./definition";
import { UserCreateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: [
      {
        template: userCreateWelcomeEmailTemplate,
        ignoreErrors: false,
      },
      {
        template: userCreateAdminNotificationEmailTemplate,
        ignoreErrors: true,
      },
    ],
    handler: async ({ data, user, locale, logger, t }) =>
      UserCreateRepository.createUser(data, user, locale, logger, t),
  },
});
