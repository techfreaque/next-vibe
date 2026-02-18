/**
 * Users Create API Route Handler
 * Handles POST requests for creating new users
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import {
  renderAdminSignupNotification,
  renderRegisterMail,
} from "@/app/api/[locale]/user/public/signup/email";
import { userCreateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: [
      {
        render: renderRegisterMail,
        ignoreErrors: false,
      },
      {
        render: renderAdminSignupNotification,
        ignoreErrors: true, // Don't fail user creation if admin notification fails
      },
    ],
    handler: async ({ data, user, locale, logger, t }) => {
      return await userCreateRepository.createUser(
        data,
        user,
        locale,
        logger,
        t,
      );
    },
  },
});
