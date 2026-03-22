/**
 * Users Create API Route Handler
 * Handles POST requests for creating new users
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  userCreateAdminNotificationEmailTemplate,
  userCreateWelcomeEmailTemplate,
} from "@/app/api/[locale]/user/public/signup/email";

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
    handler: async ({ data, user, locale, logger, t }) => {
      return await UserCreateRepository.createUser(
        data,
        user,
        locale,
        logger,
        t,
      );
    },
  },
});
